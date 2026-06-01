import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(data: any): Promise<any> {
    const existingUser = await this.usersService.findByEmail(data.email);
    if (existingUser) {
      throw new BadRequestException('El correo electronico ya esta registrado');
    }

    const passwordHash = await bcrypt.hash(data.password, 10);
    const user = await this.usersService.create({
      email: data.email,
      name: data.name,
      phone: data.phone,
      passwordHash,
      role: data.role || 'contratista',
      location: data.location || '',
      avatar: data.avatar || '',
    });

    const payload = { email: user.email, sub: user.id };
    const token = this.jwtService.sign(payload);

    const { passwordHash: _, ...userWithoutPassword } = user;
    return {
      access_token: token,
      user: userWithoutPassword,
    };
  }

  async login(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Correo o contrasena incorrectos');
    }

    const isMatch = await bcrypt.compare(pass, user.passwordHash!);
    if (!isMatch) {
      throw new UnauthorizedException('Correo o contrasena incorrectos');
    }

    const payload = { email: user.email, sub: user.id };
    const token = this.jwtService.sign(payload);

    const { passwordHash: _, ...userWithoutPassword } = user;
    return {
      access_token: token,
      user: userWithoutPassword,
    };
  }
}
