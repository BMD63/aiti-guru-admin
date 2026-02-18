export type LoginRequest = {
  username: string;
  password: string;
  expiresInMins?: number;
};

export type LoginResponse = {
  accessToken: string;
  refreshToken?: string;
};

export async function login(request: LoginRequest): Promise<LoginResponse> {
  const res = await fetch('https://dummyjson.com/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });

  let data: unknown = null;
  try {
    data = await res.json();
  } catch {
    // ignore
  }

  if (!res.ok) {
    const message =
      typeof data === 'object' &&
      data !== null &&
      'message' in data &&
      typeof (data as { message: unknown }).message === 'string'
        ? (data as { message: string }).message
        : 'Login failed';
    throw new Error(message);
  }

  const ok = data as Partial<LoginResponse>;
  if (!ok.accessToken) {
    throw new Error('Invalid login response');
  }

  return { accessToken: ok.accessToken, refreshToken: ok.refreshToken };
}