import { mutation } from "../../_generated/server";
import { v } from "convex/values";

export default mutation({
  args: {
    firstName: v.string(),
    lastName: v.string(),
    email: v.string(),
    password: v.string(),
    confirm: v.optional(v.string()),
    type: v.string(),
    code: v.optional(v.union(v.id("classroomCodes"), v.string())),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("users", args);
  },
});
