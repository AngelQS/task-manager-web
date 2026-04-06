import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import TaskList from './TaskList'
import type { Task } from '../types/task'

const tasks: Task[] = [
  {
    id: 1,
    title: 'Buy groceries',
    status: 'PENDING',
    priority: 'MEDIUM',
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    title: 'Write tests',
    status: 'COMPLETED',
    priority: 'HIGH',
    createdAt: new Date().toISOString(),
  },
]

const noop = vi.fn()

describe('TaskList', () => {
  it('renders a list of tasks', () => {
    render(<TaskList tasks={tasks} loading={false} error={null} onStatusChange={noop} onDelete={noop} />)

    expect(screen.getByText('Buy groceries')).toBeInTheDocument()
    expect(screen.getByText('Write tests')).toBeInTheDocument()
  })

  it('shows loading state', () => {
    render(<TaskList tasks={[]} loading={true} error={null} onStatusChange={noop} onDelete={noop} />)

    expect(screen.getByText(/loading/i)).toBeInTheDocument()
  })

  it('shows error message', () => {
    render(<TaskList tasks={[]} loading={false} error="Network error" onStatusChange={noop} onDelete={noop} />)

    expect(screen.getByText(/network error/i)).toBeInTheDocument()
  })

  it('shows empty state when no tasks', () => {
    render(<TaskList tasks={[]} loading={false} error={null} onStatusChange={noop} onDelete={noop} />)

    expect(screen.getByText(/no tasks/i)).toBeInTheDocument()
  })
})
