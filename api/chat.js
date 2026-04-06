export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { messages } = req.body;
  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'Invalid messages payload' });
  }

  const groqKey = process.env.GROQ_KEY;
  if (!groqKey) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${groqKey}`,
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages,
      max_tokens: 300,
      temperature: 0.75,
    }),
  });

  const data = await groqRes.json();

  if (!groqRes.ok) {
    return res.status(groqRes.status).json({ error: data.error?.message || 'Groq error' });
  }

  return res.status(200).json(data);
}
