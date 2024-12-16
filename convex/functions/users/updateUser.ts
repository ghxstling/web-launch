import { mutation } from "../../_generated/server";
import { v } from "convex/values";

export default mutation({
  args: {
    _id: v.id("users"),
    firstName: v.string(),
    lastName: v.string(),
    email: v.string(),
    password: v.string(),
    confirm: v.string(),
    type: v.string(),
    code: v.optional(v.id("classroomCodes")),
  },
  handler: async (ctx, args) => {
    return await ctx.db.replace(args._id, args);
  },
});
