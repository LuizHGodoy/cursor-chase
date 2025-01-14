import type { HighScore } from '../../store/leaderboard';

let scores: HighScore[] = [];

export async function GET() {
  try {
    return new Response(JSON.stringify(scores), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch scores' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
  }
}

export async function POST(request: Request) {
  try {
    const score: HighScore = await request.json();
    
    scores.push(score);
    scores.sort((a, b) => b.score - a.score);
    scores = scores.slice(0, 10);

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to save score' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
  }
} 