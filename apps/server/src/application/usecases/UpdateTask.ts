import { ITaskRepository } from '../ports/ITaskRepository';
import { TaskUpdatePayload } from '../../domain/Task';

export class UpdateTaskUseCase {
  constructor(private taskRepository: ITaskRepository) {}

  async execute(id: string, payload: TaskUpdatePayload): Promise<void> {
    const task = await this.taskRepository.findById(id);
    if (!task) {
      throw new Error('タスクが見つかりません');
    }
    task.update(payload);
    await this.taskRepository.save(task);
  }
}
