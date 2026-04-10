"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser, registerUser } from "@/services/authService";
import { roleToDashboard } from "@/services/navigationService";
import { useAppStore } from "@/store/useAppStore";
import type { UserRole } from "@/types/user";
import { Button } from "@/components/ui/Button";

export default function LoginPage() {
  const router = useRouter();
  const setSession = useAppStore((state) => state.setSession);
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("patient");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const user = isRegister
        ? await registerUser({ name, email, password, role })
        : await loginUser(email, password);

      setSession(user);
      document.cookie = `diagnosis-role=${user.role}; path=/; SameSite=Lax`;
      router.push(roleToDashboard(user.role));
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Authentication failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-medical ring-1 ring-medical-100">
        <h1 className="text-2xl font-bold text-medical-900">
          {isRegister ? "Create Account" : "Welcome Back"}
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Sign in to access your DiagnOSis dashboard.
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          {isRegister ? (
            <input
              className="w-full rounded-xl border p-3 outline-none ring-medical-200 focus:ring"
              placeholder="Full Name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
          ) : null}
          <input
            type="email"
            className="w-full rounded-xl border p-3 outline-none ring-medical-200 focus:ring"
            placeholder="Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
          <input
            type="password"
            className="w-full rounded-xl border p-3 outline-none ring-medical-200 focus:ring"
            placeholder="Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />

          {isRegister ? (
            <select
              className="w-full rounded-xl border p-3 outline-none ring-medical-200 focus:ring"
              value={role}
              onChange={(event) => setRole(event.target.value as UserRole)}
            >
              <option value="patient">Patient</option>
              <option value="doctor">Doctor</option>
              <option value="hospital">Hospital</option>
            </select>
          ) : null}

          {error ? (
            <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>
          ) : null}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Please wait..." : isRegister ? "Create Account" : "Login"}
          </Button>
          <Button
            type="button"
            variant="secondary"
            className="w-full"
            onClick={() => setIsRegister((current) => !current)}
          >
            {isRegister ? "Already have an account? Login" : "Need an account? Register"}
          </Button>
        </form>
      </div>
    </main>
  );
}
