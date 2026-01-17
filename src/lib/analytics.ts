import { prisma } from './db'
import type { Prisma } from '@prisma/client'

type EventName =
  | 'parent_signup'
  | 'child_created'
  | 'path_selected'
  | 'mission_started'
  | 'mission_completed'
  | 'reminder_email_sent'
  | 'reminder_email_clicked'
  | 'subscription_started'
  | 'subscription_canceled'

interface TrackEventParams {
  eventName: EventName
  parentId?: string
  childId?: string
  metadata?: Record<string, unknown>
}

export async function trackEvent({ eventName, parentId, childId, metadata }: TrackEventParams) {
  try {
    await prisma.analyticsEvent.create({
      data: {
        eventName,
        parentId,
        childId,
        metadata: metadata as Prisma.InputJsonValue | undefined,
      },
    })
  } catch (error) {
    // Don't throw - analytics should never break the app
    console.error('Failed to track event:', error)
  }
}
