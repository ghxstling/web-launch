/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useMemo } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useEffect, useState } from "react";
import { useTasksService } from "@/../convex/services/tasksService";
import { useUserService } from "@/../convex/services/userService";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import { CreateTaskModal } from "@/components/modal/create-task-modal";

interface TeacherDashboardProps {
  user: any;
}

const css = {
  noData: "flex justify-center text-sm text-gray-400 mt-48",
  listEntryTitle: "text-sm font-medium truncate max-w-sm",
  listEntryDesc: "text-wrap w-[28rem]",
};

export function TeacherDashboard({ user }: TeacherDashboardProps) {
  const { isLoaded } = useUser();

  const userService = useUserService();
  const tasksService = useTasksService();

  const [students, setStudents] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [createTaskModal, setCreateTaskModal] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const students = (
          await userService.getUsersByClassroomCode(user.code!)
        ).filter((u) => u.type === "student");
        const tasks = await tasksService.getTasksAssignedByUser(user._id);

        setStudents(students);
        setTasks(tasks);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (isLoaded) fetchData();
    return;
  }, [user, userService, tasksService, isLoaded]);

  const studentsList = useMemo(() => {
    if (students.length !== 0) {
      return students.map((student) => (
        <AccordionItem value={student._id} key={student._id}>
          <AccordionTrigger
            className={
              (students.findIndex((s) => s._id === student._id) === 0
                ? "mb-2"
                : "my-2") + " py-0"
            }
          >
            <p className={css.listEntryTitle}>
              {student.firstName} {student.lastName}
            </p>
          </AccordionTrigger>
          <AccordionContent className="w-full">
            <Separator className="mb-4" />
            <ul className={css.listEntryDesc + " w-fit"}>
              <li>
                <b>Email:</b> {student.email}
              </li>
              <li>
                <b>Tasks Completed:</b> {student.completedTasks.length} out of{" "}
                {tasks.length} tasks
              </li>
              <li>
                <b>Last logged in:</b> random date
              </li>
            </ul>
          </AccordionContent>
        </AccordionItem>
      ));
    } else {
      return <div className={css.noData}>No students available</div>;
    }
  }, [tasks, students]);

  const tasksList = useMemo(() => {
    if (tasks.length !== 0) {
      return tasks.map((task) => (
        <AccordionItem value={task._id} key={task._id}>
          <AccordionTrigger
            className={
              (tasks.findIndex((s) => s._id === task._id) === 0
                ? "mb-2"
                : "my-2") + " py-0"
            }
          >
            <p className={css.listEntryTitle}>{task.title}</p>
          </AccordionTrigger>
          <AccordionContent>
            <Separator className="mb-4" />
            <ul className={css.listEntryDesc}>
              <li>
                <b>Description:</b>{" "}
                {task.description ? task.description : "N/A"}
              </li>
              <li>
                <b>Due Date:</b>{" "}
                {new Date(task.dueDate).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
                {", "}
                {new Date(task.dueDate).toLocaleTimeString("en-US", {
                  hour: "numeric",
                  minute: "numeric",
                })}
              </li>
              <li>
                <b># of Students Completed:</b> {task.completedBy.length} out of{" "}
                {students.length} students
              </li>
            </ul>
          </AccordionContent>
        </AccordionItem>
      ));
    } else {
      return <div className={css.noData}>No tasks assigned</div>;
    }
  }, [tasks, students]);

  const lists = useMemo(() => {
    const headings = ["Students", "Assigned Tasks"];
    const data = [studentsList, tasksList];
    return Array.from({ length: 2 }).map((_, i) => (
      <div
        key={i}
        className={
          `flex flex-col ` +
          (i === 0
            ? "w-[calc(40%-0.5rem)] max-w-[40%]"
            : "w-[calc(60%-0.5rem)] max-w-[60%]")
        }
      >
        <h1 className="text-center text-xl font-medium underline underline-offset-1 mt-2 mb-4">
          {headings.at(i)}
        </h1>
        <ScrollArea
          type="hover"
          className="w-full h-[40rem] rounded-md border p-4"
        >
          <Accordion type="single" collapsible className="w-full">
            {data.at(i)}
          </Accordion>
        </ScrollArea>
      </div>
    ));
  }, [studentsList, tasksList]);

  const modal = useMemo(() => {
    return (
      <CreateTaskModal
        isOpen={createTaskModal}
        onClose={() => setCreateTaskModal(false)}
        user={user}
      />
    );
  }, [createTaskModal, user]);

  if (!isLoaded) return;

  return (
    <>
      <CardContent className="py-0 h-[80%]">
        <div className="flex flex-row justify-between w-full">
          {lists.map((list) => list)}
        </div>
      </CardContent>
      <CardFooter className="grid grid-flow-col pt-6 h-[10%]">
        <div className="flex gap-2 justify-end">
          <Button onClick={() => setCreateTaskModal(true)}>
            Create New Task
          </Button>
        </div>
      </CardFooter>

      {/* Create Task Modal */}
      {modal}
    </>
  );
}
