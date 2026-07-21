import {
  createAdminTrainingCourse,
  deleteAdminTrainingCourse,
  deleteAdminTrainingEnrollment,
  getAdminTrainingCourse,
  getAdminTrainingCourses,
  getAdminTrainingEnrollments,
  updateAdminTrainingCourse,
  updateAdminTrainingEnrollment,
} from "@/lib/api/admin-training";

export const getAdminTrainingCoursesAction = getAdminTrainingCourses;
export const getAdminTrainingCourseAction = getAdminTrainingCourse;
export const createAdminTrainingCourseAction = createAdminTrainingCourse;
export const updateAdminTrainingCourseAction = updateAdminTrainingCourse;
export const deleteAdminTrainingCourseAction = deleteAdminTrainingCourse;
export const getAdminTrainingEnrollmentsAction = getAdminTrainingEnrollments;
export const updateAdminTrainingEnrollmentAction =
  updateAdminTrainingEnrollment;
export const deleteAdminTrainingEnrollmentAction =
  deleteAdminTrainingEnrollment;
