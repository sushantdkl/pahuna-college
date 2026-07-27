import bcryptjs from "bcryptjs";
import mongoose from "mongoose";
import { isDefaultAdminEmail } from "../configs/default-admin.config";
import { AdminCreateUserDTO, AdminUpdateUserDTO } from "../dtos/admin-user.dto";
import { HttpException } from "../exceptions/http-exception";
import { IUser, UserModel } from "../models/user.model";
import { UserMongoRepository } from "../repositories/user.repository";

type ListUsersParams = {
  page?: string;
  limit?: string;
  search?: string;
  role?: string;
  active?: string;
  verified?: string;
};

type UserListFilter = {
  $or?: Array<Record<string, unknown>>;
  role?: "admin" | "user";
  isActive?: boolean;
  emailVerified?: boolean;
};

const userRepository = new UserMongoRepository();

export class AdminUserService {
  private toAdminUser(user: IUser) {
    return {
      _id: user._id.toString(),
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
      updatedAt: user.updatedAt,
    };
  }

  private assertValidId(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new HttpException(400, "Invalid user id");
    }
  }

  async listUsers(params: ListUsersParams) {
    const page = Math.max(Number(params.page) || 1, 1);
    const limit = Math.min(Math.max(Number(params.limit) || 10, 1), 50);
    const skip = (page - 1) * limit;
    const search = params.search?.trim();
    const filter: UserListFilter = search
      ? {
          $or: [
            { fullName: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
            { phoneNumber: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    if (params.role === "admin" || params.role === "user") {
      Object.assign(filter, { role: params.role });
    }

    if (params.active === "true" || params.active === "false") {
      Object.assign(filter, { isActive: params.active === "true" });
    }

    if (params.verified === "true" || params.verified === "false") {
      Object.assign(filter, { emailVerified: params.verified === "true" });
    }

    const [users, total] = await Promise.all([
      UserModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      UserModel.countDocuments(filter),
    ]);

    return {
      users: users.map((user) => this.toAdminUser(user)),
      meta: {
        page,
        limit,
        total,
        totalPages: Math.max(Math.ceil(total / limit), 1),
      },
    };
  }

  async getUser(id: string) {
    this.assertValidId(id);

    const user = await userRepository.getUserById(id);

    if (!user) {
      throw new HttpException(404, "User not found");
    }

    return this.toAdminUser(user);
  }

  async createUser(payload: AdminCreateUserDTO) {
    const existingEmail = await userRepository.getUserByEmail(payload.email);

    if (existingEmail) {
      throw new HttpException(400, "Email already exists");
    }

    const hashedPassword = await bcryptjs.hash(payload.password, 10);
    const user = await userRepository.createUser({
      ...payload,
      password: hashedPassword,
    });

    return this.toAdminUser(user);
  }

  async updateUser(id: string, payload: AdminUpdateUserDTO) {
    this.assertValidId(id);

    const currentUser = await userRepository.getUserById(id);
    if (!currentUser) {
      throw new HttpException(404, "User not found");
    }

    if (isDefaultAdminEmail(currentUser.email)) {
      const changesProtectedDefault =
        (payload.email && !isDefaultAdminEmail(payload.email))
        || payload.password !== undefined
        || payload.role !== undefined && payload.role !== "admin"
        || payload.isActive === false
        || payload.emailVerified === false;

      if (changesProtectedDefault) {
        throw new HttpException(
          400,
          "The default administrator credentials are protected",
        );
      }
    }

    if (payload.email) {
      const existingEmail = await userRepository.getUserByEmailExceptId(
        payload.email,
        id,
      );

      if (existingEmail) {
        throw new HttpException(400, "Email already exists");
      }
    }

    const updatePayload: Partial<IUser> = {
      fullName: payload.fullName,
      email: payload.email,
      phoneNumber: payload.phoneNumber,
      location: payload.location,
      bio: payload.bio,
      profileImage: payload.profileImage,
      isActive: payload.isActive,
      emailVerified: payload.emailVerified,
      role: payload.role,
    };

    if (payload.password?.trim()) {
      updatePayload.password = await bcryptjs.hash(payload.password, 10);
    }

    Object.keys(updatePayload).forEach((key) => {
      if (updatePayload[key as keyof typeof updatePayload] === undefined) {
        delete updatePayload[key as keyof typeof updatePayload];
      }
    });

    const user = await userRepository.update(id, updatePayload);

    if (!user) {
      throw new HttpException(404, "User not found");
    }

    return this.toAdminUser(user);
  }

  async deleteUser(id: string, currentAdminId: string) {
    this.assertValidId(id);

    if (id === currentAdminId) {
      throw new HttpException(400, "You cannot delete your own admin account");
    }

    const user = await userRepository.getUserById(id);
    if (!user) {
      throw new HttpException(404, "User not found");
    }

    if (isDefaultAdminEmail(user.email)) {
      throw new HttpException(400, "The default administrator cannot be deleted");
    }

    if (user.role === "admin") {
      const remainingAdmins = await UserModel.countDocuments({
        _id: { $ne: id },
        role: "admin",
        isActive: { $ne: false },
      });

      if (remainingAdmins < 1) {
        throw new HttpException(400, "At least one active administrator account is required");
      }
    }

    const deleted = await userRepository.delete(id);

    if (!deleted) {
      throw new HttpException(404, "User not found");
    }

    return { deleted: true };
  }
}
