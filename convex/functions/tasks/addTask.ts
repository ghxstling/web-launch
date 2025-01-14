import { mutation } from "../../_generated/server";
import { v } from "convex/values";

export default mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    dueDate: v.string(),
    code: v.string(),
    assignedBy: v.id("users"),
    completedBy: v.array(v.id("users")),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("tasks", args);
  },
});
