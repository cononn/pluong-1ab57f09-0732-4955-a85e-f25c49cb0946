import { Controller, Post, Body, Get } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    console.log('GET /users route accessed');
    return this.usersService.findAll();
  }

  @Post('login')
  login(
    @Body() body: { email: string; password: string },
  ) {
    return this.usersService.validateUser(
      body.email,
      body.password,
    );
  }
}
