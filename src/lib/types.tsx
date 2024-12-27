import { Id } from "../../convex/_generated/dataModel";

export enum UserType {
  Teacher = "teacher",
  Student = "student",
}

export interface ILoginForm {
  email: string;
  password: string;
}

export interface IResetForm extends ILoginForm {
  confirm: string;
}

export interface IRegisterForm extends IResetForm {
  firstName: string;
  lastName: string;
  type: UserType;
  code: string;
}

export interface User extends IRegisterForm {
  _id?: Id<"users">;
  completedTasks: Id<"tasks">[];
}

export interface IUpdateAccountForm {
  firstName: string;
  lastName: string;
  password: string;
  confirm: string;
}

export interface ITaskForm {
  title: string;
  description: string;
  dueDate: string;
  code: Id<"classroomCodes"> | string;
  assignedBy: Id<"users">;
  completedBy: Id<"users">[];
}

export interface Task extends ITaskForm {
  _id?: Id<"tasks">;
}
