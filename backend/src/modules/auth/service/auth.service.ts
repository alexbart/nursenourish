import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../../../prisma/prisma.js";
import { ApiError } from "../../../shared/ApiError.js";
import { ErrorCodes } from "@nursenourish/shared";
import type { RegisterInput } from "../validators/register.validator.js";
import type { LoginInput } from "../validators/login.validator.js";

const JWT_SECRET = process.env.JWT_SECRET || "secret";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "refresh-secret";

export class AuthService {
  async register(data: RegisterInput) {
    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) {
      throw new ApiError(409, ErrorCodes.BAD_REQUEST, "Email already exists");
    }

    if (data.phone) {
      const existingPhone = await prisma.user.findFirst({
        where: { phone: data.phone },
      });
      if (existingPhone) {
        throw new ApiError(409, ErrorCodes.BAD_REQUEST, "Phone number already registered");
      }
    }

    const passwordHash = await bcrypt.hash(data.password, 10);

    const userCreateData: any = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone ?? null,
      passwordHash,
      role: "CUSTOMER",
    };

    if (data.addressLine) {
      userCreateData.addresses = {
        create: {
          label: "Default",
          county: data.county ?? "",
          city: data.city ?? "",
          addressLine: data.addressLine,
          isDefault: true,
        },
      };
    }

    const user = await prisma.user.create({
      data: userCreateData,
      include: { addresses: true },
    });

    const accessToken = this.generateAccessToken(user.id, user.role);
    const refreshToken = this.generateRefreshToken(user.id);

    const defaultAddress = user.addresses.find((a) => a.isDefault) || user.addresses[0] || null;

    return {
      user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role },
      accessToken,
      refreshToken,
      defaultAddress: defaultAddress
        ? {
            id: defaultAddress.id,
            label: defaultAddress.label,
            county: defaultAddress.county,
            city: defaultAddress.city,
            addressLine: defaultAddress.addressLine,
          }
        : null,
    };
  }

  async login(data: LoginInput) {
    const user = await prisma.user.findUnique({
      where: { email: data.email },
      include: { addresses: true },
    });
    if (!user) {
      throw new ApiError(401, ErrorCodes.UNAUTHORIZED, "Invalid credentials");
    }

    const valid = await bcrypt.compare(data.password, user.passwordHash);
    if (!valid) {
      throw new ApiError(401, ErrorCodes.UNAUTHORIZED, "Invalid credentials");
    }

    const accessToken = this.generateAccessToken(user.id, user.role);
    const refreshToken = this.generateRefreshToken(user.id);

    const addresses = await prisma.address.findMany({ where: { userId: user.id } });
    const defaultAddress = addresses.find((a) => a.isDefault) || addresses[0] || null;

    return {
      user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role },
      accessToken,
      refreshToken,
      defaultAddress: defaultAddress
        ? {
            id: defaultAddress.id,
            label: defaultAddress.label,
            county: defaultAddress.county,
            city: defaultAddress.city,
            addressLine: defaultAddress.addressLine,
          }
        : null,
    };
  }

  async refresh(refreshToken: string) {
    try {
      const payload = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as { userId: string };
      const user = await prisma.user.findUnique({ where: { id: payload.userId } });
      if (!user) {
        throw new ApiError(401, ErrorCodes.UNAUTHORIZED, "Invalid refresh token");
      }

      const accessToken = this.generateAccessToken(user.id, user.role);
      return { accessToken };
    } catch {
      throw new ApiError(401, ErrorCodes.UNAUTHORIZED, "Invalid refresh token");
    }
  }

  async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { addresses: true },
    });

    if (!user) {
      throw new ApiError(404, ErrorCodes.RESOURCE_NOT_FOUND, "User not found");
    }

    const defaultAddress = user.addresses.find((a) => a.isDefault) || user.addresses[0] || null;

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      role: user.role,
      defaultAddress: defaultAddress
        ? {
            id: defaultAddress.id,
            label: defaultAddress.label,
            county: defaultAddress.county,
            city: defaultAddress.city,
            addressLine: defaultAddress.addressLine,
          }
        : null,
    };
  }

  private generateAccessToken(userId: string, role: string) {
    return jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: "30m" });
  }

  private generateRefreshToken(userId: string) {
    return jwt.sign({ userId }, JWT_REFRESH_SECRET, { expiresIn: "7d" });
  }
}

export const authService = new AuthService();
