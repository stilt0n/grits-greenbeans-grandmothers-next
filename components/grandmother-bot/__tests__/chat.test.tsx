import { describe, it, expect, afterEach, mock } from 'bun:test';
import { screen, render } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { Chat } from '../chat.client';

// Note: a streaming-happy-path test was attempted and dropped. happy-dom's
// ReadableStream + Bun's globals + `eventsource-parser/stream` (used inside
// `useChat`'s SSE parser) interop poorly: pipeThrough rejects the stream with
// "readable should be ReadableStream". The component code is fine; the test
// harness can't feed it a working SSE response. Revisit when we drop happy-dom
// (e.g. on a future Bun bump). End-to-end streaming is exercised by the M5
// route tests and the M7 manual smoke / live Playwright run.

const sseTextResponse = () => {
  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      controller.enqueue(encoder.encode('data: {"type":"start"}\n\n'));
      controller.close();
    },
  });
  return {
    ok: true,
    status: 200,
    statusText: 'OK',
    headers: new Headers({ 'content-type': 'text/event-stream' }),
    body: stream,
    text: async () => '',
    json: async () => ({}),
    clone() {
      return this;
    },
  } as unknown as Response;
};

const originalFetch = globalThis.fetch;

describe('Chat (grandmother-bot)', () => {
  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it('renders the user message after submit', async () => {
    globalThis.fetch = mock(async () =>
      sseTextResponse()
    ) as unknown as typeof fetch;

    render(<Chat />);

    await userEvent.type(screen.getByRole('textbox'), 'What is a grit?');
    await userEvent.click(screen.getByRole('button', { name: /submit/i }));

    expect(await screen.findByText('What is a grit?')).toBeInTheDocument();
  });

  it('shows an error banner with a retry affordance on failure', async () => {
    globalThis.fetch = mock(
      async () => new Response('boom', { status: 500 })
    ) as unknown as typeof fetch;

    render(<Chat />);

    await userEvent.type(screen.getByRole('textbox'), 'hi');
    await userEvent.click(screen.getByRole('button', { name: /submit/i }));

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent(/something went wrong/i);
    expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
  });
});
