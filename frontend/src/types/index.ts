export interface User {
  id: number;
  login: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  birthDate: string | null;
  about: string | null;
  avatarPicId: number | null;
  phoneNumber: string | null;
}

export interface Post {
  id: number;
  content: any; // Editor.js output JSON
  createdAt: string;
  updatedAt: string;
  pictures?: { url: string }[];
}

export interface LoginCredentials {
    login: string;
    password: string;
}

export interface RegisterData extends LoginCredentials {
    email: string;
    firstName?: string;
    lastName?: string;
    birthDate?: string;
    about?: string;
    avatarFile?: File;
}