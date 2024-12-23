/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as functions_classroomCodes_addClassroomCode from "../functions/classroomCodes/addClassroomCode.js";
import type * as functions_classroomCodes_deleteClassroomCode from "../functions/classroomCodes/deleteClassroomCode.js";
import type * as functions_classroomCodes_getAllClassroomCodes from "../functions/classroomCodes/getAllClassroomCodes.js";
import type * as functions_classroomCodes_getClassroomCode from "../functions/classroomCodes/getClassroomCode.js";
import type * as functions_classroomCodes_getClassroomCodeById from "../functions/classroomCodes/getClassroomCodeById.js";
import type * as functions_classroomCodes_getClassroomCodesByUser from "../functions/classroomCodes/getClassroomCodesByUser.js";
import type * as functions_resetDatabase from "../functions/resetDatabase.js";
import type * as functions_tasks_addTask from "../functions/tasks/addTask.js";
import type * as functions_tasks_deleteTask from "../functions/tasks/deleteTask.js";
import type * as functions_tasks_getAllTasks from "../functions/tasks/getAllTasks.js";
import type * as functions_tasks_getTaskById from "../functions/tasks/getTaskById.js";
import type * as functions_tasks_getTasksAssignedByUser from "../functions/tasks/getTasksAssignedByUser.js";
import type * as functions_tasks_getTasksByClassroomCode from "../functions/tasks/getTasksByClassroomCode.js";
import type * as functions_tasks_updateTask from "../functions/tasks/updateTask.js";
import type * as functions_users_addUser from "../functions/users/addUser.js";
import type * as functions_users_deleteUser from "../functions/users/deleteUser.js";
import type * as functions_users_getAllUsers from "../functions/users/getAllUsers.js";
import type * as functions_users_getUserByEmail from "../functions/users/getUserByEmail.js";
import type * as functions_users_getUserById from "../functions/users/getUserById.js";
import type * as functions_users_getUsersByClassroomCode from "../functions/users/getUsersByClassroomCode.js";
import type * as functions_users_getUsersByType from "../functions/users/getUsersByType.js";
import type * as functions_users_updateUser from "../functions/users/updateUser.js";
import type * as services_classroomCodesService from "../services/classroomCodesService.js";
import type * as services_tasksService from "../services/tasksService.js";
import type * as services_userService from "../services/userService.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  "functions/classroomCodes/addClassroomCode": typeof functions_classroomCodes_addClassroomCode;
  "functions/classroomCodes/deleteClassroomCode": typeof functions_classroomCodes_deleteClassroomCode;
  "functions/classroomCodes/getAllClassroomCodes": typeof functions_classroomCodes_getAllClassroomCodes;
  "functions/classroomCodes/getClassroomCode": typeof functions_classroomCodes_getClassroomCode;
  "functions/classroomCodes/getClassroomCodeById": typeof functions_classroomCodes_getClassroomCodeById;
  "functions/classroomCodes/getClassroomCodesByUser": typeof functions_classroomCodes_getClassroomCodesByUser;
  "functions/resetDatabase": typeof functions_resetDatabase;
  "functions/tasks/addTask": typeof functions_tasks_addTask;
  "functions/tasks/deleteTask": typeof functions_tasks_deleteTask;
  "functions/tasks/getAllTasks": typeof functions_tasks_getAllTasks;
  "functions/tasks/getTaskById": typeof functions_tasks_getTaskById;
  "functions/tasks/getTasksAssignedByUser": typeof functions_tasks_getTasksAssignedByUser;
  "functions/tasks/getTasksByClassroomCode": typeof functions_tasks_getTasksByClassroomCode;
  "functions/tasks/updateTask": typeof functions_tasks_updateTask;
  "functions/users/addUser": typeof functions_users_addUser;
  "functions/users/deleteUser": typeof functions_users_deleteUser;
  "functions/users/getAllUsers": typeof functions_users_getAllUsers;
  "functions/users/getUserByEmail": typeof functions_users_getUserByEmail;
  "functions/users/getUserById": typeof functions_users_getUserById;
  "functions/users/getUsersByClassroomCode": typeof functions_users_getUsersByClassroomCode;
  "functions/users/getUsersByType": typeof functions_users_getUsersByType;
  "functions/users/updateUser": typeof functions_users_updateUser;
  "services/classroomCodesService": typeof services_classroomCodesService;
  "services/tasksService": typeof services_tasksService;
  "services/userService": typeof services_userService;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
