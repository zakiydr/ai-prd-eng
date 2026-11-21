import { Pipeline } from "@anvia/core/pipeline";
import z from "zod";
import { askAiJson } from "./shared";

const inputSchema = z.object({
  request: z.string(),
});

const ticketingPipeline = new Pipeline({
  id: "ticketing-pipeline",
  inputSchema,
}).step({
  id: "intention-extraction",
  run: async ({ input }) => {
    const intention = await askAiJson(`User prompt: ${input.request} `,
      z.object({
        intent: z.enum(["consultation", "complaint"]),
      }),
    );
    return intention.output;
  },
}).step({
  id: "routing",
  run: ({ input }) => {
    console.log(input);
  },
})

const message = "The bathroom is not clean, are you really cleaning the room before?"

const result = await ticketingPipeline.run({ input: {request: message} });

console.log(result.output);
