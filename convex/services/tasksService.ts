/* eslint-disable @typescript-eslint/no-explicit-any */
import { Task } from "@/lib/types";
import { api } from "../_generated/api";
import { Id } from "../_generated/dataModel";
import { useConvex } from "convex/react";

export function useTasksService() {
  const convex = useConvex();

  const addTask = async (data: Task) => {
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
    return (await convex.query(api.functions.tasks.getAllTasks.default)).sort(
      (a: any, b: any) => {
        return a.dueDate < b.dueDate ? -1 : 1;
      },
    );
  };

  const getTasksByClassroomCode = async (code: string) => {
    return (
      await convex.query(api.functions.tasks.getTasksByClassroomCode.default, {
        code,
      })
    ).sort((a: any, b: any) => {
      return a.dueDate < b.dueDate ? -1 : 1;
    });
  };

  const getTasksAssignedByUser = async (assignedBy: Id<"users">) => {
    return (
      await convex.query(api.functions.tasks.getTasksAssignedByUser.default, {
        assignedBy,
      })
    ).sort((a: any, b: any) => {
      return a.dueDate < b.dueDate ? -1 : 1;
    });
  };

  const updateTask = async (_id: Id<"tasks">, data: Task) => {
    return await convex.mutation(api.functions.tasks.updateTask.default, {
      _id,
      ...data,
    });
  };

  const deleteTask = async (_id: Id<"tasks">) => {
    return await convex.mutation(api.functions.tasks.deleteTask.default, {
      _id,
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
