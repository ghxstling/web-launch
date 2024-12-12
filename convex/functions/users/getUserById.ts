import { query } from "../../_generated/server";
import { v } from "convex/values";

export default query({
  args: { _id: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("_id"), args._id))
      .first();
  },
});
