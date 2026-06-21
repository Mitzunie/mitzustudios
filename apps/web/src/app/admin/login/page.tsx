import { Suspense } from 'react'
import { LoginForm } from './login-form'

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="bg-background flex min-h-screen items-center justify-center"><div className="neo-border border-primary h-8 w-8 animate-spin border-4 border-t-transparent bg-transparent" /></div>}>
      <LoginForm />
    </Suspense>
  )
}
