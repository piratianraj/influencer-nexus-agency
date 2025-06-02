# Influencer Nexus Agency

A modern influencer marketing platform for brands and agencies to discover, manage, and analyze influencer campaigns.

## 🚀 Project Overview

Influencer Nexus Agency is a full-stack web application that enables brands to:
- Discover and filter creators/influencers
- Create and manage influencer marketing campaigns
- Track campaign progress and analytics
- Collaborate with creators and manage contracts, payments, and reports

## ✨ Features
- **Discovery:** Advanced search and filtering for creators
- **Campaign Management:** Create, edit, and track campaigns
- **Analytics:** Visualize campaign performance and ROI
- **Workflow Guide:** Step-by-step campaign workflow
- **Authentication:** User sign-in and access control
- **Supabase Integration:** Real-time database and serverless functions

## 🛠️ Tech Stack
- **Frontend:** [React](https://react.dev/), [Vite](https://vitejs.dev/), [TypeScript](https://www.typescriptlang.org/)
- **UI:** [shadcn/ui](https://ui.shadcn.com/), [Tailwind CSS](https://tailwindcss.com/), [Lucide Icons](https://lucide.dev/)
- **Backend/DB:** [Supabase](https://supabase.com/) (Postgres, Auth, Edge Functions)
- **State Management:** React Context, React Hooks
- **Other:** [MIT License](#license)

## 📦 Getting Started

1. **Install dependencies:**
   ```sh
   npm install
   # or
   bun install
   ```
2. **Set up environment variables:**
   - Copy `.env.example` to `.env` and fill in your Supabase credentials.
3. **Run the development server:**
   ```sh
   npm run dev
   ```
4. **Open your browser:**
   - Visit [http://localhost:8080](http://localhost:8080)

## 📁 Project Structure
- `src/pages/` — Main app pages (Discovery, Campaigns, Analytics, etc.)
- `src/components/` — Reusable UI and feature components
- `src/integrations/supabase/` — Supabase client and types
- `supabase/functions/` — Supabase Edge Functions (API)

## 🙌 About & Credits

- **Made by:** Rohit Raj and Shubham Sinha
- **Built with:** [Lovable](https://lovable.dev/) and [Cursor](https://www.cursor.so/)
- **Hosted on:** [Vercel](https://vercel.com/)
- **Powered by:** [Supabase](https://supabase.com/) (database, auth, edge functions) and DeepSeek LLM (AI/LLM features)

## 📝 License

MIT License. See [LICENSE](LICENSE) for details.
