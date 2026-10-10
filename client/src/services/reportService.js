import api from "./api";
export const createReport = (d) => api.post("/reports", d);
export const getReports = () => api.get("/reports");
export const updateReport = (id, status) =>
  api.patch(`/reports/${id}`, { status });
