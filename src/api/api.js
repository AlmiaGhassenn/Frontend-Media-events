import axios from "axios";

// Base API URL
const API = axios.create({
  baseURL: "http://localhost:5000/api", // Adjust according to your backend's base URL
});

// Add Authorization token to requests
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// Auth APIs
export const registerUser = (userData) => API.post("/auth/register", userData);
export const loginUser = (userData) => API.post("/auth/login", userData);

// Folder APIs
export const createFolder = (folderData) => API.post("/folders", folderData);
export const getFolders = () => API.get("/folders");
export const getFolderById = (folderId) => API.get(`/folders/${folderId}`);
export const updateFolder = (folderId, folderData) => API.put(`/folders/${folderId}`, folderData);
export const deleteFolder = (folderId) => API.delete(`/folders/${folderId}`);

// File APIs
export const uploadFile = (fileData) =>
  API.post("/files", fileData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
export const downloadFile = (fileId) => API.get(`/files/${fileId}`, { responseType: "blob" });
export const deleteFile = (fileId) => API.delete(`/files/${fileId}`);

// Permission APIs
export const updateFolderPermissions = (folderId, permissions) =>
  API.patch(`/folders/${folderId}/permissions`, { permissions });
