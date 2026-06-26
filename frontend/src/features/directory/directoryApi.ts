import { api } from "../../lib/apiClient";
import type { StudentCardModel } from "./mockStudents";

export type StudentsListResponse = {
  items: StudentCardModel[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

export type StudentPublicProfile = {
  id: string;
  fullName: string;

  //  add
  registrationNumber: string;

  position: string;
  company: string;
  cityCountry: string;
  avatarUrl: string;
  coverUrl: string;
  openToWork: boolean;
  about: string;
  skills: string[];
  experiences: {
    title: string;
    company: string;
    employmentType: string;
    start: string;
    end: string;
    location?: string;
    description?: string;
  }[];
  education: {
    level: string;
    institutionName: string;
    degreeField: string;
    passingYear?: string;
    description?: string;
  }[];
  linkedin?: string;
  github?: string;
  portfolio?: string;
};

export async function listStudentsApi(params: {
  name?: string;
  company?: string;
  city?: string;
  skill?: string;
  page?: number;
  pageSize?: number;
}) {
  const qs = new URLSearchParams();
  if (params.name) qs.set("name", params.name);
  if (params.company) qs.set("company", params.company);
  if (params.city) qs.set("city", params.city);
  if (params.skill) qs.set("skill", params.skill);
  if (params.page) qs.set("page", String(params.page));
  if (params.pageSize) qs.set("pageSize", String(params.pageSize));

  const suffix = qs.toString() ? `?${qs.toString()}` : "";
  return api<StudentsListResponse>(`/api/students${suffix}`, {
    method: "GET",
    auth: true,
  });
}

export async function getStudentApi(id: string) {
  return api<StudentPublicProfile>(`/api/students/${id}`, {
    method: "GET",
    auth: true,
  });
}