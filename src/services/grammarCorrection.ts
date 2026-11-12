export async function correctDescriptionGrammar(
  text: string,
  signal?: AbortSignal,
): Promise<string> {
  const response = await fetch('/api/correct-grammar', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
    signal,
  });

  let result: unknown;
  try {
    result = await response.json();
  } catch {
    throw new Error('The grammar service returned an invalid response.');
  }

  if (!result || typeof result !== 'object') {
    throw new Error('The grammar service returned an invalid response.');
  }

  if (!response.ok) {
    throw new Error(
      'error' in result && typeof result.error === 'string'
        ? result.error
        : 'Grammar correction failed. Please try again.',
    );
  }

  if (
    !('correctedText' in result) ||
    typeof result.correctedText !== 'string' ||
    !result.correctedText.trim()
  ) {
    throw new Error('The grammar service returned an invalid correction.');
  }

  return result.correctedText;
}
