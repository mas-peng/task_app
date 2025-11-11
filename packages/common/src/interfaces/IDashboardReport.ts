export interface IMonthlyReport {
  totalDurationMinutes: number;
  remainingTasks: number;
}

export interface IDashboardReport {
  lastMonth: IMonthlyReport;
  thisMonth: IMonthlyReport;
}
