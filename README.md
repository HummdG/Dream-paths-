# 🚀 DreamPaths

**Turn your child's love of games into real coding skills!**

DreamPaths is a web application where parents enroll their child (ages 8-12) into a "dream career" learning path, and kids complete weekly missions to build real skills. This MVP focuses on the **Junior Game Developer** path.

![DreamPaths](https://placeholder.com/dreampaths-hero.png)

## ✨ Features

### For Parents
- 📊 **Dashboard** - Track your child's progress at a glance
- 📧 **Email reminders** - Get notified about new missions and inactivity
- ⚙️ **Simple setup** - Onboard in under 2 minutes
- 🔒 **Privacy-first** - Only collect child's first name and age

### For Kids
- 🎮 **Story-driven missions** - Each mission has a fun narrative
- ✅ **Step-by-step guidance** - Clear checklists for each mission
- 🎉 **Celebrations** - Confetti and rewards for completing missions
- 🎨 **Kid-friendly design** - Colorful, playful UI

### Junior Game Developer Path (8 Missions)
1. 🎨 Design Your Hero
2. 🏗️ Build Your First Playable Scene
3. 🏃 Add Jumping and Gravity
4. ⭐ Create Collectible Coins
5. 🔊 Add Sound Effects and Music
6. 🚧 Build Obstacles and Challenge
7. 📋 Create a Start Menu
8. 🚀 Polish and Share Your Game

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Auth**: NextAuth.js (credentials provider)
- **Email**: Resend
- **Styling**: TailwindCSS
- **Animations**: Framer Motion
- **Icons**: Lucide React

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- (Optional) Resend API key for emails

### Installation

1. **Clone and install**
   ```bash
   cd dreampaths-kids
   npm install
   ```

2. **Configure environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   # Database
   DATABASE_URL="postgresql://user:password@localhost:5432/dreampaths_kids"

   # NextAuth.js
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="generate-a-secret-with-openssl-rand-base64-32"

   # Email (Resend) - Optional for development
   RESEND_API_KEY="re_xxxxxxxxxxxx"
   FROM_EMAIL="DreamPaths <noreply@yourdomain.com>"

   # App URL
   APP_URL="http://localhost:3000"
   ```

3. **Set up the database**
   ```bash
   # Generate Prisma client
   npm run db:generate

   # Push schema to database
   npm run db:push

   # Seed with Junior Game Developer path and missions
   npm run db:seed
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open [http://localhost:3000](http://localhost:3000)**

## 📁 Project Structure

```
dreampaths-kids/
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.ts            # Seed data (8 missions)
├── src/
│   ├── app/
│   │   ├── (auth)/        # Auth pages (login, signup, verify)
│   │   ├── (app)/         # Protected pages (dashboard, missions)
│   │   ├── api/           # API routes
│   │   ├── layout.tsx     # Root layout
│   │   └── page.tsx       # Landing page
│   ├── components/        # Shared components
│   └── lib/
│       ├── auth.ts        # NextAuth configuration
│       ├── db.ts          # Prisma client
│       ├── email.ts       # Email templates
│       └── analytics.ts   # Event tracking
└── public/                # Static assets
```

## 🔑 User Flows

### Parent Sign Up
1. Visit landing page → Click "Get Started"
2. Enter email and password
3. Verify email via link
4. Complete onboarding (name, child info, path selection)
5. Redirected to dashboard

### Child Mission Flow
1. Parent opens dashboard
2. Click "Start Mission" on next available mission
3. Child views story intro and step checklist
4. Check off steps as completed
5. Click "Complete Mission" when done
6. Celebration + next mission unlocks

## 💰 Pricing (MVP)

| Plan | Price | Features |
|------|-------|----------|
| **Free** | £0 | First 2 missions, 1 child |
| **Founding Family** | £9/mo | All 8 missions, 2 children |

*Payment integration (Stripe) coming soon!*

## 📧 Email Notifications

- **Verification email** - On sign up
- **Welcome email** - After onboarding
- **New mission available** - When next mission unlocks
- **Inactivity reminder** - After 7 days without progress

In development mode without a Resend API key, emails are logged to the console.

## 🎨 Design System

- **Primary Colors**: Indigo (#6366f1) → Violet (#8b5cf6)
- **Background**: Warm cream (#fef7f0)
- **Accent**: Coral, Mint, Sky
- **Font**: Nunito (playful, rounded)
- **Border Radius**: Large (16-24px)
- **Animations**: Bouncy, celebratory

## 📊 Analytics Events

The app tracks these events for analytics:
- `parent_signup`
- `child_created`
- `path_selected`
- `mission_started`
- `mission_completed`
- `reminder_email_sent`
- `subscription_started`

## 🔐 Security & Privacy

- Minimal data collection (child first name only)
- Password hashing with bcrypt
- Email verification required
- JWT-based sessions
- No public profiles
- Parent can delete account and all data

## 🚢 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy!

### Environment Variables for Production

```env
DATABASE_URL="your-production-db-url"
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="generate-a-secure-secret"
RESEND_API_KEY="re_xxxxxxxxxxxx"
FROM_EMAIL="DreamPaths <hello@your-domain.com>"
APP_URL="https://your-domain.com"
```

## 📝 Development Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to database
npm run db:migrate   # Run migrations
npm run db:seed      # Seed database
npm run db:studio    # Open Prisma Studio
```

## 🗺️ Roadmap (Post-MVP)

- [ ] Stripe payment integration
- [ ] Multiple dream paths (Artist, Scientist, Storyteller)
- [ ] Badge/achievement system
- [ ] Progress sharing for grandparents
- [ ] Mobile app (React Native)
- [ ] Multi-language support

## 📄 License

MIT © DreamPaths

---

Built with ❤️ for young creators everywhere.
