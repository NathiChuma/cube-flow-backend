import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes/authRoutes';
import solveRoutes from './routes/solveRoutes/solveRoutes';
import statsRoutes from './routes/statsRoutes/statsRoutes';

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: 'https://cube-flow-ten.vercel.app',
    //origin: 'http://localhost:8080'
  })
);

app.use('/auth', authRoutes);
app.use('/solves', solveRoutes);
app.use('/stats', statsRoutes);

const PORT = process.env.PORT ?? 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
