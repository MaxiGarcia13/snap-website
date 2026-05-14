export type AppStatus = 'active' | 'inactive';
export type AppMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'OPTIONS' | 'HEAD';

export interface AppInfo {
  name: string;
  version: string;
  author: string;
  description: string;
  homepage: string;
  timestamp: string;
  status: AppStatus;
  endpoints: AppEndpoint[];
}

export interface AppEndpoint {
  path: string;
  method: AppMethod;
  status: AppStatus;
  description: string;
  query?: Record<string, {
    type: string;
    description: string;
    required: boolean;
    values?: unknown[];
    default?: unknown;
  }>;
  body?: Record<string, unknown>;
}
