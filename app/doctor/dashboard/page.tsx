import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

const mockPatients = [
  { id: "P-1021", name: "Aarav Sharma", status: "Stable" },
  { id: "P-1048", name: "Neha Gupta", status: "Review Needed" },
  { id: "P-1063", name: "Ravi Singh", status: "Follow-up" }
];

export default function DoctorDashboardPage() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl px-4 py-8 md:px-6">
      <DashboardHeader
        title="Doctor Dashboard"
        subtitle="Access your patient overview and clinical productivity tools."
      />

      <div className="grid gap-5 md:grid-cols-2">
        <Card title="Patient List" subtitle="Current active patients">
          <ul className="space-y-2">
            {mockPatients.map((patient) => (
              <li
                key={patient.id}
                className="flex items-center justify-between rounded-lg bg-medical-50 px-3 py-2 text-sm"
              >
                <span>{patient.name}</span>
                <span className="text-medical-700">{patient.status}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card title="AI Diagnosis Panel" subtitle="Clinical copilot module">
          <p className="text-slate-600">
            AI diagnosis suggestions will be enabled in future phases.
          </p>
        </Card>

        <Card title="Telemedicine" subtitle="Launch a virtual session">
          <Button className="w-full md:w-auto">Start Telemedicine</Button>
        </Card>
      </div>
    </main>
  );
}
