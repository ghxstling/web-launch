import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  classroomCodes: defineTable({
    code: v.string(),
    createdBy: v.id("users"),
  }),

  users: defineTable({
    firstName: v.string(),
    lastName: v.string(),
    email: v.id("users"),
    password: v.string(),
    type: v.string(),
    code: v.id("classroomCodes"),
  }).index("by_email", ["email"]),

  tasks: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    dueDate: v.string(),
    completed: v.boolean(),
    assignedTo: v.id("users"),
    assignedBy: v.id("users"),
  }).index("by_dueDate", ["dueDate"]),
});
