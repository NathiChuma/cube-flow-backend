import { Request, Response } from 'express';
import { db } from '../../firebase';

const getAllSolves = async (_req: Request, res: Response): Promise<void> => {
  try {
    const snapshot = await db.collection('solves').orderBy('timestamp', 'desc').get();

    const solves = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    res.status(200).json(solves);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: (error as Error).message });
  }
};

export default getAllSolves;
