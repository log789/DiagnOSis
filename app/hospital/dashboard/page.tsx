import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Card } from "@/components/ui/Card";

const mockEmergencyRequests = [
  "Ambulance request from Sector 21",
  "Critical trauma intake from ER",
  "High priority cardiac transfer"
];

export default function HospitalDashboardPage() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl px-4 py-8 md:px-6">
      <DashboardHeader
        title="Hospital Dashboard"
        subtitle="Coordinate emergencies, capacity, and operational assistance."
      />

      <div className="grid gap-5 md:grid-cols-2">
        <Card title="Emergency Requests Panel" subtitle="Incoming requests">
          <ul className="space-y-2 text-sm">
            {mockEmergencyRequests.map((request) => (
              <li key={request} className="rounded-lg bg-rose-50 px-3 py-2 text-rose-700">
                {request}
              </li>
            ))}
          </ul>
        </Card>

        <Card title="Bed Availability Card" subtitle="Live occupancy snapshot">
          <p className="text-3xl font-bold text-medical-700">42 Beds Available</p>
          <p className="mt-2 text-sm text-slate-500">Updated every 15 minutes (mock data).</p>
        </Card>

        <Card title="Reception AI Assistant" subtitle="Front desk support">
          <input
            className="w-full rounded-xl border p-3 outline-none ring-medical-200 focus:ring"
            placeholder="Type your query for the assistant..."
          />
        </Card>
      </div>
    </main>
  );
}
