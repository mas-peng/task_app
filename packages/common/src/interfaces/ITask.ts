export interface ITask {
  id: string;
  title: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  dueDate?: Date;
  startTime?: Date;
  endTime?: Date;
  createdAt: Date;
  updatedAt: Date;
}
