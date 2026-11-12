import { afterEach, describe, expect, it, vi } from 'vitest';
import { correctDescriptionGrammar } from './grammarCorrection';

describe('correctDescriptionGrammar', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('sends the description to the same-origin API and returns the correction', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ correctedText: 'I lost my blue backpack.' }),
    });
    vi.stubGlobal('fetch', fetchMock);

    await expect(correctDescriptionGrammar('i lost my blue backpack')).resolves.toBe(
      'I lost my blue backpack.',
    );
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/correct-grammar',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ text: 'i lost my blue backpack' }),
      }),
    );
  });

  it('surfaces errors returned by the API', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ error: 'OpenRouter is not configured.' }),
    }));

    await expect(correctDescriptionGrammar('description text')).rejects.toThrow(
      'OpenRouter is not configured.',
    );
  });

  it('rejects malformed correction responses', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ correctedText: 4 }),
    }));

    await expect(correctDescriptionGrammar('description text')).rejects.toThrow(
      'The grammar service returned an invalid correction.',
    );
  });
});
