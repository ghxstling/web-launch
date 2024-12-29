/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { SignOutButton, useUser } from "@clerk/clerk-react";
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { LogOut, User } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { useUserService } from "@/../convex/services/userService";
import { useTasksService } from "@/../convex/services/tasksService";
import { Separator } from "@/components/ui/separator";
import { EditAccountModal } from "@/components/modal/edit-account-modal";
import { TeacherDashboard } from "@/components/dashboard/teacher-dashboard";
import StudentDashboard from "@/components/dashboard/student/student-dashboard";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const DashboardDropdown = ({ handleClick }: { handleClick: () => void }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="font-medium text-white">Settings</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>
          <User />
          <DropdownMenuLabel onClick={handleClick}>Account</DropdownMenuLabel>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <LogOut />
          <SignOutButton redirectUrl="/">
            <DropdownMenuLabel className="text-red-600">
              Sign Out
            </DropdownMenuLabel>
          </SignOutButton>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default function Page() {
  const { isSignedIn, user, isLoaded } = useUser();
  const { toast } = useToast();

  const userService = useUserService();
  const tasksService = useTasksService();

  const [apiUser, setApiUser] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [description, setDescription] = useState<React.JSX.Element>();
  const [dashboardContent, setDashboardContent] = useState<React.JSX.Element>();
  const [tasks, setTasks] = useState<any[] | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        const userObj = await userService.getUserByEmail(
          user.primaryEmailAddress!.emailAddress,
        );
        setApiUser(userObj);

        let taskInfo;
        if (userObj!.type === "teacher") {
          taskInfo = await tasksService.getTasksAssignedByUser(userObj!._id);
          const students = (
            await userService.getUsersByClassroomCode(userObj!.code!)
          ).filter((u) => u.type === "student");

          setDescription(
            <ul>
              <li>
                You have <b>{students.length}</b> students in your classroom{" "}
              </li>
              <li>
                You have assigned <b>{taskInfo.length}</b> total tasks
              </li>
            </ul>,
          );
          setDashboardContent(<TeacherDashboard user={apiUser} />);
        } else {
          taskInfo = await tasksService.getTasksByClassroomCode(
            userObj!.code!,
          )!;
          setTasks(tasks);
          setDescription(
            <ul>
              <li>
                You have{" "}
                <b>{taskInfo.length - apiUser?.completedTasks.length}</b>{" "}
                incomplete tasks
              </li>
              <li>
                Your next task is due on{" "}
                <b>
                  {new Date(taskInfo[0].dueDate).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </b>
                {" at "}
                <b>
                  {new Date(taskInfo[0].dueDate).toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "numeric",
                  })}
                </b>
              </li>
            </ul>,
          );
          setDashboardContent(<StudentDashboard user={apiUser} />);
        }
      }
    };

    if (isLoaded && isSignedIn) {
      fetchData();
    }
  }, [user, userService, tasksService, isLoaded, isSignedIn, apiUser, tasks]);

  const dashboardDropdown = useMemo(
    () => <DashboardDropdown handleClick={() => setIsModalOpen(true)} />,
    [],
  );
  const desc = useMemo(() => description, [description]);
  const dashboard = useMemo(() => dashboardContent, [dashboardContent]);
  const editAccountModal = useMemo(
    () => (
      <EditAccountModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={apiUser}
        clerkUser={user}
      />
    ),
    [isModalOpen, apiUser, user],
  );

  if (apiUser) {
    return (
      <>
        <CardHeader className="h-[10%]">
          <div className="flex justify-between items-center pb-1">
            <div className="grid gap-3 grid-flow-col">
              <CardTitle className="text-2xl flex items-center">
                Welcome, {apiUser.firstName} {apiUser.lastName}
              </CardTitle>
              <Separator orientation="vertical" />
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger
                    type="button"
                    onClick={() => {
                      navigator.clipboard
                        .writeText(apiUser.code)
                        .then(() => {
                          toast({
                            description: "Code copied to clipboard",
                          });
                        })
                        .catch((err) => {
                          toast({
                            description: "Failed to copy: " + err,
                          });
                        });
                    }}
                    className={cn(
                      buttonVariants({
                        variant: "default",
                        size: "default",
                        className: "",
                      }),
                      "text-sm font-medium",
                    )}
                  >
                    Code: {apiUser.code}
                  </TooltipTrigger>
                  <TooltipContent sideOffset={4}>
                    <p>Copy to clipboard</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="grid gap-3 grid-flow-col">
              <CardDescription className="text-right text-black">
                {desc}
              </CardDescription>
              <Separator orientation="vertical" />
              {dashboardDropdown}
            </div>
          </div>
          <Separator />
        </CardHeader>
        {dashboard}

        {/* User Info Modal */}
        {editAccountModal}
      </>
    );
  }
}
