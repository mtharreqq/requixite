import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const CreateTodoSchema = z.object({
  title: z.string().min(1, "title is required"),
  done: z.boolean().optional(),
});

export const UpdateTodoSchema = z
  .object({
    title: z.string().min(1).optional(),
    done: z.boolean().optional(),
  })
  .refine(
    (v) => typeof v.title !== "undefined" || typeof v.done !== "undefined",
    {
      message: "Provide at least one of: title or done",
    },
  );
