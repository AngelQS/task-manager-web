export type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'SCHEDULED' | 'ON_HOLD' | 'COMPLETED' | 'CANCELLED'
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'

export interface Task {
  id: number
  title: string
  status: TaskStatus
  priority: TaskPriority
  category?: string
  scheduledAt?: string
  createdAt: string
}
