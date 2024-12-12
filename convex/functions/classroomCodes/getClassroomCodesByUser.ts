import { query } from "../../_generated/server";
import { v } from "convex/values";

export default query({
  args: { createdBy: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("classroomCodes")
      .filter((q) => q.eq(q.field("createdBy"), args.createdBy))
      .first();
  },
});
