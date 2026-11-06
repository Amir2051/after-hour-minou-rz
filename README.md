# AFTER HOURS

A private two-player couples game night PWA.

## Local development

1. Install dependencies: `bun install`
2. Copy `.env.example` to `.env` and add a server-side `GEMINI_API_KEY`.
3. Start the Referee API in one terminal: `bun run dev:api`
4. Start Vite in a second terminal: `bun run dev`
5. Open the local Vite URL shown in the terminal.

The Vite development server proxies `/api/*` to the Express API on port 8787.

## Production

- Build the PWA: `bun run build`
- Set `GEMINI_API_KEY` and optionally `GEMINI_MODEL` in the server environment.
- Start the Express server: `bun start`
- The server serves the built `dist` directory and the Referee API from the same origin.

Do not use a `VITE_GEMINI_API_KEY` variable. The Gemini key must remain server-side.

## THE REFEREE privacy model

- Player 1 and Player 2 memories are stored in separate browser-local scopes.
- A private request sends only the active player's private memory plus mutually shared memories.
- Shared memories require the user to confirm that both players agree before saving.
- Switching player scope clears the visible conversation; only recent messages from the active scope are sent for context.
- The API is stateless and does not write memory or chat history to a server database.
- Browser-local storage is not encrypted or account-authenticated. Anyone with access to the same browser profile may be able to inspect it. This is a private-device prototype, not a multi-account security boundary.
- The Gemini API receives the prompt and the selected context needed to answer. Configure the Gemini project and provider data controls according to your privacy requirements.

The Referee is a playful conversation aid, not a lie detector. It must not infer deception from voice, appearance or body language.

## Validation

`bun run lint`, `bun run test`, and `bun run build` are also run by the GitHub Actions validation workflow.
