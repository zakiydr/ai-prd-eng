import { Pipeline } from "@anvia/core/pipeline";
import z from "zod";
import { askAiJson } from "./shared";

const incomingMessage = z.object({
  content: z.string(),
});

const replyRules = new Pipeline({ id: "reply-rules", inputSchema: incomingMessage })
  .step({
    id: "extract",
    run: async ({ input }) => {
      const message = await askAiJson(`Clear noise, summarize contextually of ${input.content}`, z.string());
      return message.output;
    },
  })
  .step({
    id: "reply",
    run: async ({ input }) => {
      const message = await askAiJson(`Reply the message pragmatically: ${input}`, z.string());
      return message.output;
    },
  })

const result = await replyRules.run({
  input: {
    content: "Saya mengalami kendala saat mencoba mengubah tema pada ponsel [Model HP] saya. Setiap kali saya memilih dan mencoba menerapkan tema baru melalui aplikasi Tema maupun menu Pengaturan, tema tersebut gagal diterapkan dan tampilan kembali ke tema bawaan (atau muncul pesan kesalahan [Detail Pesan Error, jika ada]).\nBeberapa langkah dasar sudah saya coba, seperti me- restart perangkat, memastikan koneksi internet stabil, serta memeriksa pembaruan sistem dan aplikasi Tema, namun kendala ini masih terjadi." },
});

console.log(result);
