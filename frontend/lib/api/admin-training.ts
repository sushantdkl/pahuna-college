import { apiDelete, apiGet, apiPatch, apiPost } from "@/lib/api/axios-instance";
import type {
  TrainingCourse,
  TrainingEnrollment,
} from "@/lib/api/training";
import type {
  TrainingCourseFormData,
  TrainingCourseStatus,
  TrainingEnrollmentStatus,
} from "@/schemas/training.schema";

export type AdminTrainingCourse = TrainingCourse;
export type AdminTrainingEnrollment = TrainingEnrollment;

export type AdminTrainingCourseListParams = {
  page?: number;
  limit?: number;
  search?: string;
  status?: TrainingCourseStatus | "";
  category?: string;
  active?: boolean | "";
};

export type AdminTrainingEnrollmentListParams = {
  page?: number;
  limit?: number;
  search?: string;
  status?: TrainingEnrollmentStatus | "";
  courseId?: string;
};

function queryString(params: Record<string, unknown>) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") query.set(key, String(value));
  });
  const value = query.toString();
  return value ? `?${value}` : "";
}

export function getAdminTrainingCourses(params: AdminTrainingCourseListParams = {}) {
  return apiGet<AdminTrainingCourse[]>(
    `/admin/training-courses${queryString(params)}`,
    true,
  );
}

export function getAdminTrainingCourse(id: string) {
  return apiGet<AdminTrainingCourse>(`/admin/training-courses/${id}`, true);
}

export function createAdminTrainingCourse(payload: TrainingCourseFormData) {
  return apiPost<AdminTrainingCourse>("/admin/training-courses", payload, true);
}

export function updateAdminTrainingCourse(id: string, payload: Partial<TrainingCourseFormData>) {
  return apiPatch<AdminTrainingCourse>(`/admin/training-courses/${id}`, payload, true);
}

export function deleteAdminTrainingCourse(id: string) {
  return apiDelete<{ deleted: true }>(`/admin/training-courses/${id}`, true);
}

export function getAdminTrainingEnrollments(params: AdminTrainingEnrollmentListParams = {}) {
  return apiGet<AdminTrainingEnrollment[]>(
    `/admin/training-enrollments${queryString(params)}`,
    true,
  );
}

export function updateAdminTrainingEnrollment(
  id: string,
  payload: { status?: TrainingEnrollmentStatus; response?: string },
) {
  return apiPatch<AdminTrainingEnrollment>(
    `/admin/training-enrollments/${id}`,
    payload,
    true,
  );
}

export function deleteAdminTrainingEnrollment(id: string) {
  return apiDelete<{ deleted: true }>(`/admin/training-enrollments/${id}`, true);
}
