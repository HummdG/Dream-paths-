export const DEV_EMAIL = 'dev@dreampaths.com'

import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { compare } from 'bcryptjs'
import { prisma } from './db'
import { checkRateLimit } from './rate-limit'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as NextAuthOptions['adapter'],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
    signOut: '/',
    error: '/login',
    verifyRequest: '/verify-email',
  },
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please enter your email and password')
        }

        // 10 attempts per email per 15 minutes — protects against targeted brute force.
        // Keyed by email so an attacker cannot bypass by rotating IPs.
        const rl = checkRateLimit(
          `login:${credentials.email.toLowerCase()}`,
          10,
          15 * 60 * 1000
        )
        if (!rl.allowed) {
          throw new Error('Too many login attempts. Please try again later.')
        }

        const parent = await prisma.parent.findUnique({
          where: { email: credentials.email.toLowerCase() },
        })

        if (!parent || !parent.passwordHash) {
          throw new Error('No account found with this email')
        }

        if (!parent.emailVerified) {
          throw new Error('Please verify your email before signing in')
        }

        const isPasswordValid = await compare(credentials.password, parent.passwordHash)

        if (!isPasswordValid) {
          throw new Error('Invalid password')
        }

        return {
          id: parent.id,
          email: parent.email,
          name: parent.name,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger }) {
      // On initial sign-in, or when session.update() is called
      if (user || trigger === 'update') {
        const parentId = user?.id ?? (token.id as string)
        const subscription = await prisma.subscription.findUnique({
          where: { parentId },
          select: { planId: true, status: true },
        })
        token.subscriptionPlan = subscription?.planId ?? 'free'
        token.subscriptionStatus = subscription?.status ?? 'TRIALING'
      }
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.subscriptionPlan = (token.subscriptionPlan as string) ?? 'free'
        session.user.subscriptionStatus = (token.subscriptionStatus as string) ?? 'TRIALING'
      }
      return session
    },
  },
}

// Type augmentation for next-auth
declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email?: string | null
      name?: string | null
      subscriptionPlan: string
      subscriptionStatus: string
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    subscriptionPlan?: string
    subscriptionStatus?: string
  }
}
