/* eslint-disable @typescript-eslint/no-explicit-any */
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { cn } from "@/lib/utils";
import { taskSchema } from "@/lib/zod";
import { ITaskForm } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarClock, Calendar as CalendarIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import React from "react";
import { useTasksService } from "@/../convex/services/tasksService";

function DatePicker({ value, onChange }: any) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "text-left font-normal",
            !value && "text-muted-foreground",
          )}
        >
          <CalendarIcon className="size-4" />
          {value ? format(value, "PP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" side="top" align="start">
        <Calendar
          mode="single"
          selected={value}
          onSelect={onChange}
          disabled={(date) => date < new Date()}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}

function TimePicker({ value, onChange }: { value: string; onChange: any }) {
  const timeOptions = Array.from({ length: 24 * 2 }).map((_, i) => {
    const time =
      "" +
      (Math.floor(i / 2) % 12 === 0 ? "12" : Math.floor(i / 2) % 12) +
      ":" +
      ((i % 2) * 30 === 0 ? "00" : (i % 2) * 30) +
      (i < 24 ? " AM" : " PM");
    return (
      <SelectItem key={time} value={time} onSelect={onChange}>
        {time}
      </SelectItem>
    );
  });

  return (
    <Select onValueChange={onChange}>
      <SelectTrigger
        className={cn(
          "w-min text-left font-normal hover:bg-accent hover:text-accent-foreground transition-colors",
          !value && "text-muted-foreground",
        )}
      >
        <CalendarClock className="size-4 ml-1 mr-2" />
        <SelectValue placeholder="Pick a time " />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>{timeOptions}</SelectGroup>
      </SelectContent>
    </Select>
  );
}

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
}

export function CreateTaskModal({ isOpen, onClose, user }: TaskModalProps) {
  const { toast } = useToast();
  const tasksService = useTasksService();

  const [message, setMessage] = useState<string[] | null>(null);
  const [loadingMessage, setLoadingMessage] = useState(false);

  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState<string>("");
  const [dueDate, setDueDate] = useState<string>("");

  const css = {
    FormItem: "grid grid-cols-5 items-center gap-x-4",
    FormLabel: "text-right col-span-1",
    FormDesc: "text-gray-400 text-xs col-start-2",
    FormMsg: "text-red-500 text-sm col-start-2 col-span-4 text-left",
  };

  const form = useForm<ITaskForm>({
    defaultValues: {
      title: "",
      description: "",
      dueDate: "",
    },
    resolver: zodResolver(taskSchema),
  });

  const handleDateChange = (selectedDate: Date | null) => {
    setDate(selectedDate);
    if (selectedDate && time !== "") {
      const dateTime = `${format(selectedDate, "yyyy-MM-dd")} ${time}`;
      setDueDate(dateTime);
      form.setValue("dueDate", dateTime);
    } else {
      setDueDate("");
      form.setValue("dueDate", "");
    }
    console.log(form.getValues("dueDate"));
  };

  const handleTimeChange = (selectedTime: string) => {
    setTime(selectedTime);
    if (date) {
      const dateTime = `${format(date, "yyyy-MM-dd")} ${time}`;
      setDueDate(dateTime);
      form.setValue("dueDate", dateTime);
    } else {
      setDueDate("");
      form.setValue("dueDate", "");
    }
    console.log(form.getValues("dueDate"));
  };

  const resetEffects = () => {
    setLoadingMessage(false);
    setMessage(null);
    form.reset();
  };

  const onSubmit = (data: ITaskForm) => {
    resetEffects();
    setLoadingMessage(true);

    try {
      tasksService.addTask({
        title: data.title,
        description: data.description,
        dueDate: data.dueDate,
        completedBy: [],
        code: user.code,
        assignedBy: user._id,
      });

      resetEffects();
      onClose();
      toast({
        title: "Task created successfully!",
      });
    } catch (err: any) {
      resetEffects();
      setMessage([err.message, "text-red-500"]);
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[30rem] border-2 border-black">
        <DialogHeader>
          <DialogTitle>Create a New Task</DialogTitle>
          <DialogDescription>
            Once you create a task, it will be assigned to all students in your
            classroom automatically.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-1">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className={css.FormItem}>
                  <FormLabel htmlFor="title" className={css.FormLabel}>
                    Title
                  </FormLabel>
                  <FormControl>
                    <Input
                      id="title"
                      className="col-span-4"
                      placeholder="Lorem ipsum odor amet, consectetuer ..."
                      value={field.value}
                      onChange={(e) => {
                        field.onChange(e);
                        setTitle(e.target.value);
                      }}
                    />
                  </FormControl>
                  <FormDescription className={css.FormDesc}>
                    {title.length}/30
                  </FormDescription>
                  <FormMessage className={css.FormMsg} />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className={css.FormItem}>
                  <FormLabel htmlFor="description" className={css.FormLabel}>
                    Description
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      id="description"
                      className="resize-none col-span-4 h-36"
                      placeholder="Lorem ipsum odor amet, consectetuer adipiscing elit. Per maecenas ligula justo ut class pellentesque imperdiet cubilia."
                      value={field.value}
                      onChange={(e) => {
                        field.onChange(e);
                        setDescription(e.target.value);
                      }}
                    />
                  </FormControl>
                  <FormDescription className={css.FormDesc}>
                    {description.length}/200
                  </FormDescription>
                  <FormMessage className={css.FormMsg} />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dueDate"
              render={() => (
                <FormItem className={css.FormItem}>
                  <FormLabel htmlFor="dueDate" className={css.FormLabel}>
                    Due Date
                  </FormLabel>
                  <FormControl>
                    <div className="flex gap-2">
                      <DatePicker value={date} onChange={handleDateChange} />
                      <TimePicker value={time} onChange={handleTimeChange} />
                      <input
                        type="hidden"
                        value={dueDate}
                        {...form.register("dueDate")}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className={css.FormMsg} />
                </FormItem>
              )}
            />
            {message && <p className={message[1] + " text-sm"}>{message[0]}</p>}
            <DialogFooter className="pt-4">
              <Button type="submit">
                {loadingMessage ? "Loading..." : "Save changes"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
