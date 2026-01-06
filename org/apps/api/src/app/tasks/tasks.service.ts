import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from '@org/data';
import { User } from '@org/data';

import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepo: Repository<Task>,
  ) {}

  // Create a new task in the user's organization
  async create(createTaskDto: CreateTaskDto, user: User) {
    const task = this.taskRepo.create({
      ...createTaskDto,
      organization: user.organization,
    });
    return this.taskRepo.save(task);
  }

  // Get all tasks in the user's organization
  async findAll(user: User) {
    return this.taskRepo.find({
      where: { organization: { id: user.organization.id } },
    });
  }

  // Find a single task by ID, scoped to the user's organization
  async findOne(id: string, user: User) {
    const task = await this.taskRepo.findOne({
      where: { id, organization: { id: user.organization.id } },
    });

    if (!task) throw new NotFoundException('Task not found');
    return task;
  }

  // Update a task in the user's organization 
  async update(id: string, updateTaskDto: UpdateTaskDto, user: User) {
    const task = await this.findOne(id, user);
    Object.assign(task, updateTaskDto);
    return this.taskRepo.save(task);
  }

  // Delete a task in the user's organization
  async remove(id: string, user: User) {
    const task = await this.findOne(id, user);
    return this.taskRepo.remove(task);
  }
}
