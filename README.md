# Inkwell Content Publishing Platform

Inkwell is a high-performance, SEO-optimized content management system and publishing platform. Designed for long-form editorial content, it features built-in artificial intelligence assistance for meta generation, robust dynamic routing, and an intuitive administration dashboard. The architecture prioritizes read-performance, semantic HTML, and accessibility.

## Key Features

*   **High Performance Content Delivery**: Utilizes Next.js App Router with Incremental Static Regeneration (ISR) to ensure near-instantaneous page loads and optimal Core Web Vitals.
*   **Integrated SEO Automation**: Automatically generates canonical URLs, structured JSON-LD schema, sitemaps, and RSS feeds.
*   **AI-Assisted Publishing**: Incorporates Groq AI to automatically synthesize optimal meta descriptions and SEO-friendly URL slugs based on article content.
*   **Professional Editorial Interface**: Features a custom-configured TipTap rich text editor that supports precise formatting, blockquotes, heading hierarchies, and embedded media.
*   **Comprehensive Administration**: Provides a secure dashboard to manage the complete publication lifecycle, track drafts, and organize categories.
*   **Modern Design System**: Implements a highly polished, responsive aesthetic using CSS variables and Tailwind CSS, featuring smooth transitions, glassmorphism effects, and rigorous typography scaling.

## Technical Architecture

*   **Core Framework**: Next.js 16.x (App Router)
*   **Language**: TypeScript
*   **Database Engine**: PostgreSQL
*   **ORM**: Prisma
*   **Authentication**: NextAuth.js (Credentials Provider)
*   **Styling**: Tailwind CSS, PostCSS, Custom CSS Variables
*   **Content Editor**: TipTap
*   **AI Integration**: Groq SDK / Anthropic SDK
*   **Validation**: Zod

## Local Setup Instructions

### 1. Prerequisites

Ensure the following dependencies are installed on your local development environment:
*   Node.js (v18.x or newer)
*   npm or yarn
*   A running PostgreSQL instance (or cloud provider such as Neon/Supabase)
*   A Groq API Key (required for AI meta generation)

### 2. Installation

Clone the repository and install the required Node modules:

```bash
git clone <repository-url>
cd inkwell
npm install
```

### 3. Environment Configuration

Copy the example environment template and configure your local variables.

```bash
cp .env.example .env
```

Ensure the following variables are correctly defined in your `.env` file:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/inkwell?schema=public&pgbouncer=true&connect_timeout=15"
DIRECT_URL="postgresql://user:password@localhost:5432/inkwell?schema=public"
NEXTAUTH_SECRET="your-secure-random-jwt-secret"
NEXTAUTH_URL="http://localhost:3000"
GROQ_API_KEY="your-groq-api-key"
```

*Note: If using a connection pooler like PgBouncer (common with Neon), ensure you utilize both DATABASE_URL for runtime queries and DIRECT_URL for Prisma migrations.*

### 4. Database Initialization and Seeding

Generate the Prisma client, push the schema to your database, and execute the seed script to populate initial data and the administrator account:

```bash
npx prisma generate
npx prisma db push
npx prisma db seed
```

**Default Administrator Credentials (from seed):**
*   Email: `admin@inkwell.dev`
*   Password: `admin1234`

### 5. Running the Application

Start the local development server:

```bash
npm run dev
```

*   **Public Interface**: `http://localhost:3000`
*   **Administration Panel**: `http://localhost:3000/admin`

## Deployment Guidelines

Inkwell is optimized for deployment on Vercel or similar Edge/Serverless platforms.

1.  Push the repository to GitHub, GitLab, or Bitbucket.
2.  Import the project into your hosting provider dashboard (e.g., Vercel).
3.  Configure the required environment variables (`DATABASE_URL`, `DIRECT_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `GROQ_API_KEY`).
4.  Initiate the deployment process.
5.  Post-deployment, ensure you execute `npx prisma db push` or `npx prisma migrate deploy` against your production database, followed by the seed script if it is a fresh environment.

## License

Copyright 2026. All rights reserved.
