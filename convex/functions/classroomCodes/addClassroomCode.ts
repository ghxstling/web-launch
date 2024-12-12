import { mutation } from "../../_generated/server";
import { v } from "convex/values";

export default mutation({
  args: {
    code: v.string(),
    createdBy: v.id("users"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("classroomCodes", args);
  },
});
