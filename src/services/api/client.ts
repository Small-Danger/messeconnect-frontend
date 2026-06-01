import { API_URL as ENV_API_URL } from '../../config/env';

export const API_URL = ENV_API_URL;

export class ApiError extends Error {
  status: number;
  payload?: unknown;

  constructor(message: string, status: number, payload?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.payload = payload;
  }
}

export interface ApiRequestOptions extends Omit<RequestInit, 'body'> {
  token?: string | null;
  body?: unknown;
}

function extractErrorMessage(payload: unknown): string {
  if (typeof payload !== 'object' || payload === null) {
    return 'Une erreur est survenue.';
  }

  const errors = (payload as { errors?: Record<string, string[]> }).errors;
  if (errors && typeof errors === 'object') {
    const first = Object.values(errors).flat().find((msg) => typeof msg === 'string' && msg.length > 0);
    if (first) return first;
  }

  const message = (payload as { message?: unknown }).message;
  if (typeof message === 'string' && message.length > 0) {
    return message;
  }

  return 'Une erreur est survenue.';
}

export async function apiRequest<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const { token, body, headers, ...rest } = options;

  const response = await fetch(`${API_URL}${path}`, {
    ...rest,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const payload: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    throw new ApiError(extractErrorMessage(payload), response.status, payload);
  }

  return payload as T;
}

export async function apiUpload<T>(path: string, formData: FormData, token?: string | null): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: formData,
  });

  const payload: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    throw new ApiError(extractErrorMessage(payload), response.status, payload);
  }

  return payload as T;
}
