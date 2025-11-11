import { IDashboardReport } from '@progresso/common/src/interfaces/IDashboardReport';
import { ITaskRepository } from '../ports/ITaskRepository';
import { Task } from '../../domain/Task';

export class GetDashboardReportUseCase {
  constructor(private taskRepository: ITaskRepository) {}

  async execute(): Promise<IDashboardReport> {
    const allTasks = await this.taskRepository.findAll();
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    const thisMonthTasks = allTasks.filter(task => {
      const taskDate = task.startTime ? new Date(task.startTime) : new Date(task.createdAt);
      return taskDate.getFullYear() === currentYear && taskDate.getMonth() === currentMonth;
    });

    const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthYear = lastMonthDate.getFullYear();
    const lastMonth = lastMonthDate.getMonth();

    const lastMonthTasks = allTasks.filter(task => {
        const taskDate = task.startTime ? new Date(task.startTime) : new Date(task.createdAt);
        return taskDate.getFullYear() === lastMonthYear && taskDate.getMonth() === lastMonth;
    });

    const calculateReport = (tasks: Task[]) => {
      const totalDurationMinutes = tasks.reduce((sum, task) => {
        if (task.startTime && task.endTime) {
          const duration = new Date(task.endTime).getTime() - new Date(task.startTime).getTime();
          return sum + Math.round(duration / 60000);
        }
        return sum;
      }, 0);

      const remainingTasks = tasks.filter(task => task.status !== 'Completed').length;

      return { totalDurationMinutes, remainingTasks };
    };

    return {
      thisMonth: calculateReport(thisMonthTasks),
      lastMonth: calculateReport(lastMonthTasks),
    };
  }
}
