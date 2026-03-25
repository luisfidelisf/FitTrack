import api from "./api";

export async function getExercises() {
  const response = await api.get("/exercises/");
  return response.data;
}

export async function createExercise(data) {
  const response = await api.post("/exercises/", data);
  return response.data;
}

export async function deleteExercise(id) {
  await api.delete(`/exercises/${id}`);
}