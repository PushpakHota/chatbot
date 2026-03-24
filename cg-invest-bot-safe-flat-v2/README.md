# CG Industrial Investment Assistant (Secure Version)

A safe, deployable clone of the chatbot architecture you analyzed.

## What this version fixes

The original frontend-only pattern exposed the LLM API key in the browser. This version uses:

- **Next.js App Router** for the UI and server endpoint
- **Anthropic server-side SDK** only inside the API route
- **Vercel environment variables** for the API key
- **No browser-side secret exposure**

## Architecture

```text
Browser
  ↓
Next.js frontend
  ↓
/api/chat (server-side route)
  ↓
Anthropic Messages API
```

## Project structure

```text
cg-invest-bot-safe/
├─ app/
│  ├─ api/
│  │  └─ chat/
│  │     └─ route.js
│  ├─ globals.css
│  ├─ layout.js
│  └─ page.js
├─ lib/
│  └─ systemPrompt.js
├─ .env.example
├─ .gitignore
├─ package.json
└─ README.md
```

## Environment variables

Create these in **Vercel Project Settings → Environment Variables**:

- `ANTHROPIC_API_KEY`
- `ANTHROPIC_MODEL` (optional)

Recommended value for `ANTHROPIC_MODEL`:

```text
claude-sonnet-4-6
```

If you want to mimic the older model from the site you inspected, you can use:

```text
claude-sonnet-4-20250514
```

## GitHub upload steps (no local dev required)

### Option A — create a new repo directly in GitHub

1. Go to GitHub.
2. Click **New repository**.
3. Name it something like `cg-invest-bot-safe`.
4. Create the repo.
5. Click **Add file → Upload files**.
6. Upload the contents of this project.
7. Commit the files.

### Option B — drag and drop the whole folder contents

Upload every file and folder from this project into the root of the repository.

Important: do **not** upload a real `.env.local` file.

## Vercel deployment steps

1. Go to Vercel.
2. Click **Add New → Project**.
3. Import your GitHub repository.
4. In the project setup screen, add:
   - `ANTHROPIC_API_KEY`
   - `ANTHROPIC_MODEL` (optional)
5. Click **Deploy**.

That is enough. No extra server is needed.

## Customization

### Change the system behavior
Edit:

```text
lib/systemPrompt.js
```

### Change the UI
Edit:

```text
app/page.js
app/globals.css
```

### Change model
Set a different value in:

```text
ANTHROPIC_MODEL
```

## Notes

- This is a **server-side proxy pattern**, which is the correct way to use secret LLM keys.
- The browser only talks to `/api/chat`.
- The Anthropic key never needs to appear in the frontend bundle.

## Quick safety checklist

Before going live, confirm:

- The repository does **not** contain a real `.env.local`
- No API key appears in `app/page.js` or any browser-side file
- The site works only after adding `ANTHROPIC_API_KEY` in Vercel
- Browser DevTools do **not** show `x-api-key` or `Authorization` to Anthropic from the client

## Next improvements you can add later

- Streaming responses
- Better markdown rendering
- RAG with policy documents
- Citation display
- Conversation history storage
- Admin prompt editor
- Rate limiting and abuse controls
