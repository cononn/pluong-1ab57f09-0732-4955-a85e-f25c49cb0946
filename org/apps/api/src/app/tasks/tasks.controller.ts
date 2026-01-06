import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Users } from '@org/data';
import { User as UserEntity } from '@org/data';
import { Roles } from '@org/data';
import { RolesGuard } from '../auth/roles.guard';

@Controller('tasks')
@UseGuards(RolesGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  // Create a task
  @Post()
  @Roles('Admin', 'Owner')
  create(@Body() createTaskDto: CreateTaskDto, @Users() user: UserEntity) {
    return this.tasksService.create(createTaskDto, user);
  }

  // List tasks accessible to this user
  @Get()
  findAll(@Users() user: UserEntity) {
    return this.tasksService.findAll(user);
  }

  // Update a task
  @Put(':id')
  @Roles('Admin', 'Owner')
  update(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @Users() user: UserEntity,
  ) {
    return this.tasksService.update(id, updateTaskDto, user);
  }

  // Delete a task
  @Delete(':id')
  @Roles('Admin', 'Owner')
  remove(@Param('id') id: string, @Users() user: UserEntity) {
    return this.tasksService.remove(id, user);
  }
}
