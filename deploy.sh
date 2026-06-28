#!/usr/bin/env bash
set -euo pipefail

# ═══════════════════════════════════════════════════════════
#  Qahtan Al Saidi — Portfolio Deployment Script
# ═══════════════════════════════════════════════════════════
#
#  Architecture:
#    - Schema uses provider="sqlite" (local) everywhere
#    - instrumentation.ts swaps to Turso at runtime in production
#    - db.ts uses a Proxy that reads from globalThis
#    - No schema swapping needed — just set env vars & deploy
#
# Usage:
#   ./deploy.sh setup      — Create Turso DB + push schema + seed
#   ./deploy.sh vercel     — Deploy to Vercel
#   ./deploy.sh docker     — Build Docker image
# ═══════════════════════════════════════════════════════════

DB_NAME="${DB_NAME:-portfolio-db}"

case "${1:-help}" in

  setup)
    echo ""
    echo "════════════════════════════════════════════"
    echo "  Creating Turso Database"
    echo "════════════════════════════════════════════"
    echo ""

    if ! command -v turso &>/dev/null; then
      echo "❌ Turso CLI not found. Install it:"
      echo "   curl -sSfL https://get.tur.so/install.sh | bash"
      exit 1
    fi

    # Create database
    echo "📦 Creating database '$DB_NAME'..."
    turso db create "$DB_NAME" 2>&1 || true

    # Get credentials
    TURSO_URL=$(turso db show "$DB_NAME" --url 2>&1)
    TURSO_TOKEN=$(turso db tokens create "$DB_NAME" 2>&1)

    echo ""
    echo "════════════════════════════════════════════"
    echo "  Credentials"
    echo "════════════════════════════════════════════"
    echo ""
    echo "  DATABASE_URL        = $TURSO_URL"
    echo "  TURSO_DATABASE_URL  = $TURSO_URL"
    echo "  TURSO_AUTH_TOKEN    = $TURSO_TOKEN"
    echo ""

    # Push schema (temporarily use libsql provider for push)
    echo "📦 Pushing schema to Turso..."
    sed -i.bak 's/provider = "sqlite"/provider = "libsql"/' prisma/schema.prisma
    DATABASE_URL="$TURSO_URL" npx prisma db push --accept-data-loss 2>&1
    mv prisma/schema.prisma.bak prisma/schema.prisma

    # Seed the database
    echo ""
    echo "📦 Seeding database..."
    sed -i.bak 's/provider = "sqlite"/provider = "libsql"/' prisma/schema.prisma
    DATABASE_URL="$TURSO_URL" npx prisma db seed 2>&1
    mv prisma/schema.prisma.bak prisma/schema.prisma

    # Regenerate local client
    npx prisma generate 2>&1 > /dev/null

    JWT_SECRET=$(openssl rand -hex 32 2>/dev/null || echo "change-me-$(date +%s)")

    echo ""
    echo "════════════════════════════════════════════"
    echo "  ✅ Setup Complete!"
    echo "════════════════════════════════════════════"
    echo ""
    echo "  Now set these in Vercel (Dashboard → Settings → Env):"
    echo ""
    echo "  DATABASE_URL        = $TURSO_URL"
    echo "  TURSO_DATABASE_URL  = $TURSO_URL"
    echo "  TURSO_AUTH_TOKEN    = $TURSO_TOKEN"
    echo "  JWT_SECRET          = $JWT_SECRET"
    echo ""
    echo "  Then run:  ./deploy.sh vercel"
    echo ""
    ;;

  vercel)
    echo ""
    echo "🚀 Deploying to Vercel..."

    if ! command -v vercel &>/dev/null; then
      echo "Installing Vercel CLI..."
      npm i -g vercel 2>&1
    fi

    vercel --prod 2>&1

    echo ""
    echo "✅ Deployed!"
    echo ""
    ;;

  docker)
    echo ""
    echo "🐳 Building Docker image..."
    docker build -t qahtan-portfolio .
    echo ""
    echo "✅ Image built. Run with:"
    echo "  docker run -d --name portfolio -p 3000:3000 -v \$(pwd)/db:/app/db -e JWT_SECRET=your-secret qahtan-portfolio"
    echo ""
    echo "Seed (first time only):"
    echo "  docker exec -it portfolio npx prisma db seed"
    echo ""
    ;;

  *)
    echo ""
    echo "╔═══════════════════════════════════════════════╗"
    echo "║   Qahtan Al Saidi — Portfolio Deploy         ║"
    echo "╠═══════════════════════════════════════════════╣"
    echo "║                                               ║"
    echo "║   ./deploy.sh setup    Turso DB + seed        ║"
    echo "║   ./deploy.sh vercel   Deploy to Vercel       ║"
    echo "║   ./deploy.sh docker   Build Docker image     ║"
    echo "║                                               ║"
    echo "╚═══════════════════════════════════════════════╝"
    echo ""
    ;;
esac