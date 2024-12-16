import { api } from "../_generated/api";
import { Id } from "../_generated/dataModel";
import { ConvexReactClient } from "convex/react";

export function useClassroomCodesService(convex: ConvexReactClient) {
  const addClassroomCode = async (code: string, createdBy: Id<"users">) => {
    return await convex.mutation(
      api.functions.classroomCodes.addClassroomCode.default,
      { code, createdBy },
    );
  };

  const getClassroomCode = async (code: string) => {
    return await convex.query(
      api.functions.classroomCodes.getClassroomCode.default,
      { code },
    );
  };

  const getClassroomCodeById = async (id: Id<"classroomCodes">) => {
    return await convex.query(
      api.functions.classroomCodes.getClassroomCodeById.default,
      { _id: id },
    );
  };

  const getClassroomCodeByUser = async (userId: Id<"users">) => {
    const user = await convex.query(api.functions.users.getUserById.default, {
      _id: userId,
    });
    if (user!.type != "teacher") return;

    return await convex.query(
      api.functions.classroomCodes.getClassroomCodesByUser.default,
      { createdBy: user!._id },
    );
  };

  const getAllClassroomCodes = async () => {
    return await convex.query(
      api.functions.classroomCodes.getAllClassroomCodes.default,
    );
  };

  return {
    addClassroomCode,
    getClassroomCode,
    getClassroomCodeById,
    getClassroomCodeByUser,
    getAllClassroomCodes,
  };
}
