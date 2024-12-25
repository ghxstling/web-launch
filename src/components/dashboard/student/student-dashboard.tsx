/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Accordion } from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CardContent } from "@/components/ui/card";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { useUser } from "@clerk/nextjs";
import { useTasksService } from "@/../convex/services/tasksService";
import { useState, useEffect, useMemo } from "react";

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

  const tasksService = useTasksService();

  // const [announcements, setAnnouncements] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await tasksService.getTasksByClassroomCode(user.code);
        setTasks(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (isLoaded) fetchData();
  }, [user, tasksService, isLoaded]);

  const sortedTasks = useMemo(() => {
    return tasks
      .map((task: any) => {
        return {
          ...task,
          isCompleted: task.completedBy.includes(user._id)
            ? "Complete"
            : new Date(task.dueDate) < new Date()
              ? "Overdue"
              : "Incomplete",
        };
      })
      .sort((a: any, b: any) => {
        const statusOrder = { Complete: 1, Incomplete: 0, Overdue: -1 };
        if (statusOrder[a.isCompleted] === statusOrder[b.isCompleted]) {
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        }
        return statusOrder[a.isCompleted] - statusOrder[b.isCompleted];
      });
  }, [tasks, user._id]);

  const memoizedColumns = useMemo(() => columns(user._id), [user._id]);

  const children = useMemo(
    () => <DataTable columns={memoizedColumns} data={sortedTasks} />,
    [memoizedColumns, sortedTasks],
  );

  if (!isLoaded) return;

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
  const announcementsList = (
    <div className={css.noData}>No new announcements</div>
  );

  return (
    <>
      <CardContent className="py-0">
        <div className="flex flex-row justify-between w-full">
          <div className={css.list + ` w-[calc(30%-0.5rem)] max-w-[30%]`}>
            <h1 className={css.listHeading}>Announcements</h1>
            <ScrollArea type="hover" className={css.listScrollArea}>
              <Accordion type="single" collapsible className="w-full">
                {announcementsList}
              </Accordion>
            </ScrollArea>
          </div>
          <div className={css.list + ` w-[calc(70%-0.5rem)] max-w-[70%]`}>
            <h1 className={css.listHeading}>Your Tasks</h1>
            <ScrollArea type="hover" className={css.listScrollArea + " px-4"}>
              {children}
            </ScrollArea>
          </div>
        </div>
      </CardContent>
    </>
  );
}
