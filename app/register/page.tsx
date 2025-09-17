import { RegisterForm } from "@/components/auth/register-form"

export default function RegisterPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: "linear-gradient(135deg, #faf7ff 0%, #f3e8ff 50%, #e9d5ff 100%)" }}
    >
      <RegisterForm />
    </div>
  )
}
