/**
 * HTTP server entry point
 *
 * Validates required environment variables before starting so the process
 * exits with a clear error message instead of crashing mid-request later.
 */

import 'dotenv/config';
import app from './app';

// ─── Environment validation ───────────────────────────────────────────────────

const REQUIRED_ENV = ['SUPABASE_URL', 'SUPABASE_SERVICE_KEY', 'API_KEY'] as const;

for (const key of REQUIRED_ENV) {
  if (!process.env[key]) {
    console.error(
      `[startup] Missing required environment variable: ${key}\n` +
        `         Copy .env.example to .env and fill in the value.`,
    );
    process.exit(1);
  }
}

// ─── Start server ─────────────────────────────────────────────────────────────

const PORT = parseInt(process.env.PORT ?? '3000', 10);

const server = app.listen(PORT, () => {
  console.log(`\n🚀  GraphOne API running on http://localhost:${PORT}`);
  console.log(`   Environment : ${process.env.NODE_ENV ?? 'development'}`);
  console.log(`   Health check: http://localhost:${PORT}/health\n`);
});

// ─── Graceful shutdown ────────────────────────────────────────────────────────

function shutdown(signal: string) {
  console.log(`\n[server] Received ${signal}, shutting down gracefully…`);
  server.close(() => {
    console.log('[server] All connections closed. Goodbye.');
    process.exit(0);
  });

  // Force exit if connections don't close within 10 s
  setTimeout(() => {
    console.error('[server] Forced shutdown after timeout.');
    process.exit(1);
  }, 10_000).unref();
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

export default server;
