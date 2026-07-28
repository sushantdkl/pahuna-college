import { Types } from "mongoose";
import {
  IPasswordResetToken,
  PasswordResetTokenModel,
} from "../models/password-reset-token.model";

export class PasswordResetTokenRepository {
  create(data: {
    userId: Types.ObjectId;
    tokenHash: string;
    expiresAt: Date;
  }): Promise<IPasswordResetToken> {
    return PasswordResetTokenModel.create(data);
  }

  findActiveByHash(tokenHash: string): Promise<IPasswordResetToken | null> {
    return PasswordResetTokenModel.findOne({
      tokenHash,
      usedAt: { $exists: false },
      revokedAt: { $exists: false },
    });
  }

  async revokeActiveForUser(userId: Types.ObjectId) {
    await PasswordResetTokenModel.updateMany(
      {
        userId,
        usedAt: { $exists: false },
        revokedAt: { $exists: false },
      },
      {
        $set: { revokedAt: new Date() },
      },
    );
  }

  markUsed(id: string): Promise<IPasswordResetToken | null> {
    return PasswordResetTokenModel.findByIdAndUpdate(
      id,
      { $set: { usedAt: new Date() } },
      { returnDocument: "after" },
    );
  }
}
