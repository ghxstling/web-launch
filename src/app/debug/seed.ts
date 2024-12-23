/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { faker } from "@faker-js/faker";
import { useClassroomCodesService } from "../../../convex/services/classroomCodesService";
import { useTasksService } from "../../../convex/services/tasksService";
import { useUserService } from "../../../convex/services/userService";
import { UserType } from "@/lib/types";

export async function useGenerateData(seedOption: number) {
  const userService = useUserService();
  const tasksService = useTasksService();
  const classroomCodesService = useClassroomCodesService();

  faker.seed(seedOption);

  // Seed Users (Teachers)
  console.log("Seeding Teachers ...");
  for (let i = 0; i < 4; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    let email = faker.internet.email();
    const password = faker.internet.password();
    const confirm = password;
    const type = UserType.Teacher;

    while ((await userService.getUserByEmail(email)) !== null) {
      email = faker.internet.email();
    }

    await userService.createUser({
      firstName,
      lastName,
      email,
      password,
      confirm,
      type,
      code: "",
      completedTasks: [],
    });
  }

  // Seed Classroom Codes
  console.log("Seeding Classroom Codes ...");
  const codes = [];
  for (let i = 0; i < 5; i++) {
    let code = faker.string.alphanumeric(6).toUpperCase();
    codes.push(code);
    const teachers = (
      await userService.getUsersByType(UserType.Teacher)
    ).filter((t) => t.code === "");
    const createdBy = await userService.getUserById(
      faker.helpers.arrayElement(teachers)._id,
    );
    while ((await classroomCodesService.getClassroomCode(code)) !== null) {
      code = faker.string.alphanumeric(6).toUpperCase();
    }

    await classroomCodesService.addClassroomCode(code, createdBy!._id);
    await userService.updateUser(createdBy!._id, {
      firstName: createdBy!.firstName,
      lastName: createdBy!.lastName,
      email: createdBy!.email,
      password: createdBy!.password,
      confirm: createdBy!.password,
      type: UserType.Teacher,
      code,
      completedTasks: [],
    });
  }

  while (
    (await userService.getUsersByType(UserType.Teacher)).filter(
      (t) => t.code === "",
    ).length > 0
  ) {
    const teacher = faker.helpers.arrayElement(
      (await userService.getUsersByType(UserType.Teacher)).filter(
        (t) => t.code === "",
      ),
    );
    const code = faker.helpers.arrayElement(codes);

    await userService.updateUser(teacher._id, {
      firstName: teacher.firstName,
      lastName: teacher.lastName,
      email: teacher.email,
      password: teacher.password,
      confirm: teacher.password,
      type: UserType.Teacher,
      code,
      completedTasks: [],
    });
  }

  // Seed Users (Students)
  console.log("Seeding Students ...");
  for (let i = 0; i < 10; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    let email = faker.internet.email();
    const password = faker.internet.password();
    const confirm = password;
    const type = UserType.Student;
    const code = faker.helpers.arrayElement(
      (await classroomCodesService.getAllClassroomCodes()).map(
        (classroomCode: any) => classroomCode.code,
      ),
    );

    while ((await userService.getUserByEmail(email)) !== null) {
      email = faker.internet.email();
    }

    await userService.createUser({
      firstName,
      lastName,
      email,
      password,
      confirm,
      type,
      code,
      completedTasks: [],
    });
  }

  // Seed Tasks
  console.log("Seeding Tasks ...");
  for (let i = 0; i < 50; i++) {
    const title = faker.lorem.sentence();
    const description = faker.lorem.paragraph();
    const dueDate = faker.date.soon({ days: 28 }).toISOString();
    const code = faker.helpers.arrayElement(
      (await classroomCodesService.getAllClassroomCodes()).map(
        (c: any) => c.code,
      ),
    );
    const assignedBy = faker.helpers.arrayElement(
      (await userService.getUsersByClassroomCode(code))
        .filter((user: any) => user.type === UserType.Teacher)
        .map((user: any) => user._id),
    );

    const students = (await userService.getUsersByClassroomCode(code))
      .filter((student: any) => student.type === UserType.Student)
      .map((student: any) => student._id);
    const completedBy = faker.helpers.arrayElements(
      students,
      faker.number.int({ min: 0, max: students.length }),
    );

    const task = await tasksService.addTask({
      title,
      description,
      dueDate,
      completedBy,
      code,
      assignedBy,
    });

    completedBy.forEach(async (studentId: any) => {
      const student = await userService.getUserById(studentId);
      const completedTasks = student!.completedTasks;

      if (!completedTasks.includes(task)) {
        completedTasks.push(task);
        await userService.updateUser(studentId, {
          firstName: student!.firstName,
          lastName: student!.lastName,
          email: student!.email,
          password: student!.password,
          confirm: student!.password,
          type: UserType.Student,
          code: student!.code,
          completedTasks,
        });
      }
    });
  }
}
