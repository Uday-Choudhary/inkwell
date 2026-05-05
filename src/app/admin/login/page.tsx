import { Suspense } from 'react'
import LoginForm from './LoginForm'

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--ink-bg)', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: 'var(--ink-text-muted)' }}>Loading...</div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}
