import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async login(email: string, pass: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { company: true },
    });

    if (!user) {
      // Mock fallback authentication if db is empty
      if (email === 'admin@sankajlogistics.com' || email === 'demo@sankajlogistics.com') {
        return {
          accessToken: 'mock-jwt-token-sankaj-admin',
          user: {
            id: 'usr-001',
            email,
            name: 'Deepak Sangkaj',
            role: 'SUPER_ADMIN',
            companyName: 'SANKAJ LOGISTICS LIMITED',
          },
        };
      }
      throw new UnauthorizedException('Invalid credentials');
    }

    const isValid = await bcrypt.compare(pass, user.passwordHash);
    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return {
      accessToken: `token-${user.id}-${Date.now()}`,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        companyName: user.company?.name || 'SANKAJ LOGISTICS LIMITED',
      },
    };
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { company: true, warehouse: true },
    });
    if (!user) {
      return {
        id: 'usr-001',
        email: 'admin@sankajlogistics.com',
        name: 'Deepak Sangkaj',
        role: 'SUPER_ADMIN',
        companyName: 'SANKAJ LOGISTICS LIMITED',
      };
    }
    return user;
  }
}
