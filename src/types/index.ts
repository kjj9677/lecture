export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
  userType: "student" | "instructor";
  createdAt: string;
}

export interface Lecture {
  id: string;
  title: string;
  instructorId: string;
  instructorName: string;
  price: number;
  maxStudents: number;
  currentStudents: number;
  applicants: string[];
  createdAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
  phone: string;
  userType: "student" | "instructor";
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

export interface CreateLectureRequest {
  title: string;
  price: number;
  maxStudents: number;
}

export interface UpdateLectureRequest {
  id: string;
  title?: string;
  price?: number;
  maxStudents?: number;
}

export type LectureSortOption = "recent" | "popular" | "enrollment-rate";

export interface LectureListOptions {
  sort?: LectureSortOption;
  limit?: number;
  offset?: number;
}

export interface UserSession {
  user: User;
  token: string;
  loginTime: string;
}
