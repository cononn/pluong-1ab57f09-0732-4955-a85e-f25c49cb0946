import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class TasksService {
  private apiUrl = 'http://localhost:3000/api/tasks';

  constructor(private http: HttpClient) {}

  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`,
      }),
    };
  }

  getAllTasks() {
    return this.http.get<any[]>(`${this.apiUrl}/all`, this.getAuthHeaders());
  }

  createTask(title: string, description?: string, status?: string) {
    return this.http.post(
      this.apiUrl,
      { title, description, status },
      this.getAuthHeaders()
    );
  }
}

