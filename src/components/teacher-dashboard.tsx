"use client";

import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useConvex } from "convex/react";
import { useEffect, useState } from "react";
import { useTasksService } from "../../convex/services/tasksService";
import { useUserService } from "../../convex/services/userService";
import { CardContent, CardFooter } from "./ui/card";
import { Button } from "./ui/button";
import { ChevronRight } from "lucide-react";

interface TeacherDashboardProps {
  user: any;
}

const css = {
  noData: "flex justify-center text-sm text-gray-400 mt-48",
  listEntry: "flex justify-between items-center",
  listEntryText: "text-sm truncate max-w-[calc(100%-3rem)]",
};

export function TeacherDashboard({ user }: TeacherDashboardProps) {
  const convex = useConvex();
  const userService = useUserService(convex);
  const tasksService = useTasksService(convex);

  const [students, setStudents] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const students = (
        await userService.getUsersByClassroomCode(user.code!)
      ).filter((u) => u.type === "student");
      const tasks = await tasksService.getTasksAssignedByUser(user._id);

      setStudents(students);
      setTasks(tasks);
    };

    fetchData();
  }, [user, userService, tasksService]);

  let studentsList, tasksList;
  if (students.length !== 0) {
    studentsList = students.map((student) => (
      <React.Fragment key={student._id}>
        <div className={css.listEntry}>
          <p className={css.listEntryText}>
            {student.firstName} {student.lastName}
          </p>
          <Button variant={"ghost"} className="size-6 p-0 hover:bg-none">
            <ChevronRight />
          </Button>
        </div>
        <Separator className="my-2" />
      </React.Fragment>
    ));
  } else {
    studentsList = <div className={css.noData}>No students available</div>;
  }

  if (tasks.length !== 0) {
    tasksList = tasks.map((task) => (
      <React.Fragment key={task._id}>
        <div className={css.listEntry}>
          <p className={css.listEntryText}>{task.title}</p>
          <Button variant={"ghost"} className="size-6 p-0 hover:bg-none">
            <ChevronRight />
          </Button>
        </div>
        <Separator className="my-2" />
      </React.Fragment>
    ));
  } else {
    tasksList = <div className={css.noData}>No tasks assigned</div>;
  }

  const headings = ["Students", "Assigned Tasks"];
  const data = [studentsList, tasksList];
  const lists = Array.from({ length: 2 }).map((_, i) => (
    <div
      key={i}
      className={
        `flex flex-col ` +
        (i === 0 ? "w-[calc(33%-0.5rem)]" : "w-[calc(67%-0.5rem)]")
      }
    >
      <h1 className="text-center text-xl font-medium underline underline-offset-1 mt-2 mb-4">
        {headings.at(i)}
      </h1>
      <ScrollArea
        type="hover"
        className="w-full h-[40rem] rounded-md border p-4"
      >
        {data.at(i)}
      </ScrollArea>
    </div>
  ));

  return (
    <>
      <CardContent className="py-0 h-[80%]">
        <div className="flex flex-row justify-between">
          {lists.map((list) => list)}
        </div>
      </CardContent>
      <CardFooter className="grid grid-flow-col pt-6 h-[10%]">
        <div className="flex gap-2 justify-end">
          <Button>Create New Task</Button>
          <Button>Invite Student</Button>
        </div>
      </CardFooter>
    </>
  );
}
