import { IRegisterForm, UserType } from "@/lib/types";
import { api } from "../_generated/api";
import { Id } from "../_generated/dataModel";
import { ConvexReactClient } from "convex/react";

export function useUserService(convex: ConvexReactClient) {
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

  const createUser = async (data: IRegisterForm) => {
    const checkUser = await getUserByEmail(data.email);
    if (!checkUser) {
      return await convex.mutation(api.functions.users.addUser.default, {
        ...data,
      });
    }
  };

  const updateUser = async (id: Id<"users">, data: IRegisterForm) => {
    return await convex.mutation(api.functions.users.updateUser.default, {
      _id: id,
      ...data,
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
    createUser,
    updateUser,
    deleteUser,
  };
}
