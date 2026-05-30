import { Request, Response } from 'express';
import { db } from '../../firebase';

const deleteSolve = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const solveRef = db.collection('solves').doc(id);
    const solveDoc = await solveRef.get();

    if (!solveDoc.exists) {
      res.status(404).json({ error: 'Solve not found.' });
      return;
    }

    await solveRef.delete();
    res.status(200).json({ message: 'Solve deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: (error as Error).message });
  }
};

export default deleteSolve;
