import { Server } from './server';

export interface CurrentUser {
  id: number; // Or string, depending on your DB
  name: string;
  email: string;
  roles: string[]; // Assuming roles are strings
  GUID?: string;
  avatar?: string; // Added optional avatar URL
  server?: Server;
} 