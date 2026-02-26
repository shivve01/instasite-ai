# 🚀 InstaSite AI — AI Website Builder

Describe your dream website, and InstaSite AI will generate a full, production-ready codebase for you — complete with routing, styling, and responsive design.

## Tech Stack

| Layer    | Technologies |
|----------|-------------|
| Frontend | React 18, TypeScript, Tailwind CSS, Framer Motion, Zustand |
| Backend  | Node.js, Express, TypeScript |
| AI       | OpenAI GPT-4o / Anthropic Claude |

## Quick Start

### 1. Clone and install

```bash
# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
```

### 2. Configure environment

```bash
# From project root
cp .env.example server/.env
# Edit server/.env and add your API key
```

### 3. Run in development

```bash
# Terminal 1 — Backend
cd server
npm run dev

# Terminal 2 — Frontend
cd client
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Project Structure

```
instasite-ai/
├── client/          # React + Vite frontend
│   └── src/
│       ├── components/   # UI components
│       ├── pages/        # Route pages
│       ├── store/        # Zustand state
│       ├── services/     # API layer
│       ├── hooks/        # Custom hooks
│       ├── types/        # TypeScript types
│       └── utils/        # Utilities
├── server/          # Express backend
│   └── src/
│       ├── routes/       # API routes
│       ├── services/     # AI integration
│       ├── prompts/      # System prompts
│       └── middleware/   # Rate limiting, validation
└── .env.example     # Environment template
```

## License

MIT
