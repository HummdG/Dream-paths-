import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/db'
import { authOptions } from '@/lib/auth'
import { trackEvent } from '@/lib/analytics'

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { childId, originalImage, spriteSheetUrl, style, name } = body

    // Verify the child belongs to this parent
    const child = await prisma.child.findFirst({
      where: {
        id: childId,
        parentId: session.user.id,
      },
    })

    if (!child) {
      return NextResponse.json({ error: 'Child not found' }, { status: 404 })
    }

    // Fetch and store the sprite as base64 for persistence
    let spriteSheetData: string | null = null
    if (spriteSheetUrl) {
      try {
        const response = await fetch(spriteSheetUrl)
        const blob = await response.blob()
        const buffer = await blob.arrayBuffer()
        spriteSheetData = `data:${blob.type};base64,${Buffer.from(buffer).toString('base64')}`
      } catch {
        // If we can't fetch, we'll just store the URL
        console.warn('Could not fetch sprite sheet for base64 storage')
      }
    }

    const character = await prisma.character.create({
      data: {
        childId,
        name: name || null,
        originalImage: originalImage || null,
        spriteSheetUrl: spriteSheetUrl || null,
        spriteSheetData,
        style: style || 'retro',
        status: 'COMPLETED',
      },
    })

    // Track character creation
    await trackEvent({
      eventName: 'character_created',
      parentId: session.user.id,
      childId,
      metadata: {
        characterId: character.id,
        style,
      },
    })

    return NextResponse.json({
      success: true,
      character: {
        id: character.id,
        name: character.name,
        style: character.style,
        status: character.status,
        createdAt: character.createdAt.toISOString(),
      },
    })
  } catch (error) {
    console.error('Character creation error:', error)
    return NextResponse.json(
      { error: 'Failed to save character' },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const childId = searchParams.get('childId')

    // Get child for this parent
    const child = await prisma.child.findFirst({
      where: childId
        ? { id: childId, parentId: session.user.id }
        : { parentId: session.user.id },
    })

    if (!child) {
      return NextResponse.json({ error: 'Child not found' }, { status: 404 })
    }

    const characters = await prisma.character.findMany({
      where: { childId: child.id },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        spriteSheetUrl: true,
        spriteSheetData: true,
        style: true,
        status: true,
        createdAt: true,
      },
    })

    return NextResponse.json({ characters })
  } catch (error) {
    console.error('Character fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch characters' },
      { status: 500 }
    )
  }
}

