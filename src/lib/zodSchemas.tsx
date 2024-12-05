import { z } from "zod";
import { UserType } from "./enums";

export const registerSchema = z
  .object({
    email: z.string().email({
      message: "Please enter a valid email address",
    }),
    password: z.string().min(8, {
      message: "Password must be at least 8 characters",
    }),
    confirm: z.string(),
    type: z.nativeEnum(UserType),
    code: z.string().min(6, {
      message: "Code must be at least 6 characters",
    }),
  })
  .required()
  .refine((data) => data.password === data.confirm, {
    message: "Passwords do not match",
  });

export const loginSchema = z
  .object({
    email: z.string().email({
      message: "Invalid email address",
    }),
    password: z.string().min(1, {
      message: "Password is required",
    }),
  })
  .required();
