
"use client";

import * as React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getGuests, deleteGuest, getGroupArrangementSuggestion } from "@/app/actions"; // Import the new action
import type { Guest } from '@/app/actions';
import { useToast } from "@/hooks/use-toast";
import { Loader2, Trash2, Wand2, Users, MapPin, IndianRupee } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function GuestList() {
  const [guests, setGuests] = React.useState<Guest[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [suggestions, setSuggestions] = React.useState<Record<string, string | null>>({});
  const [loadingSuggestionId, setLoadingSuggestionId] = React.useState<string | null>(null);
  const [deletingGuestId, setDeletingGuestId] = React.useState<string | null>(null);
  const { toast } = useToast();

  const fetchGuests = React.useCallback(async () => {
    setLoading(true);
    try {
      const fetchedGuests = await getGuests();
      setGuests(fetchedGuests);
    } catch (error) {
      console.error("Failed to fetch guests:", error);
      toast({
        title: "Error",
        description: "Failed to load guest list. Please refresh.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  React.useEffect(() => {
    fetchGuests();
    // Set up an interval to refresh the list periodically (e.g., every 30 seconds)
    // Adjust interval as needed, or remove if real-time updates aren't critical
    const intervalId = setInterval(fetchGuests, 30000);
    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, [fetchGuests]);


  const handleGetSuggestion = async (guest: Guest) => {
    if (!guest._id) return;
    const guestIdStr = guest._id.toString();
    setLoadingSuggestionId(guestIdStr);
    setSuggestions(prev => ({ ...prev, [guestIdStr]: null })); // Clear previous suggestion

    try {
      // Use the server action from actions.ts
      const result = await getGroupArrangementSuggestion({
        numberOfPeople: guest.numberOfMembers,
        placeOfVisit: guest.placeOfVisit,
      });
      setSuggestions(prev => ({ ...prev, [guestIdStr]: result.groupArrangementSuggestion }));
    } catch (error) {
      console.error("Failed to get suggestion:", error);
      setSuggestions(prev => ({ ...prev, [guestIdStr]: "Error fetching suggestion." }));
      toast({
        title: "Suggestion Error",
        description: "Could not get group arrangement suggestion.",
        variant: "destructive",
      });
    } finally {
      setLoadingSuggestionId(null);
    }
  };

  const handleDelete = async (guestId: string) => {
    setDeletingGuestId(guestId);
    try {
      await deleteGuest(guestId);
      setGuests(prevGuests => prevGuests.filter(g => g._id?.toString() !== guestId));
      toast({
        title: "Success",
        description: "Family removed from the list.",
        variant: "default",
      });
    } catch (error) {
      console.error("Failed to delete guest:", error);
      toast({
        title: "Error",
        description: "Failed to remove family. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDeletingGuestId(null);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-full"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  if (guests.length === 0) {
    return <p className="text-center text-muted-foreground mt-4">No families added yet. Use the form to add the first one!</p>;
  }

  return (
    <div className="space-y-4">
      {guests.map((guest) => {
         const guestIdStr = guest._id!.toString(); // Ensure guest._id is treated as string
         return (
          <Card key={guestIdStr} className="overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl flex justify-between items-center">
                {guest.familyName}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                     <Button
                       variant="ghost"
                       size="icon"
                       className="text-destructive hover:bg-destructive/10"
                       disabled={deletingGuestId === guestIdStr}
                     >
                       {deletingGuestId === guestIdStr ? (
                         <Loader2 className="h-4 w-4 animate-spin" />
                       ) : (
                         <Trash2 className="h-4 w-4" />
                       )}
                     </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the
                        entry for the {guest.familyName} family.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(guestIdStr)}
                        className="bg-destructive hover:bg-destructive/90"
                        disabled={deletingGuestId === guestIdStr}
                      >
                        {deletingGuestId === guestIdStr ? 'Deleting...' : 'Delete'}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
               <div className="flex items-center gap-2">
                 <Users className="h-4 w-4 text-primary" />
                 <span>Members: {guest.numberOfMembers}</span>
               </div>
               <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                 <span>Visit: {guest.placeOfVisit}</span>
               </div>
               <div className="flex items-center gap-2">
                 <IndianRupee className="h-4 w-4 text-primary" />
                 <span>Aaher: ₹{guest.aaherAmount.toLocaleString('en-IN')}</span>
               </div>
            </CardContent>
            <CardFooter className="flex flex-col items-start gap-2 pt-2">
               <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleGetSuggestion(guest)}
                  disabled={loadingSuggestionId === guestIdStr}
                  className="border-accent text-accent hover:bg-accent/10"
                >
                 {loadingSuggestionId === guestIdStr ? (
                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                 ) : (
                   <Wand2 className="mr-2 h-4 w-4" />
                 )}
                 {loadingSuggestionId === guestIdStr ? 'Getting Suggestion...' : 'Suggest Arrangement'}
               </Button>
               {suggestions[guestIdStr] && (
                  <div className="mt-2 p-3 bg-secondary rounded-md text-sm w-full">
                    <p><strong>Suggestion:</strong> {suggestions[guestIdStr]}</p>
                  </div>
                )}
            </CardFooter>
          </Card>
        );
       })}
    </div>
  );
}
