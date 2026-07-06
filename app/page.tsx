export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
        Track your money.
        <br />
        <span className="text-emerald-500">Let AI do the thinking.</span>
      </h1>
      <p className="text-lg text-gray-500 max-w-xl mb-8">
        An expense tracker that categorizes your spending automatically and
        tells you where your money actually goes each month.
      </p>
      <div className="flex gap-4">
        <a
          href="/signup"
          className="px-6 py-3 rounded-lg bg-emerald-500 text-white font-medium hover:bg-emerald-600 transition"
        >
          Get Started
        </a>
        <a
          href="/login"
          className="px-6 py-3 rounded-lg border border-gray-300 font-medium hover:bg-gray-50 transition"
        >
          Log In
        </a>
      </div>
    </main>
  );
}
