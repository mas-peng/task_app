import express from 'express';
import taskRoutes from './infrastructure/web/TaskController';

const app = express();
const port = 3001;

app.use(express.json());
app.use('/api', taskRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
