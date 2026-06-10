import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { auth } from '../firebase'
import { onAuthStateChanged } from 'firebase/auth'

export default function ProtectedRoute({ children }) {
  const [user, setUser] = useState(undefined)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, setUser)
    return unsub
  }, [])

  if (user === undefined) return null  // still loading
  if (!user) return <Navigate to="/" />
  return children
}