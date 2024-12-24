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

  const addUserToCompletedBy = async (
    _id: Id<"tasks">,
    userId: Id<"users">,
  ) => {
    const task = await getTaskById(_id);
    const completedBy = task!.completedBy;
    if (!completedBy.includes(userId)) {
      completedBy.push(userId);
    }
    return await updateTask(_id, {
      title: task!.title,
      description: task!.description || "",
      dueDate: task!.dueDate,
      code: task!.code,
      assignedBy: task!.assignedBy,
      completedBy,
    });
  };

  const removeUserFromCompletedBy = async (
    _id: Id<"tasks">,
    userId: Id<"users">,
  ) => {
    const task = await getTaskById(_id);
    const completedBy = task!.completedBy;
    const index = completedBy.findIndex((id) => id === userId);
    if (index !== -1) {
      completedBy.splice(index, 1);
    }
    return await updateTask(_id, {
      title: task!.title,
      description: task!.description || "",
      dueDate: task!.dueDate,
      code: task!.code,
      assignedBy: task!.assignedBy,
      completedBy,
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
    addUserToCompletedBy,
    removeUserFromCompletedBy,
    updateTask,
    deleteTask,
  };
}
