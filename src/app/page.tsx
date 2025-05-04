import { GuestForm } from "@/components/guest-form";
import { GuestList } from "@/components/guest-list";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Home() {
  return (
    <main className="container mx-auto p-4 md:p-8 min-h-screen flex flex-col items-center bg-[#F5EDF0]">
      <header className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-[#3D2C2E] mb-2">Wedding Database</h1>
      </header>

      <div className="w-full max-w-4xl space-y-8">
        {/* Form Card */}
        <Card className="shadow-lg rounded-lg border-[#886F68] bg-[#F5EDF0]">
          <CardHeader className="bg-[#D1CCDC]">
            <CardTitle className="text-2xl font-semibold text-[#3D2C2E]">Add New Family</CardTitle>
            <CardDescription className="text-[#424C55]">Enter the details for the guest family.</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <GuestForm />
          </CardContent>
        </Card>

        {/* Guest List Card */}
        <Card className="shadow-lg rounded-lg border-[#886F68] bg-[#F5EDF0]">
          <CardHeader className="bg-[#D1CCDC]">
            <CardTitle className="text-2xl font-semibold text-[#3D2C2E]">Invitation List</CardTitle>
            <CardDescription className="text-[#424C55]">View all added families and their details.</CardDescription>
          </CardHeader>
          <CardContent className="p-0 overflow-hidden">
            <div className="p-4">
              <GuestList />
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

// Disable SSR for this page to ensure client-side interaction with MongoDB and AI
export const dynamic = 'force-dynamic';
