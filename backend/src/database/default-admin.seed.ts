import bcryptjs from "bcryptjs";
import {
  DEFAULT_ADMIN_EMAIL,
  DEFAULT_ADMIN_PASSWORD,
} from "../configs/default-admin.config";
import { UserModel } from "../models/user.model";

export const ensureDefaultAdmin = async (): Promise<void> => {
  const email = DEFAULT_ADMIN_EMAIL;
  const hashedPassword = await bcryptjs.hash(DEFAULT_ADMIN_PASSWORD, 10);

  await UserModel.findOneAndUpdate(
    { email },
    {
      $set: {
        fullName: "Pahuna Admin",
        email,
        phoneNumber: "9800000000",
        password: hashedPassword,
        role: "admin",
        isActive: true,
        emailVerified: true,
      },
    },
    {
      returnDocument: "after",
      setDefaultsOnInsert: true,
      upsert: true,
    },
  );

  console.log(`Default admin ready: ${email}`);
};
