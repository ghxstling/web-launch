import { ITaskForm } from "@/lib/types";
import { api } from "../_generated/api";
import { Id } from "../_generated/dataModel";
import { ConvexReactClient } from "convex/react";

export function useTasksService(convex: ConvexReactClient) {
  const addTask = async (data: ITaskForm) => {
    return await convex.mutation(api.functions.tasks.addTask.default, {
      ...data,
    });
  };

  const getTaskById = async (id: Id<"tasks">) => {
    return await convex.query(api.functions.tasks.getTaskById.default, {
      _id: id,
    });
  };

  const getAllTasks = async () => {
    return await convex.query(api.functions.tasks.getAllTasks.default);
  };

  const getTasksAssignedToUser = async (assignedBy: Id<"tasks">) => {
    return await convex.query(api.functions.tasks.getTaskById.default, {
      _id: assignedBy,
    });
  };

  const getTasksAssignedByUser = async (assignedBy: Id<"tasks">) => {
    return await convex.query(api.functions.tasks.getTaskById.default, {
      _id: assignedBy,
    });
  };

  const updateTask = async (id: Id<"tasks">, data: ITaskForm) => {
    return await convex.mutation(api.functions.tasks.updateTask.default, {
      _id: id,
      ...data,
    });
  };

  const deleteTask = async (id: Id<"tasks">) => {
    return await convex.mutation(api.functions.tasks.deleteTask.default, {
      _id: id,
    });
  };

  return {
    addTask,
    getTaskById,
    getAllTasks,
    getTasksAssignedToUser,
    getTasksAssignedByUser,
    updateTask,
    deleteTask,
  };
}
