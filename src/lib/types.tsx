import { Id } from "../../convex/_generated/dataModel";

export enum UserType {
  Teacher = "teacher",
  Student = "student",
}

export interface ILoginForm {
  email: string;
  password: string;
}

export interface IRegisterForm extends ILoginForm {
  firstName: string;
  lastName: string;
  confirm: string;
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
