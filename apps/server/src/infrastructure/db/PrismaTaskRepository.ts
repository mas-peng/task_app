import { PrismaClient, Task as PrismaTask } from '@prisma/client';
import { Task } from '../../domain/Task';
import { ITaskRepository } from '../../application/ports/ITaskRepository';

export class PrismaTaskRepository implements ITaskRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  private toDomain(prismaTask: PrismaTask): Task {
    return new Task(
      prismaTask.id,
      prismaTask.title,
      prismaTask.status as 'Pending' | 'In Progress' | 'Completed',
      prismaTask.createdAt,
      prismaTask.updatedAt,
      prismaTask.dueDate ?? undefined,
      prismaTask.startTime ?? undefined,
      prismaTask.endTime ?? undefined
    );
  }

  async save(task: Task): Promise<Task> {
    const savedTask = await this.prisma.task.upsert({
      where: { id: task.id },
      update: {
        title: task.title,
        status: task.status,
        dueDate: task.dueDate,
        startTime: task.startTime,
        endTime: task.endTime,
      },
      create: {
        id: task.id,
        title: task.title,
        status: task.status,
        dueDate: task.dueDate,
        startTime: task.startTime,
        endTime: task.endTime,
      },
    });
    return this.toDomain(savedTask);
  }

  async findById(id: string): Promise<Task | null> {
    const task = await this.prisma.task.findUnique({ where: { id } });
    return task ? this.toDomain(task) : null;
  }

  async findAll(): Promise<Task[]> {
    const tasks = await this.prisma.task.findMany();
    return tasks.map(this.toDomain);
  }
}
