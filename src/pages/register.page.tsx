import { Link } from '@tanstack/react-router'
import { RegisterForm } from '@/components/register/register-form.component'

const RegisterPage = () => {
  return (
    <div className="flex min-h-[calc(100vh-57px)] items-center justify-center bg-brand-cream">
      <div className="w-full max-w-md rounded-xl border border-border bg-white p-8 shadow-sm">
        <h1 className="mb-1 font-playfair text-2xl font-bold text-brand-green">
          Create account
        </h1>
        <p className="mb-6 text-sm text-muted-foreground">
          Join us today
        </p>

        <RegisterForm />

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link to="/login" className="text-brand-green hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}

export default RegisterPage