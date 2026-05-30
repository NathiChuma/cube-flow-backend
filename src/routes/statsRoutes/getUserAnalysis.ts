import { Request, Response } from 'express';
import { AIAnalysis } from '../../types';
import 'dotenv/config';

const FALLBACK_ANALYSIS: AIAnalysis = {
  score: 7,
  scoreLabel: 'Your cubing skills are solid. Keep training to reach excellence.',
  insights: ['✅ Your stats have been loaded. Analysis unavailable right now.'],
  recommendations: [
    '✓ Practice F2L pairs to improve your average.',
    '✓ Learn advanced PLL algorithms for faster last layer.',
    '✓ Focus on inspection to plan your solve better.',
    '✓ Reduce DNFs by slowing down on tricky cases.',
  ],
};

const getUserAnalysis = async (req: Request, res: Response): Promise<void> => {
  try {
    const userStats = req.body as { userStats: Record<string, unknown> };
    let aiAnalysis: AIAnalysis;

    try {
      const s = userStats.userStats;

      const prompt = `You are a speedcubing coach analyzing a cuber's performance data. Based on the following stats, generate a JSON response with insights and recommendations.

Stats:
- Best Time: ${s['bestTime']}s
- Worst Time: ${s['worstTime']}s
- Average: ${s['avgTime']}s
- Ao5: ${s['ao5']}s
- Ao12: ${s['ao12']}s
- Ao100: ${s['ao100']}s
- Total Solves: ${s['totalSolves']}
- DNF Count: ${s['dnfCount']}
- DNF Rate: ${s['dnfRate']}
- Current Streak: ${s['currentStreak']}
- Best Streak: ${s['longestStreak']}

Respond ONLY with a JSON object in this exact format, no markdown, no extra text:
{
  "score": <number 1-10>,
  "scoreLabel": "<one sentence summary of their skill level>",
  "insights": ["<insight 1>", "<insight 2>", "<insight 3>", "<insight 4>"],
  "recommendations": ["<recommendation 1>", "<recommendation 2>", "<recommendation 3>", "<recommendation 4>"]
}

Insights should be specific observations about their stats (consistency, trends, DNF rate, streaks).
Recommendations should be actionable advice to improve their times.`;

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.ANTHROPIC_API_KEY ?? '',
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          messages: [{ role: 'user', content: prompt }],
        }),
      });

      const data = (await response.json()) as { content: Array<{ type: string; text?: string }> };
      const text = data.content.map((i) => i.text ?? '').join('');
      const clean = text.replace(/```json|```/g, '').trim();
      aiAnalysis = JSON.parse(clean) as AIAnalysis;
    } catch (err) {
      console.error('AI analysis failed:', err);
      aiAnalysis = FALLBACK_ANALYSIS;
    }

    res.status(200).json(aiAnalysis);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: (error as Error).message });
  }
};

export default getUserAnalysis;
