import z from "zod";

export const submissionSchema = z.object({
  problem_id: z.number().min(1),
  code: z.string().min(1),
  lang: z.enum(["cpp", "java", "javascript", "go"]),
});
