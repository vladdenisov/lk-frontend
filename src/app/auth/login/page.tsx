import { LoginForm } from "@/components/auth-form/auth-form.component";

export const metadata = {
  title: "Войти в аккаунт",
  description: "Вход в систему",
};

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 w-full">
      <LoginForm />
    </div>
  )
}