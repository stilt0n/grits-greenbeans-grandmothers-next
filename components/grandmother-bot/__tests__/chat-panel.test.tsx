import { describe, it, expect, mock } from 'bun:test';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { ChatPanel } from '../chat-panel.client';

// The chat panel passes `key={recipeId}` to the inner Chat. Switching
// recipeId must remount Chat — which means any in-progress draft text in
// the textarea is wiped, because Chat owns that state. This test is the
// guardrail for the recipe-change reset rule from the spec.

const sseTextResponse = () =>
  ({
    ok: true,
    status: 200,
    statusText: 'OK',
    headers: new Headers({ 'content-type': 'text/event-stream' }),
    body: new ReadableStream<Uint8Array>({
      start(controller) {
        controller.enqueue(
          new TextEncoder().encode('data: {"type":"start"}\n\n')
        );
        controller.close();
      },
    }),
    text: async () => '',
    json: async () => ({}),
    clone() {
      return this;
    },
  }) as unknown as Response;

describe('ChatPanel', () => {
  it('resets chat draft when recipeId changes (key={recipeId})', async () => {
    globalThis.fetch = mock(async () =>
      sseTextResponse()
    ) as unknown as typeof fetch;

    const user = userEvent.setup();
    const { rerender } = render(<ChatPanel recipeId={1} />);

    // Open the sheet by clicking the trigger button.
    await user.click(screen.getByRole('button', { name: /open chat/i }));

    const textarea = await screen.findByRole('textbox');
    await user.type(textarea, 'in-flight question');
    expect(textarea).toHaveValue('in-flight question');

    rerender(<ChatPanel recipeId={2} />);

    // After remount the textarea is fresh — same role lookup, but a new node.
    const remountedTextarea = await screen.findByRole('textbox');
    expect(remountedTextarea).toHaveValue('');
  });
});
