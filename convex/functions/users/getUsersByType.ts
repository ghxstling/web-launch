import { query } from "../../_generated/server";
import { v } from "convex/values";

export default query({
  args: { type: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("type"), args.type))
      .collect();
  },
});
