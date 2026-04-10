import Link from "next/link";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col items-center justify-center px-6 text-center">
      <div className="rounded-3xl bg-white p-10 shadow-medical ring-1 ring-medical-100">
        <p className="text-sm font-medium uppercase tracking-widest text-medical-600">
          Healthcare Platform
        </p>
        <h1 className="mt-3 text-4xl font-bold text-medical-900">DiagnOSis</h1>
        <p className="mx-auto mt-4 max-w-2xl text-slate-600">
          A role-based digital healthcare experience for patients, doctors, and
          hospitals.
        </p>
        <Link
          href="/login"
          className="mt-8 inline-block rounded-xl bg-medical-600 px-5 py-3 font-medium text-white transition hover:bg-medical-700"
        >
          Continue to Login
        </Link>
      </div>
    </main>
  );
}
