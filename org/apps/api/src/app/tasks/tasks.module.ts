import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { User, Organization, Task } from '@org/data';

@Module({
  imports: [TypeOrmModule.forFeature([Task, Organization, User])],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
