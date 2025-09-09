import AuthForm from "@/components/AuthForm";

export default function AuthPage() {
  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4">Login / Sign up</h2>
      <AuthForm />
    </div>
  );
}