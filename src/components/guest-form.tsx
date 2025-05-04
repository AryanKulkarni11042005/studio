"use client";

import * as React from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { addGuest } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  familyName: z.string().min(2, {
    message: "Family name must be at least 2 characters.",
  }),
  numberOfMembers: z.coerce.number().min(1, {
    message: "Number of members must be at least 1.",
  }),
  placeOfVisit: z.string().min(2, {
    message: "Place of visit must be at least 2 characters.",
  }),
  aaherAmount: z.coerce.number().min(0, {
    message: "Aaher amount must be a positive number.",
  }),
  phoneNumber: z.string().optional(), // Adding optional phone number field
});

export type GuestFormValues = z.infer<typeof formSchema>;

export function GuestForm() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<GuestFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      familyName: "",
      numberOfMembers: 1,
      placeOfVisit: "",
      aaherAmount: 0,
      phoneNumber: "", // Add default value for phone number
    },
  });

  async function onSubmit(values: GuestFormValues) {
    setIsSubmitting(true);
    try {
      await addGuest(values);
      toast({
        title: "Success!",
        description: "Family added to the invitation list.",
        variant: "default",
      });
      form.reset(); // Reset form after successful submission
    } catch (error) {
      console.error("Failed to add guest:", error);
      toast({
        title: "Error",
        description: "Failed to add family. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="familyName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Family Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., The Kulkarnis" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="numberOfMembers"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Number of Members</FormLabel>
              <FormControl>
                <Input type="number" placeholder="e.g., 4" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="placeOfVisit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Place of Visit</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Wedding Venue" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="aaherAmount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Aaher Amount (₹)</FormLabel>
              <FormControl>
                <Input type="number" placeholder="e.g., 501" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="e.g., +91 9876543210" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button 
          type="submit" 
          className="w-full bg-[#886F68] hover:bg-[#3D2C2E] text-white" 
          disabled={isSubmitting}
        >
          {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          {isSubmitting ? "Adding..." : "Add Family"}
        </Button>
      </form>
    </Form>
  );
}
