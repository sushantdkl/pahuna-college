import bcryptjs from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { isDefaultAdminEmail } from "../configs/default-admin.config";
import { CLIENT_URL, SECRET_KEY } from "../configs/constant";
import {
  CreateUserDTO,
  LoginUserDTO,
  RequestPasswordResetDTO,
  ResetPasswordDTO,
  UpdatePasswordDTO,
  UpdateUserDTO,
} from "../dtos/user.dto";
import { HttpException } from "../exceptions/http-exception";
import { IUser } from "../models/user.model";
import { PasswordResetTokenRepository } from "../repositories/password-reset-token.repository";
import { UserMongoRepository } from "../repositories/user.repository";
import { emailNotificationService } from "./email-notification.service";

const userRepository = new UserMongoRepository();
const passwordResetTokenRepository = new PasswordResetTokenRepository();
const RESET_TOKEN_EXPIRY_MINUTES = 45;
const RESET_REQUEST_WINDOW_MS = 60 * 1000;
const resetRequestLog = new Map<string, number>();
const PASSWORD_RESET_GENERIC_MESSAGE =
  "If an account exists for that email, a password reset link has been sent.";

export class UserService {
  private async isPasswordMatch(password: string, savedPassword: string) {
    const isBcryptHash = savedPassword.startsWith("$2a$")
      || savedPassword.startsWith("$2b$")
      || savedPassword.startsWith("$2y$");

    if (isBcryptHash) {
      return bcryptjs.compare(password, savedPassword);
    }

    return password === savedPassword;
  }

  private toPublicUser(user: IUser) {
    // Auth responses expose only profile fields; the hashed password never leaves the backend.
    return {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      location: user.location,
      bio: user.bio,
      profileImage: user.profileImage,
      isActive: user.isActive ?? true,
      emailVerified: user.emailVerified ?? false,
      role: user.role,
      createdAt: user.createdAt,
    };
  }

  private hashResetToken(token: string) {
    return crypto.createHash("sha256").update(token).digest("hex");
  }

  private buildResetUrl(token: string) {
    const baseUrl = CLIENT_URL.replace(/\/$/, "");
    return `${baseUrl}/reset-password?token=${encodeURIComponent(token)}`;
  }

  async createUser(userData: CreateUserDTO) {
    // Duplicate email validation prevents two users from sharing the same login identity.
    const existingEmail = await userRepository.getUserByEmail(userData.email);

    if (existingEmail) {
      throw new HttpException(400, "Email already exists");
    }

    // Password hashing protects users if database records are ever exposed.
    const hashedPassword = await bcryptjs.hash(userData.password, 10);

    const user = await userRepository.createUser({
      ...userData,
      password: hashedPassword,
    });

    return this.toPublicUser(user);
  }

  async loginUser(loginData: LoginUserDTO) {
    // Login starts by finding the account attached to the submitted email address.
    const user = await userRepository.getUserByEmail(loginData.email);

    if (!user) {
      throw new HttpException(400, "Invalid email or password");
    }

    if (user.isActive === false) {
      throw new HttpException(403, "Account is inactive");
    }

    // bcrypt compares the submitted password against the stored hash without revealing the original password.
    const isPasswordValid = await this.isPasswordMatch(
      loginData.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new HttpException(400, "Invalid email or password");
    }

    // JWT is issued only after password verification succeeds, then used by the frontend for authenticated requests.
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
      },
      SECRET_KEY,
      {
        expiresIn: "30d",
      },
    );

    return {
      user: this.toPublicUser(user),
      token,
    };
  }

  getCurrentUser(user: IUser) {
    return this.toPublicUser(user);
  }

  async updateUserProfile(
    user: IUser,
    profileData: UpdateUserDTO,
    profileImage?: string,
  ) {
    if (
      isDefaultAdminEmail(user.email)
      && profileData.email
      && !isDefaultAdminEmail(profileData.email)
    ) {
      throw new HttpException(400, "The default administrator email is protected");
    }

    if (profileData.email && profileData.email !== user.email) {
      const existingEmail = await userRepository.getUserByEmailExceptId(
        profileData.email,
        user._id.toString(),
      );

      if (existingEmail) {
        throw new HttpException(400, "Email already exists");
      }
    }

    const updatedUser = await userRepository.update(user._id.toString(), {
      ...profileData,
      ...(profileImage ? { profileImage } : {}),
    });

    if (!updatedUser) {
      throw new HttpException(404, "User not found");
    }

    return this.toPublicUser(updatedUser);
  }

  async updatePassword(user: IUser, passwordData: UpdatePasswordDTO) {
    if (isDefaultAdminEmail(user.email)) {
      throw new HttpException(400, "The default administrator password is protected");
    }

    const isPasswordValid = await this.isPasswordMatch(
      passwordData.currentPassword,
      user.password,
    );

    if (!isPasswordValid) {
      throw new HttpException(400, "Current password is incorrect");
    }

    const hashedPassword = await bcryptjs.hash(passwordData.newPassword, 10);
    const updatedUser = await userRepository.update(user._id.toString(), {
      password: hashedPassword,
    });

    if (!updatedUser) {
      throw new HttpException(404, "User not found");
    }

    return {
      message: "Password updated successfully",
    };
  }

  async requestPasswordReset(data: RequestPasswordResetDTO) {
    const now = Date.now();
    const lastRequest = resetRequestLog.get(data.email) || 0;

    if (now - lastRequest < RESET_REQUEST_WINDOW_MS) {
      return { message: PASSWORD_RESET_GENERIC_MESSAGE };
    }

    resetRequestLog.set(data.email, now);

    const user = await userRepository.getUserByEmail(data.email);

    if (!user || user.isActive === false) {
      return { message: PASSWORD_RESET_GENERIC_MESSAGE };
    }

    const rawToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = this.hashResetToken(rawToken);
    const expiresAt = new Date(
      now + RESET_TOKEN_EXPIRY_MINUTES * 60 * 1000,
    );

    await passwordResetTokenRepository.revokeActiveForUser(user._id);
    await passwordResetTokenRepository.create({
      userId: user._id,
      tokenHash,
      expiresAt,
    });

    await emailNotificationService.sendPasswordResetEmail({
      to: user.email,
      fullName: user.fullName,
      resetUrl: this.buildResetUrl(rawToken),
      expiresMinutes: RESET_TOKEN_EXPIRY_MINUTES,
    });

    return { message: PASSWORD_RESET_GENERIC_MESSAGE };
  }

  async resetPassword(token: string, data: ResetPasswordDTO) {
    if (!token || token.length < 32) {
      throw new HttpException(400, "Invalid or expired password reset link");
    }

    const tokenHash = this.hashResetToken(token);
    const resetToken = await passwordResetTokenRepository.findActiveByHash(
      tokenHash,
    );

    if (!resetToken || resetToken.expiresAt.getTime() < Date.now()) {
      throw new HttpException(400, "Invalid or expired password reset link");
    }

    const user = await userRepository.getUserById(resetToken.userId.toString());

    if (!user || user.isActive === false) {
      throw new HttpException(400, "Invalid or expired password reset link");
    }

    const isSamePassword = await this.isPasswordMatch(data.newPassword, user.password);

    if (isSamePassword) {
      throw new HttpException(400, "New password must be different from the current password");
    }

    const hashedPassword = await bcryptjs.hash(data.newPassword, 10);
    await userRepository.update(user._id.toString(), {
      password: hashedPassword,
    });
    await passwordResetTokenRepository.markUsed(resetToken._id.toString());

    return {
      message: "Password reset successfully. Please log in with your new password.",
    };
  }
}
