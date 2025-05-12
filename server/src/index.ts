import express from 'express';
import chatRouter from './routes/chat';

const app = express();
const port = 3001;

app.use(express.json());
app.use('/api/chat', chatRouter);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
}); 