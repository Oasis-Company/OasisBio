import { prisma } from './prisma'

export type ProustAnswerData = {
  id: string
  question: string
  answer: string
  username: string
  displayName: string
}

export async function getLatestPublicProustAnswerByUsername(username: string): Promise<ProustAnswerData | null> {
  const profile = await prisma.profile.findUnique({
    where: { username },
    select: {
      userId: true,
      displayName: true,
    },
  })

  if (!profile) {
    return null
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
    return null
  }

  return {
    id: latestAnswer.id,
    question: latestAnswer.question,
    answer: latestAnswer.answer,
    username,
    displayName: profile.displayName,
  }
}

export async function hasPublicProustAnswerExistsByUsername(username: string): Promise<boolean> {
  const answer = await getLatestPublicProustAnswerByUsername(username)
  return answer !== null
}
