# Inkwell — SEO-Optimised Content Publishing Platform

Inkwell is a lightweight, SEO-first content publishing platform with built-in AI meta generation, dynamic routing, and high Lighthouse performance out-of-the-box. Built with Next.js 14 (App Router), Prisma, PostgreSQL, and Tailwind CSS.

## Features

- **Blazing Fast**: Incremental Static Regeneration (ISR) ensures high Lighthouse performance.
- **Built-in SEO**: Auto-generated Meta tags, canonical URLs, JSON-LD schema, and dynamically generated Sitemap and RSS feeds.
- **AI-Powered**: One-click generation of Meta Descriptions and SEO-friendly slugs using Groq AI.
- **Rich Text Editing**: Clean TipTap editor supporting headings, lists, quotes, and images.
- **Content Dashboard**: Simple admin panel to track published, drafted, and total articles.

---

## Architecture / Tech Stack

- **Framework**: Next.js 14.x (App Router)
- **Database ORM**: Prisma
- **Database Engine**: PostgreSQL (Neon, Supabase, or local)
- **Authentication**: NextAuth.js (Credentials Provider)
- **Styling**: Tailwind CSS + Custom Design System
- **Validation**: Zod
- **Editor**: TipTap

---

## Local Setup Instructions

### 1. Prerequisites

Ensure you have the following installed:
- Node.js (v18+)
- PostgreSQL database (or an empty Neon / Supabase project)
- A Groq API Key (for the Groq AI features)

### 2. Clone and Install Dependencies

```bash
git clone <your-repo-url>
cd inkwell
npm install
```

### 3. Environment Variables

Create a `.env` file in the root of the project (you can copy from `.env.example`) and fill in your values:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/inkwell?schema=public"
NEXTAUTH_SECRET="your-random-secret-key-for-jwt"
NEXTAUTH_URL="http://localhost:3000"
GROQ_API_KEY="your-groq-api-key"
```

### 4. Database Initialization & Seeding

Sync your Prisma schema with the database and seed the initial admin account:

```bash
# Push the schema to your PostgreSQL database
npx prisma db push

# Generate the Prisma client
npx prisma generate

# Seed the initial admin account, categories, and author profile
npx prisma db seed
```

**Default Admin Login**
- Email: `admin@example.com`
- Password: `password123`

### 5. Start the Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` for the public site.
Visit `http://localhost:3000/admin/login` for the admin dashboard.

---

## Deployment (Vercel)

1. Push your code to a GitHub repository.
2. Import the project into Vercel.
3. In the Vercel dashboard, add the following Environment Variables:
   - `DATABASE_URL`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL` (Set to your production domain)
   - `GROQ_API_KEY`
4. Deploy!
5. After deployment, make sure to run the seed script on your production database (or migrate it) if you haven't already.

**Note on Background Processes:**
The sitemap is generated automatically post-build via `next-sitemap`. Images are mocked locally for now, but you should hook up a Vercel Blob or AWS S3 bucket for production file uploads by replacing the logic in `src/app/api/upload/route.ts`.
