import { CreateUserUseCase } from '@/business/use-cases/user/create-user-use-case'
import { PrismaUserRepository } from '@/framework/repositories/mongo-user-repository'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { name, email } = req.body

  const userRepository = new PrismaUserRepository()
  const createUserUseCase = new CreateUserUseCase(userRepository)

  try {
    const user = await createUserUseCase.execute({ name, email })
    return res.status(201).json({ user })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}