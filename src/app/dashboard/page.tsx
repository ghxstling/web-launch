"use client";

import { SignOutButton, useUser } from "@clerk/clerk-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User } from "lucide-react";
import { useUserService } from "../../../convex/services/userService";
import { useConvex } from "convex/react";
import { useEffect, useState } from "react";
import { EditAccountModal } from "@/components/edit-account-modal";
import { useTasksService } from "../../../convex/services/tasksService";
import { Separator } from "@/components/ui/separator";
import { TeacherDashboard } from "@/components/teacher-dashboard";
import StudentDashboard from "@/components/student-dashboard";
import { useToast } from "@/hooks/use-toast";

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
          <SignOutButton>
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
  const convex = useConvex();
  const userService = useUserService(convex);
  const tasksService = useTasksService(convex);

  const [apiUser, setApiUser] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [description, setDescription] = useState<React.JSX.Element>();
  const [dashboardContent, setDashboardContent] = useState<React.JSX.Element>();
  const [tasks, setTasks] = useState<any[] | null>(null);

  const { toast } = useToast();

  useEffect(() => {
    const getUser = async () => {
      if (user) {
        let userObj = await userService.getUserByEmail(
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
          taskInfo = await tasksService.getTasksByClassroomCode(userObj!.code!);
          setTasks(tasks);

          const completed = taskInfo.filter(
            (task) => apiUser._id in task.completedBy,
          ).length;
          setDescription(
            <ul>
              <li>
                You have <b>{taskInfo.length}</b> incompleted tasks
              </li>
              <li>
                You have completed a total of <b>{completed}</b> tasks
              </li>
            </ul>,
          );
          setDashboardContent(<StudentDashboard />);
        }
      }
    };

    if (isLoaded && isSignedIn) {
      getUser();
    }
  }, [user, isLoaded, isSignedIn, userService, tasksService]);

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
              <Button
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
                className="text-sm font-medium"
              >
                Code: {apiUser.code}
              </Button>
            </div>
            <div className="grid gap-3 grid-flow-col">
              <CardDescription className="text-right text-black">
                {description}
              </CardDescription>
              <Separator orientation="vertical" />
              <DashboardDropdown handleClick={() => setIsModalOpen(true)} />
            </div>
          </div>
          <Separator />
        </CardHeader>
        {dashboardContent}

        {/* User Info Modal */}
        <EditAccountModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          user={apiUser}
          clerkUser={user}
        />
      </>
    );
  }
}
