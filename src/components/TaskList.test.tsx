import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import TaskList from './TaskList'
import type { Task } from '../types/task'

const tasks: Task[] = [
  { id: '1', title: 'Buy groceries', done: false },
  { id: '2', title: 'Write tests', done: true },
]

describe('TaskList', () => {
  it('renders a list of tasks', () => {
    render(<TaskList tasks={tasks} loading={false} error={null} />)

    expect(screen.getByText('Buy groceries')).toBeInTheDocument()
    expect(screen.getByText('Write tests')).toBeInTheDocument()
  })

  it('shows loading state', () => {
    render(<TaskList tasks={[]} loading={true} error={null} />)

    expect(screen.getByText(/loading/i)).toBeInTheDocument()
  })

  it('shows error message', () => {
    render(<TaskList tasks={[]} loading={false} error="Network error" />)

    expect(screen.getByText(/network error/i)).toBeInTheDocument()
  })

  it('shows empty state when no tasks', () => {
    render(<TaskList tasks={[]} loading={false} error={null} />)

    expect(screen.getByText(/no tasks/i)).toBeInTheDocument()
  })
})
