import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/employees";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const EmployeeService = {
  getAll: async () => {
    const response = await api.get("");
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/${id}`);
    return response.data;
  },

  create: async (employee) => {
    const response = await api.post("", employee);
    return response.data;
  },

  update: async (id, employee) => {
    const response = await api.put(`/${id}`, employee);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/${id}`);
    return response.data;
  },
};

export default EmployeeService;