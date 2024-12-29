/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Task, UserType } from "@/lib/types";
import { MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { ViewTaskModal } from "@/components/modal/view-task-modal";
import { useState } from "react";
import { useTasksService } from "@/../convex/services/tasksService";
import { useUserService } from "@/../convex/services/userService";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Id } from "../../../../convex/_generated/dataModel";

const css = {
  header: "font-bold text-black text-center mt-1",
};

export const columns = (userId: Id<"users">): ColumnDef<Task>[] => [
  {
    id: "taskId",
    header: () => <div className={css.header}>#</div>,
    cell: ({ row }) => {
      return <div className="truncate max-w-xs">{row.index + 1}</div>;
    },
  },
  {
    accessorKey: "title",
    header: () => <div className={css.header}>Title</div>,
    cell: ({ row }) => {
      return (
        <div className="truncate max-w-[18rem]">{row.getValue("title")}</div>
      );
    },
  },
  {
    accessorKey: "dueDate",
    header: () => <div className={css.header}>Due Date</div>,
    cell: ({ row }) => {
      const date = new Date(row.getValue("dueDate")).toLocaleDateString(
        "en-US",
        {
          year: "numeric",
          month: "short",
          day: "numeric",
        },
      );
      const time = new Date(row.getValue("dueDate")).toLocaleTimeString(
        "en-US",
        {
          hour: "numeric",
          minute: "numeric",
        },
      );

      return (
        <div className="text-center">
          {date}
          <br />
          {time}
        </div>
      );
    },
  },
  {
    accessorKey: "isCompleted",
    header: () => <div className={css.header}>Status</div>,
    cell: ({ row }) => {
      return (
        <div className="text-center">
          {row.getValue("isCompleted") === "Overdue" ? (
            <Badge className="rounded-xl px-1.5 py-0.5 bg-red-500 hover:bg-red-700">
              Overdue
            </Badge>
          ) : (
            row.getValue("isCompleted")
          )}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const task = row.original;
      const tasksService = useTasksService();
      const userService = useUserService();
      const { toast } = useToast();

      const [viewTaskModal, setViewTaskModal] = useState<boolean>(false);

      const handleTaskCompletion = async () => {
        if (task._id) {
          if (!task.completedBy.includes(userId)) {
            const user = await userService.getUserById(userId);
            const completedTasks = user!.completedTasks;
            completedTasks.push(task._id);

            await userService.updateUser(userId, {
              firstName: user!.firstName,
              lastName: user!.lastName,
              email: user!.email,
              password: user!.password,
              confirm: user!.confirm!,
              type: UserType.Student,
              code: user!.code,
              completedTasks,
            });
            await tasksService.addUserToCompletedBy(task._id, userId);
            toast({
              description: "Woohoo! You have completed the task.",
            });
          } else {
            const user = await userService.getUserById(userId);
            const completedTasks = user!.completedTasks;
            completedTasks.splice(
              completedTasks.findIndex((t) => t === task._id),
              1,
            );

            await userService.updateUser(userId, {
              firstName: user!.firstName,
              lastName: user!.lastName,
              email: user!.email,
              password: user!.password,
              confirm: user!.confirm!,
              type: UserType.Student,
              code: user!.code,
              completedTasks,
            });
            await tasksService.removeUserFromCompletedBy(task._id, userId);

            toast({
              description:
                "Task marked as incomplete. Good on you for being honest!",
            });
          }
        }
      };

      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setViewTaskModal(true)}>
                View Task
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleTaskCompletion}>
                {task.completedBy.includes(userId) ? (
                  <b>Mark as incomplete</b>
                ) : (
                  <b>Mark as completed</b>
                )}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <ViewTaskModal
            isOpen={viewTaskModal}
            onClose={() => setViewTaskModal(false)}
            task={task}
          />
        </>
      );
    },
  },
];
