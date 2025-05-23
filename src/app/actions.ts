"use server";

import clientPromise from "@/lib/db";
import type { GuestFormValues } from "@/components/guest-form";
import type { Collection, ObjectId } from 'mongodb';
import { revalidatePath } from 'next/cache';
import { suggestGroupArrangements } from "@/ai/flows/suggest-group-arrangements";
import type { SuggestGroupArrangementsInput, SuggestGroupArrangementsOutput } from "@/ai/flows/suggest-group-arrangements";

// Update your Guest type to include phoneNumber
export type Guest = {
  _id?: any; // Typically MongoDB ObjectId
  familyName: string;
  numberOfMembers: number;
  placeOfVisit: string;
  aaherAmount: number;
  phoneNumber?: string; // Optional phone number
  createdAt?: Date; // Optional creation date
};

// Helper function to get the guests collection
async function getGuestsCollection(): Promise<Collection<Guest>> {
  const client = await clientPromise;
  const db = client.db(); // Use the default database specified in the connection string
  return db.collection<Guest>("guests");
}

// Action to add a new guest
export async function addGuest(data: GuestFormValues): Promise<void> {
  try {
    const collection = await getGuestsCollection();
    const guestData: Omit<Guest, '_id'> = {
        ...data,
        createdAt: new Date(),
        phoneNumber: data.phoneNumber, // Include phoneNumber in the document being saved
    };
    await collection.insertOne(guestData);
    revalidatePath('/'); // Revalidate the homepage to show the new guest
  } catch (error) {
    console.error("Error adding guest:", error);
    throw new Error("Failed to add guest to the database.");
  }
}

// Action to get all guests
export async function getGuests(): Promise<Guest[]> {
  try {
    const collection = await getGuestsCollection();
    // Find all guests and sort by creation date descending
    const guests = await collection.find({}).sort({ createdAt: -1 }).toArray();
     // Convert ObjectId to string for client-side usage
    return guests.map(guest => ({
        ...guest,
        _id: guest._id?.toString() as unknown as ObjectId, // Keep the type but send string
      }));
  } catch (error) {
    console.error("Error fetching guests:", error);
    throw new Error("Failed to retrieve guests from the database.");
  }
}

// Action to delete a guest
export async function deleteGuest(guestId: string): Promise<void> {
  try {
    const collection = await getGuestsCollection();
    const { ObjectId } = await import('mongodb'); // Dynamically import ObjectId
    await collection.deleteOne({ _id: new ObjectId(guestId) });
    revalidatePath('/'); // Revalidate the homepage to reflect the deletion
  } catch (error) {
    console.error("Error deleting guest:", error);
    // Provide more specific error based on the type of error if possible
     if (error instanceof Error && error.message.includes('Argument passed in must be a single String')) {
        throw new Error("Invalid guest ID format.");
    }
    throw new Error("Failed to delete guest from the database.");
  }
}

// Action to get group arrangement suggestion using Genkit flow
export async function getGroupArrangementSuggestion(
  input: SuggestGroupArrangementsInput
): Promise<SuggestGroupArrangementsOutput> {
  try {
    // The 'suggestGroupArrangements' function is already marked with 'use server'
    // implicitly via its file, but calling it from here ensures it runs server-side.
    const result = await suggestGroupArrangements(input);
    return result;
  } catch (error) {
    console.error("Error getting group arrangement suggestion:", error);
    throw new Error("Failed to get suggestion from the AI model.");
  }
}
