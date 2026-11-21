import { Pipeline } from "@anvia/core/pipeline";
import z from "zod";
import { askAiJson, model } from "./shared";

const purchasingDetailsSchema = z.object({
  name: z.string().describe("Name of person in contact"),
  email: z.string().describe("Email of person in contact"),
  company: z.string().describe("Company name, fill with `-` if individual purchase"),
  product_model: z.string().describe("Product model name"),
  total_product: z.string().describe("Total of product purchase"),
});

const incomingEmail = z.object({ request: z.string() });

const purchaseFormatter = new Pipeline({
  id: "purchase-formatter",
  inputSchema: incomingEmail,
})
  .extract({
    id: "extract",
    model,
    outputSchema: purchasingDetailsSchema,
    instructions: "Extract the key information from the incoming email. If missing, fill with 'NONE' instead",
    text: ({ input }) => {
      return JSON.stringify(input.request)
    },
  })
  .step({
    id: "reply",
    run: async ({ input }) => {
      console.log(input)
      return await askAiJson(`MATCH THE LANGUAGE. Generate a reply to the incoming email by thanking and acknowledging. If any information is missing or is filled with "NONE", reply with the clarification request to complete missing information: ${JSON.stringify(input)}`, z.string())
    },
  });

const message = `Subjek: Permintaan Pembelian Unit Lenovo ThinkPad T14 Gen 5

Yth. Tim Penjualan,

Perkenalkan, saya Rina Pratama, staf pengadaan dari PT Nusantara Digital Solusi.
Kami berencana membeli laptop Lenovo ThinkPad T14 Gen 5 untuk kebutuhan operasional kantor.

Mohon kirimkan penawaran harga, informasi ketersediaan stok, estimasi pengiriman,
serta ketentuan pembayaran ke alamat email saya di rina.pratama@example.com.

Terima kasih atas bantuan Anda.

Hormat saya,
Rina Pratama
Staf Pengadaan
PT Nusantara Digital Solusi
Email: rina.pratama@example.com
`;

const result = await purchaseFormatter.run({ input: {request: message} });

console.log(result.output);
