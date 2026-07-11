import Link from "next/link";
import InputField from "@/components/InputField";

export default function SignupPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6 bg-black">
      <div className="w-full max-w-sm bg-neutral-900 rounded-2xl border border-neutral-800 p-8">
        <h1 className="text-2xl font-bold mb-1 text-white">Create your account</h1>
        <p className="text-sm text-neutral-400 mb-6">
          Start tracking your expenses in minutes.
        </p>

        <form className="flex flex-col gap-4">
          <InputField label="Name" id="name" type="text" placeholder="Your name" />
          <InputField
            label="Email"
            id="email"
            type="email"
            placeholder="you@example.com"
          />
          <InputField
            label="Password"
            id="password"
            type="password"
            placeholder="••••••••"
          />

          <button
            type="submit"
            className="mt-2 w-full rounded-lg bg-emerald-500 py-2.5 text-sm font-semibold text-black transition hover:bg-emerald-400"
          >
            Sign Up
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-neutral-400">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-emerald-400 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </main>
  );
}
