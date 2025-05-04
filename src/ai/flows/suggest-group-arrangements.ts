// use server'

/**
 * @fileOverview Suggests optimal group arrangements based on the number of family members and the place of visit.
 *
 * - suggestGroupArrangements - A function that handles the group arrangement suggestion process.
 * - SuggestGroupArrangementsInput - The input type for the suggestGroupArrangements function.
 * - SuggestGroupArrangementsOutput - The return type for the suggestGroupArrangements function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const SuggestGroupArrangementsInputSchema = z.object({
  numberOfPeople: z.number().describe('The number of people in the group.'),
  placeOfVisit: z.string().describe('The place of visit.'),
});
export type SuggestGroupArrangementsInput = z.infer<typeof SuggestGroupArrangementsInputSchema>;

const SuggestGroupArrangementsOutputSchema = z.object({
  groupArrangementSuggestion: z.string().describe('The suggested group arrangement.'),
});
export type SuggestGroupArrangementsOutput = z.infer<typeof SuggestGroupArrangementsOutputSchema>;

export async function suggestGroupArrangements(
  input: SuggestGroupArrangementsInput
): Promise<SuggestGroupArrangementsOutput> {
  return suggestGroupArrangementsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestGroupArrangementsPrompt',
  input: {
    schema: z.object({
      numberOfPeople: z.number().describe('The number of people in the group.'),
      placeOfVisit: z.string().describe('The place of visit.'),
    }),
  },
  output: {
    schema: z.object({
      groupArrangementSuggestion: z.string().describe('The suggested group arrangement.'),
    }),
  },
  prompt: `You are an expert travel planner specializing in suggesting optimal group arrangements for various places of visit.

  Based on the number of people and the place of visit, suggest the most efficient and enjoyable group arrangement.

  Number of People: {{{numberOfPeople}}}
  Place of Visit: {{{placeOfVisit}}}
  
  Suggestion:`,
});

const suggestGroupArrangementsFlow = ai.defineFlow<
  typeof SuggestGroupArrangementsInputSchema,
  typeof SuggestGroupArrangementsOutputSchema
>(
  {
    name: 'suggestGroupArrangementsFlow',
    inputSchema: SuggestGroupArrangementsInputSchema,
    outputSchema: SuggestGroupArrangementsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
