import { GuestForm } from '@/components/guest-form';
import { GuestList } from '@/components/guest-list';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function Home() {
  return (
    <main className="container mx-auto p-4 md:p-8 min-h-screen flex flex-col items-center bg-background">
      <header className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-2">GuestEase</h1>
        <p className="text-lg text-muted-foreground">Your Simple Invitation List Maker</p>
      </header>

      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="shadow-lg rounded-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">Add New Family</CardTitle>
            <CardDescription>Enter the details for the guest family.</CardDescription>
          </CardHeader>
          <CardContent>
            <GuestForm />
          </CardContent>
        </Card>

        <Card className="shadow-lg rounded-lg flex flex-col">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">Invitation List</CardTitle>
            <CardDescription>View all added families and their details.</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow overflow-hidden">
            <ScrollArea className="h-[400px] lg:h-full pr-4">
              <GuestList />
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

// Disable SSR for this page to ensure client-side interaction with MongoDB and AI
export const dynamic = 'force-dynamic';
