import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TasksService } from '../../services/tasks.service';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tasks.component.html',
})
export class TasksComponent implements OnInit {
  tasks: any[] = [];
  error = '';

  constructor(private tasksService: TasksService) {}

  ngOnInit() {
    this.tasksService.getAllTasks().subscribe({
      next: (tasks) => (this.tasks = tasks),
      error: () => (this.error = 'Could not load tasks'),
    });
  }
}
