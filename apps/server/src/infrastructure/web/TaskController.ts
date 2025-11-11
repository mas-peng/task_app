import { Router, Request, Response } from 'express';
import { CreateTaskUseCase } from '../../application/usecases/CreateTask';
import { GetTasksUseCase } from '../../application/usecases/GetTasks';
import { UpdateTaskUseCase } from '../../application/usecases/UpdateTask';
import { GetDashboardReportUseCase } from '../../application/usecases/GetDashboardReport';
import { PrismaTaskRepository } from '../db/PrismaTaskRepository';

const router = Router();
const taskRepository = new PrismaTaskRepository();

const createTaskUseCase = new CreateTaskUseCase(taskRepository);
const getTasksUseCase = new GetTasksUseCase(taskRepository);
const updateTaskUseCase = new UpdateTaskUseCase(taskRepository);
const getDashboardReportUseCase = new GetDashboardReportUseCase(taskRepository);

router.get('/dashboard/report', async (_req: Request, res: Response) => {
    try {
        const report = await getDashboardReportUseCase.execute();
        res.status(200).json(report);
    } catch (error) {
        res.status(500).json({ error: 'ダッシュボードの作成に失敗しました' });
    }
});

router.post('/tasks', async (req: Request, res: Response) => {
  try {
    const { title, dueDate, startTime, endTime } = req.body;
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }
    const task = await createTaskUseCase.execute({
      title,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      startTime: startTime ? new Date(startTime) : undefined,
      endTime: endTime ? new Date(endTime) : undefined,
    });
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: 'タスクの作成に失敗しました' });
  }
});

router.get('/tasks', async (_req: Request, res: Response) => {
  try {
    const tasks = await getTasksUseCase.execute();
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'タスクの取得に失敗しました' });
  }
});

router.put('/tasks/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, status, dueDate, startTime, endTime } = req.body;

    const payload = {
      title,
      status,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      startTime: startTime ? new Date(startTime) : undefined,
      endTime: endTime ? new Date(endTime) : undefined,
    }

    await updateTaskUseCase.execute(id, payload);
    res.status(204).send();
  } catch (error: any) {
    if (error.message === 'タスクが見つかりません') {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: 'タスクの更新に失敗しました' });
  }
});

export default router;
