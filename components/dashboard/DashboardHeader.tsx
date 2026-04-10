interface DashboardHeaderProps {
  title: string;
  subtitle: string;
}

export function DashboardHeader({ title, subtitle }: DashboardHeaderProps) {
  return (
    <header className="mb-6 flex flex-col gap-2">
      <h1 className="text-2xl font-bold text-medical-900 md:text-3xl">{title}</h1>
      <p className="text-sm text-slate-600 md:text-base">{subtitle}</p>
    </header>
  );
}
