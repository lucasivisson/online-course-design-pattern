/* eslint-disable @typescript-eslint/no-explicit-any */
import { GetUserUseCase } from '@/business/use-cases/user/get-user-use-case'
import { UpdateUserUseCase } from '@/business/use-cases/user/update-user-use-case'
import { PrismaUserRepository } from '@/framework/repositories/mongo-user-repository'
import { UserEntity } from '@/entities/user-entity'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query // Captura o userId da URL (ex: /api/user/123)

  if (typeof id !== 'string') {
    return res.status(400).json({ message: 'Invalid User ID' })
  }

  const userRepository = new PrismaUserRepository()

  // --- GET User ---
  if (req.method === 'GET') {
    const getUserUseCase = new GetUserUseCase(userRepository)
    try {
      const user = await getUserUseCase.execute({ id }) // Passa o userId para a busca
      return res.status(200).json({ user })
    } catch (error: any) {
      console.error(error)
      // Prisma findUniqueOrThrow lança PrismaClientKnownRequestError se não encontrar
      if (error.code === 'P2025') { // Código para "record not found"
        return res.status(404).json({ message: 'User not found' })
      }
      return res.status(500).json({ message: 'Internal Server Error' })
    }
  }

  // --- UPDATE User ---
  if (req.method === 'PUT') { // PUT é comumente usado para atualizações completas de recursos
    const { name, email } = req.body

    if (!name && !email) {
      return res.status(400).json({ message: 'Name and email are required for update.' })
    }

    const updateUserUseCase = new UpdateUserUseCase(userRepository)
    try {
      // Crie uma UserEntity com os dados completos, incluindo o ID da URL
      const userToUpdate = new UserEntity(name, email, id)
      const updatedUser = await updateUserUseCase.execute(userToUpdate)
      return res.status(200).json({ user: updatedUser })
    } catch (error: any) {
      console.error(error)
      if (error.code === 'P2025') { // Código para "record not found" (se tentar atualizar um usuário que não existe)
        return res.status(404).json({ message: 'User not found for update.' })
      }
      return res.status(500).json({ message: 'Internal Server Error' })
    }
  }

  return res.status(405).json({ message: 'Method Not Allowed' })
}