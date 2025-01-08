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
export const createFolder = (folderData) => API.post("/admin/folders", folderData);
export const getFolders = () => API.get("/admin/folders");
export const getFolderById = (folderId) => API.get(`/admin/folders/${folderId}`); // If you need a folder by ID
export const updateFolder = (folderId, folderData) => API.patch(`/admin/folders/${folderId}`, folderData); // Updated to use PATCH for folder updates
export const deleteFolder = (folderId) => API.delete(`/admin/folders/${folderId}`);

// Admin APIs
export const createUser = (userData) => API.post("/auth/admin/create-user", userData);

// File APIs
export const uploadFile = (folderId, fileData) =>
  API.post(`admin/files/${folderId}`, fileData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
export const downloadFile = (fileId) => API.get(`admin/files/${fileId}`, { responseType: "blob" });
export const deleteFile = (fileId) => API.delete(`admin/files/${fileId}`);

export const deleteFolderFile = (folderId, fileId) =>
  API.delete(`/admin/files/${folderId}/${fileId}`);
// Users API (new function to get users)

// Folder APIs for Client (Shared Folders)
export const getClientFolders = () => API.get("/client/folders"); // Get folders shared with the client
export const getClientFolderById = (folderId) => API.get(`/client/folders/${folderId}`); // Get specific folder by ID for the client
// File Preview API
export const getFilePreview = (fileId) =>
  API.get(`/client/files/preview/${fileId}`, { responseType: "blob" });
// Delete User
export const deleteUser = (userId) => API.delete(`/admin/users/${userId}`);

export const getUsers = () => API.get("/admin/"); 
// Permission APIs
export const updateFolderPermissions = (folderId, permissionsData) =>
  API.patch(`admin/folders/${folderId}`, permissionsData); // Updated to use PATCH for updating permissions
