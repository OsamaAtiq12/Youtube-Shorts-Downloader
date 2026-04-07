import { z } from "zod";

const youtubeUrlRegex =
  /^(https?:\/\/)?(www\.)?(youtube\.com\/(shorts\/|watch\?v=)|youtu\.be\/)[\w-]{6,}/i;

export const extractSchema = z.object({
  url: z
    .string()
    .min(1, "YouTube URL is required")
    .regex(youtubeUrlRegex, "Enter a valid YouTube Shorts/Video URL"),
});

export type ExtractFormValues = z.infer<typeof extractSchema>;
