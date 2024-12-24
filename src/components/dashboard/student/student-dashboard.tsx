/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useUser } from "@clerk/nextjs";
import { useTasksService } from "../../../../convex/services/tasksService";
import { useUserService } from "../../../../convex/services/userService";
import { useState, useEffect } from "react";

interface StudentDashboardProps {
  user: any;
}

const css = {
  noData: "flex justify-center text-sm text-gray-400 mt-48",
  list: "flex flex-col",
  listHeading:
    "text-center text-xl font-medium underline underline-offset-1 mt-2 mb-4",
  listScrollArea: "w-full h-[40rem] rounded-md border p-4",
  listEntryTitle: "text-sm font-medium truncate max-w-sm",
  listEntryDesc: "text-wrap w-[28rem]",
};

export default function StudentDashboard({ user }: StudentDashboardProps) {
  const { isLoaded } = useUser();

  const userService = useUserService();
  const tasksService = useTasksService();

  // const [announcements, setAnnouncements] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // const students = (
        //   await userService.getUsersByClassroomCode(user.code!)
        // ).filter((u) => u.type === "student");
        const tasks = await tasksService.getTasksByClassroomCode(user.code);

        // setStudents(students);
        setTasks(tasks);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (isLoaded) fetchData();
    return;
  }, [user, userService, tasksService, isLoaded]);

  if (!isLoaded) return;

  let announcementsList, tasksList;
  // TODO: implement announcements table using <Accordion />

  // if (students.length !== 0) {
  //   studentsList = students.map((student) => (
  //     <AccordionItem value={student._id} key={student._id}>
  //       <AccordionTrigger
  //         className={
  //           (students.findIndex((s) => s._id === student._id) === 0
  //             ? "mb-2"
  //             : "my-2") + " py-0"
  //         }
  //       >
  //         <p className={css.listEntryTitle}>
  //           {student.firstName} {student.lastName}
  //         </p>
  //       </AccordionTrigger>
  //       <AccordionContent className="w-full">
  //         <Separator className="mb-4" />
  //         <ul className={css.listEntryDesc + " w-fit "}>
  //           <li>
  //             <b>Email:</b> {student.email}
  //           </li>
  //           <li>
  //             <b>Tasks Completed:</b> {student.completedTasks.length} out of{" "}
  //             {tasks.length} tasks
  //           </li>
  //           <li>
  //             <b>Last logged in:</b> random date
  //           </li>
  //         </ul>
  //       </AccordionContent>
  //     </AccordionItem>
  //   ));
  // } else {
  // }
  announcementsList = (
    <div>
      {user.completedTasks.map((taskId: any) => (
        <>
          <p key={taskId}>{taskId}</p>
        </>
      ))}
    </div>
  );

  if (tasks.length !== 0) {
    tasksList = tasks.map((task) => (
      <div
        key={task._id}
        className={task.completedBy.includes(user._id) ? "bg-green-100" : ""}
      >
        <AccordionItem value={task._id}>
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
                <b>ID:</b> {task._id}
              </li>
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
                {231123213} students
              </li>
              <li>
                <b>Status:</b>{" "}
                {task.completedBy.includes(user._id) ? "Completed" : "Pending"}
              </li>
            </ul>
          </AccordionContent>
        </AccordionItem>
      </div>
    ));
  } else {
    tasksList = <div className={css.noData}>No tasks assigned</div>;
  }

  return (
    <>
      <CardContent className="py-0 h-[80%]">
        <div className="flex flex-row justify-between w-full">
          <div className={css.list + ` w-[calc(40%-0.5rem)] max-w-[40%]`}>
            <h1 className={css.listHeading}>Announcements</h1>
            <ScrollArea type="hover" className={css.listScrollArea}>
              <Accordion type="single" collapsible className="w-full">
                {announcementsList}
              </Accordion>
            </ScrollArea>
          </div>
          <div className={css.list + ` w-[calc(60%-0.5rem)] max-w-[60%]`}>
            <h1 className={css.listHeading}>Your Tasks</h1>
            <ScrollArea type="hover" className={css.listScrollArea}>
              <Accordion type="single" collapsible className="w-full">
                {tasksList}
              </Accordion>
            </ScrollArea>
          </div>
        </div>
      </CardContent>
      <CardFooter className="grid grid-flow-col pt-6 h-[10%]">
        <div className="flex gap-2 justify-end">
          <Button onClick={() => alert(true)}>Create New Task</Button>
        </div>
      </CardFooter>
    </>
  );
}
