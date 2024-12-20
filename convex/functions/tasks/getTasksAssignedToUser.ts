import { query } from "../../_generated/server";
import { v } from "convex/values";

export default query({
  args: {
    assignedTo: v.id("users"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("tasks")
      .filter((q) => q.eq(q.field("assignedTo"), args.assignedTo))
      .collect();
  },
});
