import { query } from "../../_generated/server";
import { v } from "convex/values";

export default query({
  args: {
    code: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("tasks")
      .filter((q) => q.eq(q.field("code"), args.code))
      .collect();
  },
});
