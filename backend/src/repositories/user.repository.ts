import { UserModel, IUser } from "../models/user.model";

// The repository is the only Sprint 2 auth layer that talks directly to MongoDB.
export interface IUserRepository {
  getUserByEmail(email: string): Promise<IUser | null>;
  createUser(user: Partial<IUser>): Promise<IUser>;
  getUserById(id: string): Promise<IUser | null>;
  getAll(): Promise<IUser[]>;
  update(id: string, user: Partial<IUser>): Promise<IUser | null>;
  delete(id: string): Promise<boolean>;
}

export class UserMongoRepository implements IUserRepository {
  async getUserById(id: string): Promise<IUser | null> {
    return UserModel.findOne({ _id: id });
  }

  async getUserByEmail(email: string): Promise<IUser | null> {
    // Services use this lookup for both duplicate registration checks and login identity checks.
    return UserModel.findOne({ email });
  }

  async createUser(user: Partial<IUser>): Promise<IUser> {
    return UserModel.create(user);
  }

  async getAll(): Promise<IUser[]> {
    return UserModel.find();
  }

  async update(id: string, user: Partial<IUser>): Promise<IUser | null> {
    return UserModel.findByIdAndUpdate(id, user, {
      new: true,
    });
  }

  async delete(id: string): Promise<boolean> {
    const deleted = await UserModel.findByIdAndDelete(id);
    return !!deleted;
  }
}
