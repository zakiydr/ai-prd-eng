import { generateCompletion, type ZodSchema } from "@anvia/core";
import { GeminiClient } from "@anvia/gemini";
import { z } from "zod";

const GEMINI_API_KEY = Bun.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY)
  throw new Error("GEMINI_API_KEY not set");

const client = new GeminiClient({
  apiKey: GEMINI_API_KEY
});

export const model = client.completionModel({
  modelId: "gemini-3.5-flash",
});


export function askAiJson(prompt: string, outputSchema: ZodSchema) {
  return generateCompletion({
    model,
    instructions: "You are a helpful assistant",
    prompt,
    outputSchema,
  });
}
