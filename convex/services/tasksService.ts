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

  const getTasksByClassroomCode = async (code: string) => {
    return await convex.query(
      api.functions.tasks.getTasksByClassroomCode.default,
      { code },
    );
  };

  const getTasksAssignedByUser = async (assignedBy: Id<"users">) => {
    return await convex.query(
      api.functions.tasks.getTasksAssignedByUser.default,
      { assignedBy },
    );
  };

  const updateTask = async (id: Id<"tasks">, data: ITaskForm) => {
    return await convex.mutation(api.functions.tasks.updateTask.default, {
      _id: id,
      ...data,
    });
  };

  const assignTaskToUser = async (
    id: Id<"tasks">,
    assignedTo: Id<"users">,
  ) => {};

  const deleteTask = async (id: Id<"tasks">) => {
    return await convex.mutation(api.functions.tasks.deleteTask.default, {
      _id: id,
    });
  };

  return {
    addTask,
    getTaskById,
    getAllTasks,
    getTasksAssignedByUser,
    getTasksByClassroomCode,
    updateTask,
    deleteTask,
  };
}
