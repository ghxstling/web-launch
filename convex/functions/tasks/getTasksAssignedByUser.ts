import { query } from "../../_generated/server";
import { v } from "convex/values";

export default query({
  args: {
    assignedBy: v.id("users"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("tasks")
      .filter((q) => q.eq(q.field("assignedBy"), args.assignedBy))
      .collect();
  },
});
