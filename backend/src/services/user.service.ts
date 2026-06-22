import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../configs/constant";
import {
  CreateUserDTO,
  LoginUserDTO,
  UpdatePasswordDTO,
  UpdateUserDTO,
} from "../dtos/user.dto";
import { HttpException } from "../exceptions/http-exception";
import { IUser } from "../models/user.model";
import { UserMongoRepository } from "../repositories/user.repository";

const userRepository = new UserMongoRepository();

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
      role: user.role,
      createdAt: user.createdAt,
    };
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
}
