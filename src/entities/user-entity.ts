import { generateUuid } from "@/shared/uuid"

export class UserEntity {
  public readonly id: string
  public readonly createdAt: Date
  public updatedAt: Date
  constructor(public name: string, public email: string, id?: string, createdAt?: Date, updatedAt?: Date) {
    this.createdAt = createdAt ?? new Date()
    this.updatedAt = updatedAt ?? new Date()
    this.id = id ?? generateUuid()
  }
}