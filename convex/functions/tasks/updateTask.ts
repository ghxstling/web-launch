import { mutation } from "../../_generated/server";
import { v } from "convex/values";

export default mutation({
  args: {
    _id: v.id("tasks"),
    title: v.string(),
    description: v.optional(v.string()),
    dueDate: v.string(),
    code: v.union(v.id("classroomCodes"), v.string()),
    assignedBy: v.id("users"),
    completedBy: v.array(v.id("users")),
  },
  handler: async (ctx, args) => {
    const taskId = args._id;
    return await ctx.db.replace(taskId, args);
  },
});
