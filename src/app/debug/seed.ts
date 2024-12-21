import { faker } from "@faker-js/faker";
import { useClassroomCodesService } from "../../../convex/services/classroomCodesService";
import { useTasksService } from "../../../convex/services/tasksService";
import { useUserService } from "../../../convex/services/userService";
import { UserType } from "@/lib/types";
import { ConvexReactClient } from "convex/react";

export async function useGenerateData(
  seedOption: number,
  convex: ConvexReactClient,
) {
  const userService = useUserService(convex);
  const tasksService = useTasksService(convex);
  const classroomCodesService = useClassroomCodesService(convex);

  faker.seed(seedOption);

  // Seed Users (Teachers)
  console.log("Seeding Teachers ...");
  for (let i = 0; i < 10; i++) {
    let firstName = faker.person.firstName();
    let lastName = faker.person.lastName();
    let email = faker.internet.email();
    let password = faker.internet.password();
    let confirm = password;
    let type = UserType.Teacher;

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
  let codes = [];
  for (let i = 0; i < 3; i++) {
    let code = faker.string.alphanumeric(6).toUpperCase();
    codes.push(code);
    let teachers = (await userService.getUsersByType(UserType.Teacher)).filter(
      (t) => t.code === "",
    );
    let createdBy = await userService.getUserById(
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
    let teacher = faker.helpers.arrayElement(
      (await userService.getUsersByType(UserType.Teacher)).filter(
        (t) => t.code === "",
      ),
    );
    let code = faker.helpers.arrayElement(codes);

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
  for (let i = 0; i < 60; i++) {
    let firstName = faker.person.firstName();
    let lastName = faker.person.lastName();
    let email = faker.internet.email();
    let password = faker.internet.password();
    let confirm = password;
    let type = UserType.Student;
    let code = faker.helpers.arrayElement(
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
  for (let i = 0; i < 240; i++) {
    let title = faker.lorem.sentence();
    let description = faker.lorem.paragraph();
    let dueDate = faker.date.soon({ days: 28 }).toISOString();
    let code = faker.helpers.arrayElement(
      (await classroomCodesService.getAllClassroomCodes()).map(
        (c: any) => c.code,
      ),
    );
    let assignedBy = faker.helpers.arrayElement(
      (await userService.getUsersByType(UserType.Teacher)).map(
        (user: any) => user._id,
      ),
    );

    let students = (await userService.getUsersByClassroomCode(code))
      .filter((student: any) => student.type === UserType.Student)
      .map((student: any) => student._id);
    let completedBy = faker.helpers.arrayElements(
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
