import { Types } from "mongoose";
import { User } from "./user.model";
import { IUser } from "./user.interface";
import { ApiError } from "../../utils/apiResponse";

export class UserService {
  static async create(userData: Partial<IUser>): Promise<IUser> {
    const existing = await User.findOne({ email: userData.email });
    if (existing) throw new ApiError(409, "Email already exists");
    const user = await User.create(userData);
    return user.toJSON();
  }

  static async findById(id: string | Types.ObjectId): Promise<IUser | null> {
    return User.findById(id).select("-passwordHash").lean();
  }

  static async findByEmail(email: string): Promise<IUser | null> {
    return User.findOne({ email }).lean();
  }

  static async findAll(
    filter: Record<string, any> = {},
    page = 1,
    limit = 10
  ): Promise<{ users: IUser[]; total: number }> {
    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      User.find(filter).skip(skip).limit(limit).select("-passwordHash").lean(),
      User.countDocuments(filter),
    ]);
    return { users, total };
  }

  static async updateById(
    id: string | Types.ObjectId,
    updateData: Partial<IUser>
  ): Promise<IUser | null> {
    // Prevent email duplication if email is being changed
    if (updateData.email) {
      const existing = await User.findOne({
        email: updateData.email,
        _id: { $ne: id },
      });
      if (existing) throw new ApiError(409, "Email already in use");
    }
    const user = await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    })
      .select("-passwordHash")
      .lean();
    return user;
  }

  static async deleteById(id: string | Types.ObjectId): Promise<boolean> {
    const result = await User.findByIdAndDelete(id);
    return !!result;
  }

  static async updateLastLogin(id: string | Types.ObjectId): Promise<void> {
    await User.findByIdAndUpdate(id, { lastLoginAt: new Date() });
  }

  static async changePassword(
    id: string | Types.ObjectId,
    oldPassword: string,
    newPassword: string
  ): Promise<void> {
    const user = await User.findById(id).select("+passwordHash");
    if (!user) throw new ApiError(404, "User not found");
    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch) throw new ApiError(401, "Old password is incorrect");
    user.passwordHash = newPassword;
    await user.save();
  }
}