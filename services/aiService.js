const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

export async function getTaskBreakdown({ title, description }) {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

  if (!apiKey) {
    // Friendly fallback if no API key is configured
    return [
      'Clarify the task requirements and expected outcome.',
      'Break the task into 3–5 small, actionable subtasks.',
      'Estimate time and set a realistic deadline for each subtask.',
      'Execute the subtasks in order, adjusting as needed.',
      'Review the results and mark the task as done.'
    ];
  }

  const systemPrompt =
    'You are an assistant that breaks down user tasks into 3–7 short, concrete subtasks. ' +
    'Return only a numbered list, each item describing a clear step.';

  const userPrompt = `Task title: ${title}\n\nDescription: ${description || 'No additional description.'}\n\nBreak this into clear, numbered subtasks.`;

  const response = await fetch(OPENAI_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.4
    })
  });

  if (!response.ok) {
    throw new Error('Failed to fetch AI suggestions');
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content || '';

  const lines = content
    .split('\n')
    .map((line) => line.replace(/^\s*\d+[\).\-\:]\s*/, '').trim())
    .filter(Boolean);

  return lines.length ? lines : [content.trim()];
}

