import { useState, useEffect, useRef } from 'react'
import './Login.css'

const PARTICLE_COUNT = 200
const CONNECTION_DISTANCE = 120
const MOUSE_REPEL_DISTANCE = 100
const SPEED = 0.4

function randomBetween(a, b) {
  return a + Math.random() * (b - a)
}

function makeParticles() {
  return Array.from({ length: PARTICLE_COUNT }, () => ({
    x: randomBetween(0, window.innerWidth),
    y: randomBetween(0, window.innerHeight),
    vx: randomBetween(-SPEED, SPEED),
    vy: randomBetween(-SPEED, SPEED),
    radius: randomBetween(2, 4),
  }))
}

export default function Login() {
  const [tab, setTab] = useState('signin')
  const canvasRef = useRef(null)
  const mouseRef = useRef({ x: -999, y: -999 })
  const particlesRef = useRef([])
  const frameRef = useRef(null)

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
            const opacity = (1 - dist / CONNECTION_DISTANCE) * 0.5
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`
            ctx.lineWidth = 0.8
            ctx.stroke()
          }
        }
      }

      particles.forEach(p => {
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)'
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

  return (
    <div className="login-page">
      <canvas ref={canvasRef} className="particle-canvas" />
      <div className="login-card">
        <div className="login-logo">
          <div className="logo-mark">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#c8a800" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
            </svg>
          </div>
          <h1>SyllabAI</h1>
          <p>Your semester, organized automatically</p>
        </div>

        <div className="login-tabs">
          <button className={tab === 'signin' ? 'active' : ''} onClick={() => setTab('signin')}>Sign in</button>
          <button className={tab === 'signup' ? 'active' : ''} onClick={() => setTab('signup')}>Create account</button>
        </div>

        {tab === 'signup' && (
          <div className="field">
            <label>Username</label>
            <input type="text" placeholder="yourname" />
          </div>
        )}

        <div className="field">
          <label>Email</label>
          <input type="email" placeholder="you@university.edu" />
        </div>

        <div className="field">
          <label>Password</label>
          <input type="password" placeholder="••••••••" />
        </div>

        <button className="btn-primary">
          {tab === 'signin' ? 'Sign in' : 'Create account'}
        </button>

        <div className="divider">or</div>

        <button className="btn-google">
          <svg width="16" height="16" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </button>

        <p className="footer-note">
          {tab === 'signin'
            ? <span>No account? <button onClick={() => setTab('signup')}>Create one free</button></span>
            : <span>Already have an account? <button onClick={() => setTab('signin')}>Sign in</button></span>
          }
        </p>
      </div>
    </div>
  )
}