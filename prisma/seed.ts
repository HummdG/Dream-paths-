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


  console.log('')
  console.log('🎉 Done!')
  console.log('')
  console.log('Dev login → dev@dreampaths.com / password123')
}

main()
  .then(async () => { await prisma.$disconnect() })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
