import type { ITask } from '@progresso/common/src/interfaces/ITask';

type TaskStatus = 'Pending' | 'In Progress' | 'Completed';

export interface TaskUpdatePayload {
  title?: string;
  status?: TaskStatus;
  dueDate?: Date;
  startTime?: Date;
  endTime?: Date;
}

export class Task implements ITask {
  id: string;
  title: string;
  status: TaskStatus;
  dueDate?: Date;
  startTime?: Date;
  endTime?: Date;
  createdAt: Date;
  updatedAt: Date;

  constructor(
    id: string,
    title: string,
    status: TaskStatus,
    createdAt: Date,
    updatedAt: Date,
    dueDate?: Date,
    startTime?: Date,
    endTime?: Date,
  ) {
    this.id = id;
    this.title = title;
    this.status = status;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.dueDate = dueDate;
    this.startTime = startTime;
    this.endTime = endTime;
  }

  update(payload: TaskUpdatePayload) {
    if (payload.title) this.title = payload.title;
    if (payload.status) this.status = payload.status;
    if (payload.dueDate) this.dueDate = payload.dueDate;
    if (payload.startTime) this.startTime = payload.startTime;
    if (payload.endTime) this.endTime = payload.endTime;
  }
}
