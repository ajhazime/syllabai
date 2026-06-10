import { useState } from 'react'
import './Timeline.css'

const FILTERS = ['All', 'Exam', 'HW', 'Quiz', 'Project']

const TYPE_LABELS = { exam: 'Exam', hw: 'HW', quiz: 'Quiz', project: 'Project' }
const TYPE_CLASS  = { exam: 'tag-exam', hw: 'tag-hw', quiz: 'tag-quiz', project: 'tag-project' }

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']

function parseDate(dateStr) {
  if (!dateStr) return null
  const d = new Date(dateStr + ' 2025')
  return isNaN(d) ? null : d
}

function groupByWeek(items) {
  const groups = {}
  items.forEach(item => {
    const d = item.parsedDate
    if (!d) return
    const weekStart = new Date(d)
    weekStart.setDate(d.getDate() - d.getDay())
    const key = weekStart.toDateString()
    if (!groups[key]) groups[key] = { weekStart, items: [] }
    groups[key].items.push(item)
  })
  return Object.values(groups).sort((a, b) => a.weekStart - b.weekStart)
}

function weekLabel(weekStart) {
  const weekEnd = new Date(weekStart)
  weekEnd.setDate(weekStart.getDate() + 6)
  const now = new Date()
  const thisWeekStart = new Date(now)
  thisWeekStart.setDate(now.getDate() - now.getDay())
  const nextWeekStart = new Date(thisWeekStart)
  nextWeekStart.setDate(thisWeekStart.getDate() + 7)

  const fmt = d => `${MONTHS[d.getMonth()].slice(0, 3)} ${d.getDate()}`
  if (weekStart.toDateString() === thisWeekStart.toDateString()) return `This week — ${fmt(weekStart)}–${weekStart.getDate() + 6}`
  if (weekStart.toDateString() === nextWeekStart.toDateString()) return `Next week — ${fmt(weekStart)}–${weekStart.getDate() + 6}`
  return `${fmt(weekStart)} – ${fmt(weekEnd)}`
}

export default function Timeline({ courses }) {
  const [filter, setFilter] = useState('All')

  const allItems = courses.flatMap(course => [
    ...(course.examDates || []).map(e => ({
      id: `${course.id}-exam-${e.name}`,
      name: e.name,
      due: e.date,
      time: e.time,
      location: e.location,
      type: 'exam',
      course: course.courseName,
      courseCode: course.courseCode,
      color: course.color,
      parsedDate: parseDate(e.date),
    })),
    ...(course.upcomingAssignments || []).map(a => ({
      id: `${course.id}-${a.type}-${a.name}`,
      name: a.name,
      due: a.due,
      type: a.type,
      course: course.courseName,
      courseCode: course.courseCode,
      color: course.color,
      parsedDate: parseDate(a.due),
    })),
  ]).sort((a, b) => (a.parsedDate || 0) - (b.parsedDate || 0))

  const filtered = filter === 'All'
    ? allItems
    : allItems.filter(i => TYPE_LABELS[i.type] === filter)

  const weeks = groupByWeek(filtered)

  return (
    <div className="timeline">

      <div className="tl-filters">
        {FILTERS.map(f => (
          <button
            key={f}
            className={`tl-filter ${filter === f ? 'active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="tl-list">
        {weeks.length === 0 && (
          <div className="tl-empty">No deadlines found</div>
        )}
        {weeks.map(({ weekStart, items }) => (
          <div key={weekStart.toDateString()}>
            <div className="tl-week-label">{weekLabel(weekStart)}</div>
            {items.map(item => (
              <div key={item.id} className="tl-item">
                <div className="tl-date">
                  <div className="tl-day">{item.parsedDate?.getDate() || '?'}</div>
                  <div className="tl-month">{item.parsedDate ? MONTHS[item.parsedDate.getMonth()].slice(0, 3) : ''}</div>
                </div>
                <div className="tl-divider" />
                <div className="tl-dot" style={{ background: item.color }} />
                <div className="tl-body">
                  <div className="tl-name">{item.name} — {item.course}</div>
                  <div className="tl-meta">
                    {item.courseCode}
                    {item.time ? ` · ${item.time}` : ' · Due 11:59pm'}
                    {item.location ? ` · ${item.location}` : ''}
                  </div>
                </div>
                <span className={`tl-badge ${TYPE_CLASS[item.type] || 'tag-hw'}`}>
                  {TYPE_LABELS[item.type] || item.type}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>

    </div>
  )
}