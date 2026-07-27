import { apiGet, apiPost } from "@/lib/api/axios-instance";
import type {
  TrainingCourseStatus,
  TrainingEnrollmentFormData,
  TrainingEnrollmentStatus,
} from "@/schemas/training.schema";

export type TrainingCourse = {
  _id: string;
  title: string;
  slug: string;
  description: string;
  category?: string;
  duration?: string;
  price?: number;
  level?: string;
  mode?: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  maxParticipants?: number;
  image?: string;
  status: TrainingCourseStatus;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type TrainingEnrollment = {
  _id: string;
  courseId: string | Pick<TrainingCourse, "_id" | "title" | "slug" | "category" | "duration">;
  userId?: string | { _id: string; fullName: string; email?: string };
  name: string;
  fullName?: string;
  email: string;
  phone: string;
  age?: number;
  education?: string;
  educationLevel?: string;
  experience?: string;
  priorExperience?: string;
  message?: string;
  motivation?: string;
  status: TrainingEnrollmentStatus;
  response?: string;
  enrolledAt: string;
  createdAt: string;
  updatedAt: string;
};

export type TrainingCourseListParams = {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
};

function queryString(params: Record<string, unknown>) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") query.set(key, String(value));
  });
  const value = query.toString();
  return value ? `?${value}` : "";
}

export function getTrainingCourses(params: TrainingCourseListParams = {}) {
  return apiGet<TrainingCourse[]>(`/training-courses${queryString(params)}`);
}

export function getTrainingCourse(slug: string) {
  return apiGet<TrainingCourse>(`/training-courses/${encodeURIComponent(slug)}`);
}

export function createTrainingEnrollment(payload: TrainingEnrollmentFormData) {
  return apiPost<TrainingEnrollment>("/training-enrollments", payload);
}
