import { prisma } from '@/lib/db'
import { ContactList } from './contact-list'

export const dynamic = 'force-dynamic'

export default async function AdminContactPage() {
  const submissions = await prisma.contactSubmission.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Contact Submissions</h1>
      <ContactList submissions={submissions} />
    </div>
  )
}
