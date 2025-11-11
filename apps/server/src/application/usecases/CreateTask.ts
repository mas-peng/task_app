import { Task } from '../../domain/Task';
import { ITaskRepository } from '../ports/ITaskRepository';
import { v4 as uuidv4 } from 'uuid';

interface CreateTaskInput {
  title: string;
  dueDate?: Date;
  startTime?: Date;
  endTime?: Date;
}

export class CreateTaskUseCase {
  constructor(private taskRepository: ITaskRepository) {}

  async execute(input: CreateTaskInput): Promise<Task> {
    const now = new Date();
    const task = new Task(
      uuidv4(),
      input.title,
      'Pending',
      now,
      now,
      input.dueDate,
      input.startTime,
      input.endTime
    );
    return this.taskRepository.save(task);
  }
}
