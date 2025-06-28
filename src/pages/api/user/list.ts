import { ListUsersUseCase } from '@/business/use-cases/user/list-users-use-case'
import { PrismaUserRepository } from '@/framework/repositories/mongo-user-repository'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' })
  }

  const userRepository = new PrismaUserRepository()
  const listUsersUseCase = new ListUsersUseCase(userRepository)

  try {
    const users = await listUsersUseCase.execute()
    return res.status(200).json({ users })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}