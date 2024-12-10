import { mutation } from "../../_generated/server";
import { v } from "convex/values";

export default mutation({
  args: { _id: v.id("tasks") },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args._id);
  },
});
