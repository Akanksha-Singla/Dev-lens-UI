import api from "./api";

export async function getRepositories(userId: number) {
  const response = await api.get("/repositories/getRepositories", {
    params: {
      userId,
    },
  });
 console.log("Response data:", response.data); // Log the response data for debugging
  return response.data;
}