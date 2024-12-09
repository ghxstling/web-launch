import { z } from "zod";
import { UserType } from "./enums";

export const registerSchema = z
  .object({
    firstName: z.string().min(1, {
      message: "First name is required",
    }),
    lastName: z.string().min(1, {
      message: "Last name is required",
    }),
    email: z.string().email({
      message: "Please enter a valid email address",
    }),
    password: z.string().min(8, {
      message: "Password must be at least 8 characters",
    }),
    confirm: z.string().min(8, {
      message: "Password must be at least 8 characters",
    }),
    type: z.nativeEnum(UserType, {
      message: "Please select an account type",
    }),
    code: z
      .string()
      .length(6, {
        message: "Code must be a 6-digit alphanumeric string",
      })
      .toUpperCase(),
  })
  .required()
  .refine((data) => data.password === data.confirm, {
    message: "Passwords do not match",
    path: ["confirm"],
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
