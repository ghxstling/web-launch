import { mutation } from "../_generated/server";

export default mutation({
  handler: async (ctx) => {
    try {
      const users = await ctx.db.query("users").collect();
      const tasks = await ctx.db.query("tasks").collect();
      const classroomCodes = await ctx.db.query("classroomCodes").collect();

      for (let i = 0; i < users.length; i++) {
        await ctx.db.delete(users[i]._id);
      }
      for (let i = 0; i < tasks.length; i++) {
        await ctx.db.delete(tasks[i]._id);
      }
      for (let i = 0; i < classroomCodes.length; i++) {
        await ctx.db.delete(classroomCodes[i]._id);
      }
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  },
});
