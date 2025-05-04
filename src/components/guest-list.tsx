"use client";

import * as React from 'react';
import { Button } from "@/components/ui/button";
import { getGuests, deleteGuest } from "@/app/actions";
import type { Guest } from '@/app/actions';
import { useToast } from "@/hooks/use-toast";
import { Loader2, Trash2, Users, MapPin, IndianRupee, Phone } from 'lucide-react';
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function GuestList() {
  const [guests, setGuests] = React.useState<Guest[]>([]);
  const [loading, setLoading] = React.useState(true);
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
    // Set up an interval to refresh the list periodically
    const intervalId = setInterval(fetchGuests, 30000);
    return () => clearInterval(intervalId);
  }, [fetchGuests]);

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
    return <div className="flex justify-center items-center h-20"><Loader2 className="h-8 w-8 animate-spin text-[#886F68]" /></div>;
  }

  if (guests.length === 0) {
    return <p className="text-center text-muted-foreground mt-4">No families added yet. Use the form to add the first one!</p>;
  }

  return (
    <div className="w-full overflow-auto">
      <Table className="border-collapse">
        <TableHeader className="bg-[#D1CCDC]">
          <TableRow>
            <TableHead className="text-[#3D2C2E] font-bold">Family Name</TableHead>
            <TableHead className="text-[#3D2C2E] font-bold">Members</TableHead>
            <TableHead className="text-[#3D2C2E] font-bold">Visit</TableHead>
            <TableHead className="text-[#3D2C2E] font-bold">Aaher</TableHead>
            <TableHead className="text-[#3D2C2E] font-bold">Phone</TableHead>
            <TableHead className="text-right text-[#3D2C2E] font-bold">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {guests.map((guest) => {
            const guestIdStr = guest._id!.toString();
            return (
              <TableRow 
                key={guestIdStr} 
                className="border-b border-[#886F68]/20 hover:bg-[#F5EDF0]/80"
              >
                <TableCell className="font-medium text-[#3D2C2E]">{guest.familyName}</TableCell>
                <TableCell className="text-[#424C55]">{guest.numberOfMembers}</TableCell>
                <TableCell className="text-[#424C55]">{guest.placeOfVisit}</TableCell>
                <TableCell className="text-[#424C55]">₹{guest.aaherAmount.toLocaleString('en-IN')}</TableCell>
                <TableCell className="text-[#424C55]">{guest.phoneNumber || "-"}</TableCell>
                <TableCell className="text-right">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-[#3D2C2E] hover:bg-[#886F68]/20"
                        disabled={deletingGuestId === guestIdStr}
                      >
                        {deletingGuestId === guestIdStr ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4 text-[#886F68]" />
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
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
