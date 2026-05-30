import { Request, Response } from 'express';
import { db } from '../../firebase';

interface AddSolveBody {
  userId: string;
  time: number;
  scramble: string;
  timestamp: number;
  dnf: boolean;
}

const addSolve = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, time, scramble, timestamp, dnf } = req.body as AddSolveBody;

    if (
      !userId ||
      typeof time !== 'number' ||
      !scramble ||
      !timestamp ||
      typeof dnf !== 'boolean'
    ) {
      res.status(400).json({ error: 'Invalid solve data.' });
      return;
    }

    const solveData = { userId, time, scramble, timestamp, dnf };
    const docRef = await db.collection('solves').add(solveData);

    res.status(201).json({ message: 'Solve added successfully', id: docRef.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: (error as Error).message });
  }
};

export default addSolve;
