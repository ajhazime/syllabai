import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import Settings from '../components/Settings'
import CourseCard from '../components/CourseCard'
import UploadZone from '../components/UploadZone'
import CourseModal from '../components/CourseModal'
import Timeline from '../components/Timeline'
import './Dashboard.css'

const PARTICLE_COUNT = 120
const CONNECTION_DISTANCE = 120
const MOUSE_REPEL_DISTANCE = 100
const SPEED = 0.4
const COLORS = ['#378ADD', '#1D9E75', '#7F77DD', '#D85A30', '#BA7517']

function randomBetween(a, b) { return a + Math.random() * (b - a) }

function makeParticles() {
  return Array.from({ length: PARTICLE_COUNT }, () => ({
    x: randomBetween(0, window.innerWidth),
    y: randomBetween(0, window.innerHeight),
    vx: randomBetween(-SPEED, SPEED),
    vy: randomBetween(-SPEED, SPEED),
    radius: randomBetween(1.5, 3),
  }))
}

const MOCK_COURSES = [
  {
    id: 1, color: '#378ADD', courseName: 'Data Structures', courseCode: 'CS 270',
    instructor: 'Prof. Martinez', instructorEmail: 'martinez@usc.edu',
    officeHours: ['Mon/Wed 2–4pm · KAP 156'],
    upcomingAssignments: [
      { name: 'Midterm', due: 'Oct 15', type: 'exam' },
      { name: 'HW3', due: 'Oct 8', type: 'hw' },
    ],
  },
  {
    id: 2, color: '#1D9E75', courseName: 'Linear Algebra', courseCode: 'MATH 225',
    instructor: 'Prof. Chen', instructorEmail: 'chen@usc.edu',
    officeHours: ['Tue/Thu 10–11:30am'],
    upcomingAssignments: [
      { name: 'Quiz', due: 'Oct 10', type: 'quiz' },
      { name: 'HW2', due: 'Oct 9', type: 'hw' },
    ],
  },
  {
    id: 3, color: '#7F77DD', courseName: 'Intro to Psychology', courseCode: 'PSYC 100',
    instructor: 'Prof. Williams', instructorEmail: 'williams@usc.edu',
    officeHours: ['Mon/Wed/Fri 9–10am'],
    upcomingAssignments: [
      { name: 'Final', due: 'Dec 12', type: 'exam' },
      { name: 'Essay', due: 'Nov 1', type: 'hw' },
    ],
  },
]

const NAV_TITLES = {
  courses: 'My Courses',
  timeline: 'Timeline',
  settings: 'Settings',
}

export default function Dashboard() {
    const [courses, setCourses] = useState(MOCK_COURSES)
    const [activeNav, setActiveNav] = useState('courses')
    const [selectedCourse, setSelectedCourse] = useState(null)
    const { theme } = useTheme()
    const themeRef = useRef(theme)
        useEffect(() => { themeRef.current = theme }, [theme])
    const canvasRef = useRef(null)    
    const mouseRef = useRef({ x: -999, y: -999 })
    const particlesRef = useRef([])
    const frameRef = useRef(null)
    const navigate = useNavigate()

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      particlesRef.current = makeParticles()
    }
    resize()
    window.addEventListener('resize', resize)

    const handleMouseMove = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }
    window.addEventListener('mousemove', handleMouseMove)

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const particles = particlesRef.current
      const mouse = mouseRef.current

      particles.forEach(p => {
        const dx = mouse.x - p.x
        const dy = mouse.y - p.y
        const dist = Math.sqrt(dx * dx + dy * dy)

        if (dist < MOUSE_REPEL_DISTANCE && dist > 0) {
          const force = (MOUSE_REPEL_DISTANCE - dist) / MOUSE_REPEL_DISTANCE
          p.vx -= (dx / dist) * force * 0.6
          p.vy -= (dy / dist) * force * 0.6
          p.vx *= 0.95
          p.vy *= 0.95
        } else {
          const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy)
          if (speed < SPEED) {
            p.vx += (Math.random() - 0.5) * 0.05
            p.vy += (Math.random() - 0.5) * 0.05
          }
          if (speed > SPEED * 1.5) {
            p.vx *= 0.98
            p.vy *= 0.98
          }
        }

        p.x += p.vx
        p.y += p.vy
        if (p.x < 0) { p.x = 0; p.vx *= -1 }
        if (p.x > canvas.width) { p.x = canvas.width; p.vx *= -1 }
        if (p.y < 0) { p.y = 0; p.vy *= -1 }
        if (p.y > canvas.height) { p.y = canvas.height; p.vy *= -1 }
      })

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < CONNECTION_DISTANCE) {
            const opacity = (1 - dist / CONNECTION_DISTANCE) * 0.3
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = themeRef.current.lineColor.replace('0.3', String(opacity))
            ctx.lineWidth = 0.8
            ctx.stroke()
          }
        }
      }

      particles.forEach(p => {
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = themeRef.current.particleColor
        ctx.fill() 
      })

      frameRef.current = requestAnimationFrame(draw)
    }

    frameRef.current = requestAnimationFrame(draw)

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(frameRef.current)
    }
  }, [])

  const handleFile = (file) => {
    const tempId = Date.now()
    const color = COLORS[courses.length % COLORS.length]

    setCourses(prev => [...prev, { id: tempId, loading: true, color }])

    setTimeout(() => {
      const mockExtracted = {
        id: tempId,
        loading: false,
        color,
        courseName: 'New Course',
        courseCode: 'COURSE 101',
        instructor: 'Prof. Example',
        instructorEmail: 'prof@university.edu',
        officeHours: ['Tue/Thu 3–5pm'],
        upcomingAssignments: [
          { name: 'HW1', due: 'Oct 20', type: 'hw' },
          { name: 'Midterm', due: 'Nov 5', type: 'exam' },
        ],
      }
      setCourses(prev => prev.map(c => c.id === tempId ? mockExtracted : c))
    }, 2500)
  }

  return (
    <div className="dashboard" style={{ background: theme.gradient }}>
      <canvas ref={canvasRef} className="dashboard-canvas" />

      <div className="sidebar">
        <div className="sidebar-logo">
          <div className="logo-mark-sm">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#c8a800" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
            </svg>
          </div>
          <span>SyllabAI</span>
        </div>

        <nav className="sidebar-nav">
          {[
            { id: 'courses',  label: 'Courses',  icon: '▦' },
            { id: 'timeline', label: 'Timeline', icon: '📅' },
            { id: 'settings', label: 'Settings', icon: '⚙' },
          ].map(item => (
            <button
              key={item.id}
              className={`nav-item ${activeNav === item.id ? 'active' : ''}`}
              onClick={() => setActiveNav(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="user-pill">
            <div className="avatar">AJ</div>
            <div>
              <div className="user-name">AJ Hazime</div>
              <div className="user-email">aj@uni.edu</div>
            </div>
          </div>
        </div>
      </div>

      <div className="main-content">
        <div className="topbar">
          <h1>{NAV_TITLES[activeNav]}</h1>
        </div>

        <div className="content-area">
          {activeNav === 'courses' && (
            <>
              <div className="section-label">
                Fall 2025 — {courses.length} course{courses.length !== 1 ? 's' : ''}
              </div>
              <div className="cards-grid">
                {courses.map(course => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    onClick={() => !course.loading && setSelectedCourse(course)}
                  />
                ))}
                <UploadZone onFile={handleFile} />
              </div>
            </>
          )}

          {activeNav === 'timeline' && (
            <Timeline courses={courses} />
            )}
          {activeNav === 'settings' && (
            <Settings />
            )}
        </div>
      </div>

      <CourseModal
        course={selectedCourse}
        onClose={() => setSelectedCourse(null)}
      />
    </div>
  )
}