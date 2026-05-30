import { Request, Response } from 'express';
import { db } from '../../firebase';

const getUserRecentSolves = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;

    const snapshot = await db
      .collection('solves')
      .where('userId', '==', userId)
      .orderBy('timestamp', 'desc')
      .limit(10)
      .get();

    const solves = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    res.status(200).json(solves);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: (error as Error).message });
  }
};

export default getUserRecentSolves;
