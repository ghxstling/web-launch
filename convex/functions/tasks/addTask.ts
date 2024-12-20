import { mutation } from "../../_generated/server";
import { v } from "convex/values";

export default mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    dueDate: v.string(),
    completed: v.boolean(),
    assignedTo: v.id("users"),
    assignedBy: v.id("users"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("tasks", args);
  },
});
