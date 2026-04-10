import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function PatientDashboardPage() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl px-4 py-8 md:px-6">
      <DashboardHeader
        title="Patient Dashboard"
        subtitle="Monitor your care journey, reminders, and emergency tools."
      />

      <div className="grid gap-5 md:grid-cols-2">
        <Card title="Digital Twin Card" subtitle="Smart profile representation">
          <p className="text-slate-600">Digital twin module placeholder for upcoming phases.</p>
        </Card>

        <Card title="Medicine Reminder Card" subtitle="No active reminders">
          <p className="text-slate-500">You do not have any medicine reminders right now.</p>
        </Card>

        <Card title="AI Chat Assistant" subtitle="Conversational care guidance">
          <Button className="w-full md:w-auto">Start AI Chat</Button>
        </Card>

        <Card title="Emergency Support" subtitle="One-tap emergency trigger">
          <form action="/api/future/emergency" method="post">
            <Button variant="danger" className="w-full md:w-auto">
              Emergency Button
            </Button>
          </form>
        </Card>
      </div>
    </main>
  );
}
