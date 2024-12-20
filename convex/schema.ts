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
    email: v.string(),
    password: v.string(),
    confirm: v.optional(v.string()),
    type: v.string(),
    code: v.union(v.id("classroomCodes"), v.string()),
  }).index("by_firstName", ["firstName"]),

  tasks: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    dueDate: v.string(),
    completed: v.boolean(),
    code: v.union(v.id("classroomCodes"), v.string()),
    assignedBy: v.id("users"),
  }).index("by_dueDate", ["dueDate"]),
});
