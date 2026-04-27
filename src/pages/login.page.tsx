import { LoginForm } from "@/components/login/login-form.component"
import { Link } from "@tanstack/react-router"

const LoginPage = () => {
  return (
    <div className="flex min-h-[calc(100vh-57px)] items-center justify-center bg-brand-cream">
      <div className="w-full max-w-md rounded-xl border border-border bg-white p-8 shadow-sm">
        <h1 className="mb-1 font-playfair text-2xl font-bold text-brand-green">
          Welcome back
        </h1>
        <p className="mb-6 text-sm text-muted-foreground">
          Sign in to your account
        </p>

        <LoginForm />

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Don't have an account?{' '}
          <Link to="/register" className="text-brand-green hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  )
}

export default LoginPage