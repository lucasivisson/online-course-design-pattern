export interface NotificationEntity {
  id: string
  message: string
  senderId: string
  receiversIds: string[]
  readBy: string[]
  createdAt: Date;
  updatedAt: Date;
}