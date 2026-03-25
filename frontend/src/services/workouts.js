import api from "./api";

export async function getWorkouts() {
  const response = await api.get("/workouts/");
  return response.data;
}

export async function createWorkout(data) {
  const response = await api.post("/workouts/", data);
  return response.data;
}

export async function deleteWorkout(id) {
  await api.delete(`/workouts/${id}`);
}