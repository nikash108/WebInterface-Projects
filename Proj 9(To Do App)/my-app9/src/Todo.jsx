import { useEffect, useMemo, useState } from 'react'
import './Todo.css'

const STORAGE_KEY = 'advanced-todo-app-v1'

const defaultTasks = [
  {
    id: 1,
    text: 'Plan the weekly sprint goals',
    done: false,
    priority: 'high',
    category: 'Work',
    dueDate: '2026-09-28',
    createdAt: '2026-09-26T09:00:00.000Z',
  },
  {
    id: 2,
    text: 'Book gym session for tomorrow',
    done: true,
    priority: 'medium',
    category: 'Health',
    dueDate: '2026-09-27',
    createdAt: '2026-09-25T18:00:00.000Z',
  },
  {
    id: 3,
    text: 'Reply to the design feedback thread',
    done: false,
    priority: 'low',
    category: 'Inbox',
    dueDate: '',
    createdAt: '2026-09-26T08:30:00.000Z',
  },
]

const priorityOrder = {
  high: 3,
  medium: 2,
  low: 1,
}

function formatShortDate(value) {
  if (!value) return 'No due date'

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return 'No due date'
  }

  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
  }).format(date)
}

function getDueBadge(task) {
  if (!task.dueDate) {
    return { label: 'No deadline', tone: 'neutral' }
  }

  const today = new Date()
  const due = new Date(task.dueDate)
  const diffDays = Math.ceil((due - today) / (1000 * 60 * 60 * 24))

  if (task.done) {
    return { label: 'Completed', tone: 'done' }
  }

  if (diffDays < 0) {
    return { label: `Overdue by ${Math.abs(diffDays)}d`, tone: 'overdue' }
  }

  if (diffDays === 0) {
    return { label: 'Due today', tone: 'today' }
  }

  if (diffDays <= 2) {
    return { label: `Due in ${diffDays}d`, tone: 'soon' }
  }

  return { label: `Due ${formatShortDate(task.dueDate)}`, tone: 'neutral' }
}

function Todo() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY)

    if (!saved) {
      return defaultTasks
    }

    try {
      const parsed = JSON.parse(saved)
      return Array.isArray(parsed) && parsed.length ? parsed : defaultTasks
    } catch {
      return defaultTasks
    }
  })

  const [taskText, setTaskText] = useState('')
  const [priority, setPriority] = useState('medium')
  const [category, setCategory] = useState('General')
  const [dueDate, setDueDate] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('priority')

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
  }, [tasks])

  const stats = useMemo(() => {
    const total = tasks.length
    const completed = tasks.filter((task) => task.done).length
    const pending = total - completed
    const progress = total ? Math.round((completed / total) * 100) : 0

    return { total, completed, pending, progress }
  }, [tasks])

  const visibleTasks = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()

    const filtered = tasks.filter((task) => {
      const matchesSearch =
        !normalizedSearch ||
        task.text.toLowerCase().includes(normalizedSearch) ||
        task.category.toLowerCase().includes(normalizedSearch)

      const matchesFilter =
        filter === 'all' ||
        (filter === 'active' && !task.done) ||
        (filter === 'completed' && task.done) ||
        (filter === 'high' && task.priority === 'high')

      return matchesSearch && matchesFilter
    })

    return filtered.sort((a, b) => {
      if (sortBy === 'date') {
        const dateA = a.dueDate ? new Date(a.dueDate).getTime() : Number.MAX_SAFE_INTEGER
        const dateB = b.dueDate ? new Date(b.dueDate).getTime() : Number.MAX_SAFE_INTEGER
        if (dateA !== dateB) return dateA - dateB
      }

      const priorityDelta = priorityOrder[b.priority] - priorityOrder[a.priority]
      if (priorityDelta !== 0) return priorityDelta

      if (a.done !== b.done) return Number(a.done) - Number(b.done)
      return new Date(b.createdAt) - new Date(a.createdAt)
    })
  }, [filter, search, sortBy, tasks])

  const handleSubmit = (event) => {
    event.preventDefault()

    const cleanText = taskText.trim()
    if (!cleanText) return

    const payload = {
      text: cleanText,
      priority,
      category: category.trim() || 'General',
      dueDate,
      createdAt: new Date().toISOString(),
    }

    if (editingId !== null) {
      setTasks((currentTasks) =>
        currentTasks.map((task) =>
          task.id === editingId
            ? { ...task, ...payload }
            : task,
        ),
      )
      setEditingId(null)
    } else {
      setTasks((currentTasks) => [{ id: Date.now(), done: false, ...payload }, ...currentTasks])
    }

    setTaskText('')
    setPriority('medium')
    setCategory('General')
    setDueDate('')
  }

  const handleEdit = (task) => {
    setEditingId(task.id)
    setTaskText(task.text)
    setPriority(task.priority)
    setCategory(task.category)
    setDueDate(task.dueDate || '')
  }

  const toggleTask = (id) => {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === id ? { ...task, done: !task.done } : task,
      ),
    )
  }

  const deleteTask = (id) => {
    setTasks((currentTasks) => currentTasks.filter((task) => task.id !== id))
    if (editingId === id) {
      setEditingId(null)
      setTaskText('')
      setPriority('medium')
      setCategory('General')
      setDueDate('')
    }
  }

  const clearCompleted = () => {
    setTasks((currentTasks) => currentTasks.filter((task) => !task.done))
    if (editingId !== null) {
      setEditingId(null)
      setTaskText('')
      setPriority('medium')
      setCategory('General')
      setDueDate('')
    }
  }

  return (
    <div className="app-shell">
      <div className="todo-shell">
        <aside className="todo-sidebar">
          <div className="brand-block">
            <span className="brand-badge">✓</span>
            <div>
              <p className="eyebrow">Productivity</p>
              <h1>TaskFlow</h1>
            </div>
          </div>

          <div className="stats-grid">
            <div className="stat-card accent">
              <span>Total</span>
              <strong>{stats.total}</strong>
            </div>
            <div className="stat-card">
              <span>Done</span>
              <strong>{stats.completed}</strong>
            </div>
            <div className="stat-card">
              <span>Pending</span>
              <strong>{stats.pending}</strong>
            </div>
          </div>

          <div className="progress-block">
            <div className="progress-header">
              <span>Progress</span>
              <strong>{stats.progress}%</strong>
            </div>
            <div className="progress-bar">
              <span style={{ width: `${stats.progress}%` }} />
            </div>
          </div>

          <div className="filter-panel">
            <p className="panel-title">View</p>
            <div className="filter-stack">
              {['all', 'active', 'completed', 'high'].map((item) => (
                <button
                  key={item}
                  type="button"
                  className={filter === item ? 'filter-btn active' : 'filter-btn'}
                  onClick={() => setFilter(item)}
                >
                  {item === 'all' && 'All tasks'}
                  {item === 'active' && 'In progress'}
                  {item === 'completed' && 'Completed'}
                  {item === 'high' && 'High priority'}
                </button>
              ))}
            </div>
          </div>
        </aside>

        <main className="todo-main">
          <header className="todo-header">
            <div>
              <p className="eyebrow">Today</p>
              <h2>My tasks</h2>
            </div>

            <label className="search-box">
              <span>Search</span>
              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search tasks"
              />
            </label>
          </header>

          <form className="task-form" onSubmit={handleSubmit}>
            <div className="task-input-row">
              <input
                type="text"
                value={taskText}
                onChange={(event) => setTaskText(event.target.value)}
                placeholder="Add a new task..."
                aria-label="Task title"
              />

              <button type="submit" className="primary-btn">
                {editingId !== null ? 'Update task' : 'Add task'}
              </button>
            </div>

            <div className="task-meta-row">
              <label>
                <span>Priority</span>
                <select value={priority} onChange={(event) => setPriority(event.target.value)}>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </label>

              <label>
                <span>Category</span>
                <input
                  type="text"
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                  placeholder="General"
                />
              </label>

              <label>
                <span>Due date</span>
                <input type="date" value={dueDate} onChange={(event) => setDueDate(event.target.value)} />
              </label>
            </div>
          </form>

          <div className="toolbar">
            <div className="sort-box">
              <span>Sort by</span>
              <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
                <option value="priority">Priority</option>
                <option value="date">Due date</option>
              </select>
            </div>

            <button type="button" className="secondary-btn" onClick={clearCompleted}>
              Clear completed
            </button>
          </div>

          <section className="task-list-wrapper">
            {visibleTasks.length === 0 ? (
              <div className="empty-state">
                <span className="empty-icon">✦</span>
                <h3>No matching tasks</h3>
                <p>Adjust your filter or create a new task to get started.</p>
              </div>
            ) : (
              <ul className="task-list">
                {visibleTasks.map((task) => {
                  const dueInfo = getDueBadge(task)

                  return (
                    <li key={task.id} className={task.done ? 'task-item done' : 'task-item'}>
                      <button
                        type="button"
                        className={task.done ? 'check-button checked' : 'check-button'}
                        onClick={() => toggleTask(task.id)}
                        aria-label={task.done ? 'Mark as incomplete' : 'Mark as complete'}
                      >
                        {task.done ? '✓' : ''}
                      </button>

                      <div className="task-main">
                        <div className="task-line">
                          <span className={task.done ? 'task-text completed' : 'task-text'}>{task.text}</span>
                          <span className={`priority-pill ${task.priority}`}>{task.priority}</span>
                        </div>

                        <div className="task-meta">
                          <span className="category-pill">{task.category}</span>
                          <span className={`due-pill ${dueInfo.tone}`}>{dueInfo.label}</span>
                          <span className="date-pill">{formatShortDate(task.dueDate)}</span>
                        </div>
                      </div>

                      <div className="task-actions">
                        <button type="button" className="mini-btn edit" onClick={() => handleEdit(task)}>
                          Edit
                        </button>
                        <button type="button" className="mini-btn delete" onClick={() => deleteTask(task.id)}>
                          Delete
                        </button>
                      </div>
                    </li>
                  )
                })}
              </ul>
            )}
          </section>
        </main>
      </div>
    </div>
  )
}

export default Todo
