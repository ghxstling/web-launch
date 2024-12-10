import { query } from "../../_generated/server";

export default query({
  handler: async (ctx) => {
    return await ctx.db.query("tasks").collect();
  },
});
