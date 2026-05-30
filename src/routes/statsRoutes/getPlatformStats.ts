import { Request, Response } from 'express';
import { db } from '../../firebase';
import average from '../../utils/stats/average';
import formatMs from '../../utils/stats/formatMs';
import { Solve } from '../../types';

const getPlatformStats = async (_req: Request, res: Response): Promise<void> => {
  try {
    const solvesSnapshot = await db.collection('solves').get();
    const solves = solvesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Solve[];

    const usersSnapshot = await db.collection('users').get();
    const users = usersSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    const validSolves = solves.filter((s) => !s.dnf);
    const times = validSolves.map((s) => s.time);
    const totalSolveTime = times.reduce((sum, t) => sum + t, 0);
    const totalMinutes = Math.floor(totalSolveTime / 60_000);
    const totalHours = Math.floor(totalMinutes / 60);
    const remainingMinutes = totalMinutes % 60;

    const stats = {
      activeCubers: users.length,
      solvesTracked: solves.length,
      averageSolveTime: formatMs(average(times)),
      totalDNFs: solves.filter((s) => s.dnf).length,
      totalCubeTime: `${totalHours}h ${remainingMinutes}m`,
    };

    res.status(200).json(stats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: (error as Error).message });
  }
};

export default getPlatformStats;
