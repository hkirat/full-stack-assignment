import z from "zod";

export const problemSchema = z.object({
  title: z.string().min(1, "Add a title"),
  description: z.string().min(1, "Add a description"),
  level: z.enum(["easy", "medium", "hard"]),
  test_cases: z
    .array(
      z.object({
        input: z.string().min(1, "Add input for test cases"),
        output: z.string().min(1, "Add output for test cases"),
      })
    )
    .min(1, "Add test cases"),
});
