import { query } from "../../_generated/server";
import { v } from "convex/values";

export default query({
  args: { _id: v.id("classroomCodes") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("classroomCodes")
      .filter((q) => q.eq(q.field("_id"), args._id))
      .first();
  },
});
