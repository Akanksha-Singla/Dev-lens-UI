import api from "./api";

export const DEMO_USER_ID = Number(import.meta.env.VITE_DEMO_USER_ID || 4);

export interface Repository {
  id: number;
  user_id: number;
  github_repo_id: number;
  name: string;
  full_name: string;
  url: string;
  default_branch: string;
  status: "pending" | "indexing" | "indexed" | "failed" | string;
  last_indexed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateRepositoryInput {
  userId: number;
  githubRepoId: number;
  name: string;
  fullName: string;
  url: string;
  defaultBranch: string;
  createdAt: string;
  updatedAt: string;
}

export interface IndexingJob {
  job_id: string;
  status: string;
  files_processed: number;
  total_files: number;
  error: string | null;
  created_at: string;
  started_at: string | null;
  completed_at: string | null;
}

export interface CodeSource {
  repository_file_id: number;
  file_path: string;
  start_line: number;
  end_line: number;
  similarity: number;
  content: string;
}

export interface CodeAnswer {
  answer: string;
  sources: CodeSource[];
}

interface ApiEnvelope<T> {
  ResultCode: number;
  ReturnMessage: string;
  Responsedata: T;
}

function unwrap<T>(envelope: ApiEnvelope<T>): T {
  if (envelope.ResultCode >= 400) {
    throw new Error(envelope.ReturnMessage || "The request could not be completed.");
  }
  return envelope.Responsedata;
}

export async function getRepositories(userId = DEMO_USER_ID) {
  const response = await api.get<ApiEnvelope<Repository[]>>("/repositories/getRepositories", {
    params: { userId },
  });
  return unwrap(response.data);
}

export async function getRepositoryById(repositoryId: number, userId = DEMO_USER_ID) {
  const response = await api.get<ApiEnvelope<Repository>>(`/repositories/getRepositoryById/${repositoryId}`, {
    params: { userId },
  });
  return unwrap(response.data);
}

export async function createRepository(input: CreateRepositoryInput) {
  const response = await api.post<ApiEnvelope<Repository>>("/repositories/createUserRepository", input);
  return unwrap(response.data);
}

export async function startIndexing(repositoryId: number, userId = DEMO_USER_ID) {
  const response = await api.post<ApiEnvelope<{ repositoryId: number; jobId: string; status: string }>>(
    `/repositories/indexRepository/${repositoryId}`,
    {},
    { params: { userId } },
  );
  return unwrap(response.data);
}

export async function getIndexingStatus(repositoryId: number, userId = DEMO_USER_ID) {
  const response = await api.get<ApiEnvelope<IndexingJob>>(
    `/repositories/indexRepository/${repositoryId}/status`,
    { params: { userId } },
  );
  return unwrap(response.data);
}

export async function deleteRepository(repositoryId: number, userId = DEMO_USER_ID) {
  const response = await api.delete<ApiEnvelope<{ repositoryId: number }>>(
    `/repositories/deleteUserRepository/${repositoryId}`,
    { params: { userId } },
  );
  return unwrap(response.data);
}

export async function askCodebase(repositoryId: number, question: string) {
  const response = await api.post<CodeAnswer>("/llm/ask", { repositoryId, question });
  return response.data;
}