import api from "./api";

export async function getSessions() {
  const response = await api.get("/progress/");
  return response.data;
}

export async function createSession(data) {
  const response = await api.post("/progress/", data);
  return response.data;
}

export async function deleteSession(id) {
  await api.delete(`/progress/${id}`);
}