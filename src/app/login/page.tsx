import { LoginForm } from "./_components/login-form";

export default async function LoginPage() {
  return (
    <div className="min-h-screen fixed w-full top-0 left-0 overflow-hidden flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 p-4">
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  );
}
