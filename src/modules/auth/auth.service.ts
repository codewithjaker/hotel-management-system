import { User } from "../user/user.model";
import { UserService } from "../user/user.service";
import { generateTokens, verifyRefreshToken } from "./auth.utils";
import { IJwtPayload, ILoginResponse } from "./auth.types";
import { ApiError } from "../../utils/apiResponse";

export class AuthService {
    // Add this method inside AuthService class
static async register(userData: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  hotelId?: string;
}): Promise<ILoginResponse> {
  // Check if user already exists
  const existingUser = await User.findOne({ email: userData.email });
  if (existingUser) {
    throw new ApiError(409, "Email already registered");
  }

  // Create new user – default role = receptionist, status = active
  const user = await User.create({
    firstName: userData.firstName,
    lastName: userData.lastName,
    email: userData.email,
    passwordHash: userData.password, // will be hashed by pre-save hook
    role: "receptionist",
    status: "active",
    hotelId: userData.hotelId || null,
  });

  // Auto-login after registration (optional)
  const payload: IJwtPayload = {
    id: user._id,
    email: user.email,
    role: user.role,
    hotelId: user.hotelId || undefined,
  };
  const tokens = generateTokens(payload);
  const userObj = user.toJSON();

  return { user: userObj, tokens };
}
  static async login(email: string, password: string): Promise<ILoginResponse> {
    const user = await User.findOne({ email }).select("+passwordHash");
    if (!user) throw new ApiError(401, "Invalid email or password");
    if (user.status !== "active")
      throw new ApiError(401, "Account is inactive or suspended");

    const isMatch = await user.comparePassword(password);
    if (!isMatch) throw new ApiError(401, "Invalid email or password");

    await UserService.updateLastLogin(user._id);

    const payload: IJwtPayload = {
      id: user._id,
      email: user.email,
      role: user.role,
      hotelId: user.hotelId || undefined,
    };
    const tokens = generateTokens(payload);
    const userObj = user.toJSON();
    return { user: userObj, tokens };
  }

  static async refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
    try {
      const payload = verifyRefreshToken(refreshToken);
      const user = await User.findById(payload.id);
      if (!user || user.status !== "active")
        throw new ApiError(401, "Invalid refresh token");
      const newAccessToken = generateTokens({
        id: user._id,
        email: user.email,
        role: user.role,
        hotelId: user.hotelId || undefined,
      }).accessToken;
      return { accessToken: newAccessToken };
    } catch (error) {
      throw new ApiError(401, "Invalid or expired refresh token");
    }
  }

  static async logout(userId: string): Promise<void> {
    // In a stateless JWT system, we don't need to do anything server-side.
    // But you could implement a token blacklist in Redis if required.
    return;
  }
}