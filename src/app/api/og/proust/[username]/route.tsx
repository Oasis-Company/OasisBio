import { ImageResponse } from '@vercel/og'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ProustCardOG } from '@/components/proust/ProustCardOG'

export const runtime = 'edge'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params

    const profile = await prisma.profile.findUnique({
      where: { username },
      select: {
        userId: true,
        displayName: true,
      },
    })

    if (!profile) {
      return new ImageResponse(
        <ProustCardOG
          username=""
          question=""
          answer=""
          displayName=""
          profileUrl="oasisbio.oasiscompany.org"
          isFallback={true}
        />,
        {
          width: 1200,
          height: 630,
        }
      )
    }

    const latestAnswer = await prisma.proustAnswer.findFirst({
      where: {
        userId: profile.userId,
        isPublic: true,
      },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        question: true,
        answer: true,
      },
    })

    if (!latestAnswer) {
      return new ImageResponse(
        <ProustCardOG
          username=""
          question=""
          answer=""
          displayName=""
          profileUrl="oasisbio.oasiscompany.org"
          isFallback={true}
        />,
        {
          width: 1200,
          height: 630,
        }
      )
    }

    const profileUrl = `oasisbio.oasiscompany.org/bio/${username}`

    const response = new ImageResponse(
      <ProustCardOG
        username={username}
        question={latestAnswer.question}
        answer={latestAnswer.answer}
        displayName={profile.displayName}
        profileUrl={profileUrl}
      />,
      {
        width: 1200,
        height: 630,
      }
    )

    response.headers.set(
      'Cache-Control',
      'public, max-age=86400, stale-while-revalidate=604800'
    )

    return response
  } catch (error) {
    console.error('Error generating OG image:', error)

    return new ImageResponse(
      <ProustCardOG
        username=""
        question=""
        answer=""
        displayName=""
        profileUrl="oasisbio.oasiscompany.org"
        isFallback={true}
      />,
      {
        width: 1200,
        height: 630,
      }
    )
  }
}
