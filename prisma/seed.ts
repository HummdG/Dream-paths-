import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // ── Path ────────────────────────────────────────────────────────────────────
  // Required: the onboarding API looks this up by slug to assign a child to a path.
  const path = await prisma.path.upsert({
    where: { slug: 'junior_game_dev' },
    update: {},
    create: {
      slug: 'junior_game_dev',
      name: 'Junior Game Developer',
      description: 'Learn real Python by building two complete games from scratch — a Snake tutorial (4 missions) followed by a full platformer (11 missions).',
      ageRange: '8-14',
      imageUrl: null,
    },
  })

  console.log('✅ Path:', path.name)

  // ── Missions (legacy DB records) ────────────────────────────────────────────
  // The active learning content lives in src/lib/missions/*.ts (TypeScript packs).
  // These DB Mission rows exist only so the onboarding API can create MissionProgress
  // stubs for the child. Their content is not displayed to users.
  // Titles mirror the TypeScript pack files (snake-pack.ts + platformer-pack.ts).
  // These stubs exist solely so onboarding can create MissionProgress rows.
  const missionStubs = [
    // Snake pack (4 missions)
    { seq: 1,  title: 'Hello Python & the Snake World' },
    { seq: 2,  title: 'Functions & Snake Movement' },
    { seq: 3,  title: 'Keyboard Controls' },
    { seq: 4,  title: 'Score & Game Over' },
    // Platformer pack (11 missions)
    { seq: 5,  title: 'Design Your Hero' },
    { seq: 6,  title: 'Intro & Run' },
    { seq: 7,  title: 'Build Your Scene' },
    { seq: 8,  title: 'Movement with Functions' },
    { seq: 9,  title: 'Input & Conditionals' },
    { seq: 10, title: 'Loops & Level Building' },
    { seq: 11, title: 'Gravity & Jump' },
    { seq: 12, title: 'Collisions' },
    { seq: 13, title: 'Collectibles & Score' },
    { seq: 14, title: 'Enemy & Game Over' },
    { seq: 15, title: 'Win Condition & Polish' },
  ]

  for (const m of missionStubs) {
    await prisma.mission.upsert({
      where: { pathId_sequenceNumber: { pathId: path.id, sequenceNumber: m.seq } },
      update: { title: m.title },
      create: {
        pathId: path.id,
        sequenceNumber: m.seq,
        title: m.title,
        storyIntro: '',
        goal: '',
        stepsJson: [],
        estimatedDurationMinutes: 30,
        resourcesJson: [],
        unlockCondition: m.seq === 1 ? null : `completion_of_mission_${m.seq - 1}`,
      },
    })
  }

  console.log(`✅ ${missionStubs.length} mission stubs`)


  // ── Dev account ─────────────────────────────────────────────────────────────
  const devPasswordHash = await bcrypt.hash('password123', 10)

  const devParent = await prisma.parent.upsert({
    where: { email: 'dev@dreampaths.com' },
    update: { emailVerified: new Date(), passwordHash: devPasswordHash, name: 'Dev' },
    create: {
      email: 'dev@dreampaths.com',
      emailVerified: new Date(),
      passwordHash: devPasswordHash,
      name: 'Dev',
    },
  })

  await prisma.subscription.upsert({
    where: { parentId: devParent.id },
    update: { planId: 'dream_studio', status: 'ACTIVE' },
    create: {
      parentId: devParent.id,
      planId: 'dream_studio',
      status: 'ACTIVE',
    },
  })

  for (const pathId of ['computer_scientist', 'astronaut', 'doctor']) {
    await prisma.pathSubscription.upsert({
      where: { parentId_pathId: { parentId: devParent.id, pathId } },
      update: { status: 'ACTIVE' },
      create: { parentId: devParent.id, pathId, status: 'ACTIVE' },
    })
  }

  const existingChild = await prisma.child.findFirst({
    where: { parentId: devParent.id },
  })
  if (!existingChild) {
    await prisma.child.create({
      data: {
        parentId: devParent.id,
        firstName: 'Alex',
        age: 10,
        pathId: path.id,
      },
    })
  }

  // ── Calendar events (March 2026 dummy data) ─────────────────────────────────
  const devChild = await prisma.child.findFirst({ where: { parentId: devParent.id } })

  const marchEvents = [
    {
      title: 'Snake Tutorial - Mission 1',
      description: 'Hello Python and the Snake World',
      startAt: new Date('2026-03-03T16:00:00Z'),
      endAt:   new Date('2026-03-03T16:45:00Z'),
      isDreampaths: true,
      packId: 'snake_basics_v1',
    },
    {
      title: 'Snake Tutorial - Mission 2',
      description: 'Functions and Snake Movement',
      startAt: new Date('2026-03-05T16:00:00Z'),
      endAt:   new Date('2026-03-05T16:45:00Z'),
      isDreampaths: true,
      packId: 'snake_basics_v1',
    },
    {
      title: 'Football practice',
      description: null,
      startAt: new Date('2026-03-06T17:30:00Z'),
      endAt:   new Date('2026-03-06T18:30:00Z'),
      isDreampaths: false,
      packId: null,
    },
    {
      title: 'Snake Tutorial - Mission 3',
      description: 'Keyboard Controls',
      startAt: new Date('2026-03-10T16:00:00Z'),
      endAt:   new Date('2026-03-10T16:45:00Z'),
      isDreampaths: true,
      packId: 'snake_basics_v1',
    },
    {
      title: 'Snake Tutorial - Mission 4',
      description: 'Score and Game Over',
      startAt: new Date('2026-03-12T16:00:00Z'),
      endAt:   new Date('2026-03-12T16:45:00Z'),
      isDreampaths: true,
      packId: 'snake_basics_v1',
    },
    {
      title: 'Doctor appointment',
      description: null,
      startAt: new Date('2026-03-14T10:00:00Z'),
      endAt:   new Date('2026-03-14T10:30:00Z'),
      isDreampaths: false,
      packId: null,
    },
    {
      title: 'Platformer - Design Your Hero',
      description: 'Draw your 16x16 pixel art character',
      startAt: new Date('2026-03-17T16:00:00Z'),
      endAt:   new Date('2026-03-17T16:45:00Z'),
      isDreampaths: true,
      packId: 'platformer_v1',
    },
    {
      title: 'Platformer - Build Your Scene',
      description: 'Level design mission',
      startAt: new Date('2026-03-19T16:00:00Z'),
      endAt:   new Date('2026-03-19T16:45:00Z'),
      isDreampaths: true,
      packId: 'platformer_v1',
    },
    {
      title: 'Family day out',
      description: null,
      startAt: new Date('2026-03-22T10:00:00Z'),
      endAt:   new Date('2026-03-22T17:00:00Z'),
      isDreampaths: false,
      packId: null,
    },
    {
      title: 'Platformer - Movement with Functions',
      description: 'Mission 3 coding session',
      startAt: new Date('2026-03-24T16:00:00Z'),
      endAt:   new Date('2026-03-24T16:45:00Z'),
      isDreampaths: true,
      packId: 'platformer_v1',
    },
    {
      title: 'Platformer - Input and Conditionals',
      description: 'Mission 4 coding session',
      startAt: new Date('2026-03-26T16:00:00Z'),
      endAt:   new Date('2026-03-26T16:45:00Z'),
      isDreampaths: true,
      packId: 'platformer_v1',
    },
    {
      title: 'Easter coding catch-up',
      description: 'Extra session during school holidays',
      startAt: new Date('2026-03-31T11:00:00Z'),
      endAt:   new Date('2026-03-31T12:00:00Z'),
      isDreampaths: true,
      packId: 'platformer_v1',
    },
  ]

  for (const ev of marchEvents) {
    await prisma.calendarEvent.create({
      data: {
        parentId: devParent.id,
        childId: devChild?.id ?? null,
        title: ev.title,
        description: ev.description,
        startAt: ev.startAt,
        endAt: ev.endAt,
        isDreampaths: ev.isDreampaths,
        packId: ev.packId,
        emailReminder: false,
      },
    })
  }

  console.log(`✅ ${marchEvents.length} March calendar events`)

  console.log('✅ Dev account: dev@dreampaths.com / password123')

  // ── Admin account ────────────────────────────────────────────────────────────
  const adminPasswordHash = await bcrypt.hash('@HafsaIsBeautiful110302!', 12)
  await prisma.admin.upsert({
    where: { email: 'admin@dreampaths.co.uk' },
    update: { passwordHash: adminPasswordHash, name: 'Admin' },
    create: {
      email: 'admin@dreampaths.co.uk',
      passwordHash: adminPasswordHash,
      name: 'Admin',
    },
  })

  console.log('✅ Admin account: admin@dreampaths.co.uk')
  console.log('')
  console.log('🎉 Done!')
}

main()
  .then(async () => { await prisma.$disconnect() })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
