import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';

import { User } from '@org/data';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userRepo.findOne({
      where: { email },
      relations: ['role', 'organization', 'organization.parent'],
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const { passwordHash, ...safeUser } = user;
    return safeUser;
  }

  async findById(id: string) {
    return this.userRepo.findOne({
      where: { id },
      relations: ['role', 'organization'],
    });
  }

  findAll() {
    return this.userRepo.find();
  }
}
