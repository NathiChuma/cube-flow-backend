import { Request, Response } from 'express';
import { db } from '../../firebase';
import average from '../../utils/stats/average';
import calculateAo from '../../utils/stats/calculateAo';
import calculateConsistency from '../../utils/stats/calculateConsistency';
import calculateStreaks from '../../utils/stats/calculateStreaks';
import formatMs from '../../utils/stats/formatMs';
import { Solve } from '../../types';

const getUserStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;

    const snapshot = await db
      .collection('solves')
      .where('userId', '==', userId)
      .orderBy('timestamp', 'desc')
      .get();

    const solves = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Solve[];

    const validSolves = solves.filter((s) => !s.dnf);
    const times = validSolves.map((s) => s.time);

    const totalSolves = solves.length;
    const bestTime = times.length ? Math.min(...times) : null;
    const worstTime = times.length ? Math.max(...times) : null;
    const avgTime = average(times);

    const ao5 = calculateAo(validSolves, 5);
    const ao12 = calculateAo(validSolves, 12);
    const ao50 = calculateAo(validSolves, 50);
    const ao100 = calculateAo(validSolves, 100);

    const dnfCount = solves.filter((s) => s.dnf).length;
    const dnfRate =
      totalSolves === 0 ? '0%' : ((dnfCount / totalSolves) * 100).toFixed(1) + '%';

    const totalTimeMs = times.reduce((sum, t) => sum + t, 0);
    const totalMinutes = Math.floor(totalTimeMs / 60_000);
    const totalHours = Math.floor(totalMinutes / 60);
    const remainingMinutes = totalMinutes % 60;

    // Group sessions by day
    const sessionsMap: Record<string, Solve[]> = {};
    solves.forEach((solve) => {
      const date = new Date(solve.timestamp).toISOString().split('T')[0];
      if (!sessionsMap[date]) sessionsMap[date] = [];
      sessionsMap[date].push(solve);
    });

    const sessions = Object.entries(sessionsMap)
      .map(([date, daySolves]) => {
        const valid = daySolves.filter((s) => !s.dnf);
        const sessionTimes = valid.map((s) => s.time);
        return {
          date,
          solves: daySolves.length,
          bestTime: sessionTimes.length ? formatMs(Math.min(...sessionTimes)) : null,
          avgTime: sessionTimes.length ? formatMs(average(sessionTimes)) : null,
          ao5: valid.length >= 5 ? formatMs(calculateAo(valid, 5)) : null,
        };
      })
      .reverse();

    const statsData = {
      sessions,

      timeTrend: sessions.map((s) => ({
        time: new Date(s.date).toLocaleDateString('en-US', { weekday: 'short' }),
        value: Number(s.avgTime),
      })),

      consistency: calculateConsistency(solves),

      userStats: {
        totalSolves,
        bestTime: formatMs(bestTime),
        worstTime: formatMs(worstTime),
        avgTime: formatMs(avgTime),
        ao5: ao5 ? formatMs(ao5) : null,
        ao12: ao12 ? formatMs(ao12) : null,
        ao50: ao50 ? formatMs(ao50) : null,
        ao100: ao100 ? formatMs(ao100) : null,
        dnfCount,
        dnfRate,
        totalTime: `${totalHours}h ${remainingMinutes}m`,
        ...calculateStreaks(solves),
      },

      achievements: [
        {
          id: 1,
          title: 'First Solve',
          description: 'Complete your first solve',
          icon: '🎯',
          unlocked: totalSolves >= 1,
          date:
            solves.length > 0
              ? new Date(solves[solves.length - 1].timestamp).toISOString().split('T')[0]
              : null,
        },
        {
          id: 2,
          title: 'Speed Racer',
          description: 'Achieve a sub-20 time',
          icon: '⚡',
          unlocked: bestTime !== null && bestTime < 20_000,
          date:
            bestTime !== null && bestTime < 20_000
              ? new Date(
                  solves.find((s) => s.time === bestTime)!.timestamp
                )
                  .toISOString()
                  .split('T')[0]
              : null,
        },
        {
          id: 3,
          title: 'Century Club',
          description: 'Complete 100 solves',
          icon: '💯',
          unlocked: totalSolves >= 100,
          date:
            totalSolves >= 100
              ? new Date(solves[solves.length - 1].timestamp).toISOString().split('T')[0]
              : null,
        },
      ],

      solves: solves.map((s) => ({ ...s, time: formatMs(s.time) })),
    };

    res.status(200).json(statsData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: (error as Error).message });
  }
};

export default getUserStats;
