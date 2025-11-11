import { useState, useEffect } from 'react';
import type { ChangeEvent } from 'react';
import type { ITask } from '@progresso/common/src/interfaces/ITask';
import type { IDashboardReport } from '@progresso/common/src/interfaces/IDashboardReport';

type TaskStatus = 'Pending' | 'In Progress' | 'Completed';

function App() {
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [report, setReport] = useState<IDashboardReport | null>(null);

  // APIからタスクを取得する
  const fetchTasks = async () => {
    try {
      const response = await fetch('/api/tasks');
      const data: ITask[] = await response.json();
      setTasks(data);
    } catch (error){
        console.error('タスクの取得に失敗しました:', error);
    }
  };

  // APIからダッシュボードレポートを取得する
  const fetchReport = async () => {
    try {
      const response = await fetch('/api/dashboard/report');
      const data: IDashboardReport = await response.json();
      setReport(data);
    } catch (error) {
      console.error('ダッシュボードレポートの取得に失敗しました:', error);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchReport();
  }, []);

  // 新しいタスクを作成する
  const handleCreateTask = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTaskTitle, status: 'Pending' }),
      });

      if (response.ok) {
        setNewTaskTitle('');
        fetchTasks();
        fetchReport();
      } else {
        console.error('タスクの作成に失敗しました');
      }
    } catch (error) {
      console.error('タスク作成時にエラーが発生しました:', error);
    }
  };

  // タスクの項目を更新する
  const handleUpdateTask = async (id: string, field: keyof ITask, value: any) => {
    const taskToUpdate = tasks.find(task => task.id === id);
    if (!taskToUpdate) return;

    const updatedTask = { ...taskToUpdate, [field]: value };

    setTasks(tasks.map(task => task.id === id ? updatedTask : task));

    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTask),
      });

      if (!response.ok) {
        setTasks(tasks);
        console.error('タスクの更新に失敗しました:', await response.text());
      } else {
        if (field === 'status' || field === 'startTime' || field === 'endTime') {
          fetchReport();
        }
      }
    } catch (error) {
      setTasks(tasks);
      console.error('タスクの更新時にネットワークエラーが発生しました:', error);
    }
  };

  // Dateオブジェクトを'YYYY-MM-DD'形式の文字列に変換
  const formatDateForInput = (date?: Date) => date ? new Date(date).toISOString().split('T')[0] : '';
  // Dateオブジェクトを'YYYY-MM-DDTHH:mm'形式の文字列に変換
  const formatDateTimeForInput = (date?: Date) => {
      if (!date) return '';
      const localDate = new Date(new Date(date).getTime() - new Date().getTimezoneOffset() * 60000);
      return localDate.toISOString().slice(0, 16);
  };


  return (
    <div style={{ padding: '20px' }}>
      <h1>タスク管理</h1>

      <div style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '20px' }}>
        <h2>ダッシュボード</h2>
        {report ? (
          <table border={1} style={{ width: 'auto', borderCollapse: 'collapse', textAlign: 'center' }}>
            <thead>
              <tr>
                <th style={{ padding: '8px' }}>期間</th>
                <th style={{ padding: '8px' }}>総所要時間 (分)</th>
                <th style={{ padding: '8px' }}>残タスク数</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: '8px' }}>今月</td>
                <td style={{ padding: '8px' }}>{report.thisMonth.totalDurationMinutes}</td>
                <td style={{ padding: '8px' }}>{report.thisMonth.remainingTasks}</td>
              </tr>
              <tr>
                <td style={{ padding: '8px' }}>先月</td>
                <td style={{ padding: '8px' }}>{report.lastMonth.totalDurationMinutes}</td>
                <td style={{ padding: '8px' }}>{report.lastMonth.remainingTasks}</td>
              </tr>
            </tbody>
          </table>
        ) : <p>レポートを読み込み中...</p>}
      </div>

      <form onSubmit={handleCreateTask} style={{ marginBottom: '20px' }}>
        <input
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="新しいタスク名"
          required
          style={{ marginRight: '10px' }}
        />
        <button type="submit">タスクを追加</button>
      </form>

      <table border={1} style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ padding: '8px' }}>タスク名</th>
            <th style={{ padding: '8px' }}>ステータス</th>
            <th style={{ padding: '8px' }}>期限</th>
            <th style={{ padding: '8px' }}>開始日時</th>
            <th style={{ padding: '8px' }}>終了日時</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id}>
              <td style={{ padding: '8px' }}>
                <input
                  type="text"
                  defaultValue={task.title}
                  onBlur={(e) => handleUpdateTask(task.id, 'title', e.target.value)}
                  style={{ width: '95%' }}
                />
              </td>
              <td style={{ padding: '8px' }}>
                <select
                  value={task.status}
                  onChange={(e) => handleUpdateTask(task.id, 'status', e.target.value as TaskStatus)}
                >
                  <option value="Pending">未着手</option>
                  <option value="In Progress">進行中</option>
                  <option value="Completed">完了</option>
                </select>
              </td>
              <td style={{ padding: '8px' }}>
                <input
                  type="date"
                  value={formatDateForInput(task.dueDate)}
                  onChange={(e) => handleUpdateTask(task.id, 'dueDate', e.target.value ? new Date(e.target.value) : undefined)}
                />
              </td>
              <td style={{ padding: '8px' }}>
                <input
                  type="datetime-local"
                  value={formatDateTimeForInput(task.startTime)}
                  onChange={(e) => handleUpdateTask(task.id, 'startTime', e.target.value ? new Date(e.target.value) : undefined)}
                />
              </td>
              <td style={{ padding: '8px' }}>
                <input
                  type="datetime-local"
                  value={formatDateTimeForInput(task.endTime)}
                  onChange={(e) => handleUpdateTask(task.id, 'endTime', e.target.value ? new Date(e.target.value) : undefined)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
