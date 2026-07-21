import {
  createTrainingEnrollment,
  getTrainingCourse,
  getTrainingCourses,
} from "@/lib/api/training";

export const getTrainingCoursesAction = getTrainingCourses;
export const getTrainingCourseAction = getTrainingCourse;
export const createTrainingEnrollmentAction = createTrainingEnrollment;
