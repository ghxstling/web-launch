import { mutation } from "../../_generated/server";
import { v } from "convex/values";

export default mutation({
  args: { email: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.email);
  },
});
