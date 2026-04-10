import type { ReactNode } from "react";

interface CardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export function Card({ title, subtitle, children }: CardProps) {
  return (
    <section className="rounded-2xl bg-white p-6 shadow-medical ring-1 ring-medical-100">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-medical-900">{title}</h3>
        {subtitle ? <p className="text-sm text-slate-500">{subtitle}</p> : null}
      </div>
      {children}
    </section>
  );
}
