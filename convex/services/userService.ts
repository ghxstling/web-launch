import { User, UserType, IRegisterForm } from "@/lib/types";
import { api } from "../_generated/api";
import { Id } from "../_generated/dataModel";
import { useConvex } from "convex/react";

export function useUserService() {
  const convex = useConvex();

  const getUserByEmail = async (email: string) => {
    return await convex.query(api.functions.users.getUserByEmail.default, {
      email,
    });
  };

  const getUsersByType = async (type: UserType) => {
    return await convex.query(api.functions.users.getUsersByType.default, {
      type,
    });
  };

  const getUserById = async (id: Id<"users">) => {
    return await convex.query(api.functions.users.getUserById.default, {
      _id: id,
    });
  };

  const getAllUsers = async () => {
    return await convex.query(api.functions.users.getAllUsers.default);
  };

  const getUsersByClassroomCode = async (code: string) => {
    return (await convex.query(api.functions.users.getAllUsers.default)).filter(
      (user) => user.code === code,
    );
  };

  const createUser = async (data: User | IRegisterForm) => {
    const checkUser = await getUserByEmail(data.email);
    if (!checkUser) {
      return await convex.mutation(api.functions.users.addUser.default, {
        ...data,
        completedTasks: [],
      });
    }
  };

  const updateUser = async (id: Id<"users">, data: User) => {
    const user = await getUserById(id);
    const userCompletedTasks = user!.completedTasks;
    data.completedTasks.forEach((task) => {
      if (!userCompletedTasks.includes(task)) {
        userCompletedTasks.push(task);
      }
    });
    return await convex.mutation(api.functions.users.updateUser.default, {
      _id: id,
      ...data,
      completedTasks: userCompletedTasks,
    });
  };

  const deleteUser = async (id: Id<"users">) => {
    const user = await getUserById(id);
    if (!user) return;

    return await convex.mutation(api.functions.users.deleteUser.default, {
      _id: user._id,
    });
  };

  return {
    getUserByEmail,
    getUserById,
    getUsersByType,
    getAllUsers,
    getUsersByClassroomCode,
    createUser,
    updateUser,
    deleteUser,
  };
}
