import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersController } from './users.controller';
import { UsersService } from './users.service';

import { User } from '@org/data';
import { Role } from '@org/data';
import { Organization } from '@org/data';

@Module({
  imports: [TypeOrmModule.forFeature([User, Organization, Role])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
