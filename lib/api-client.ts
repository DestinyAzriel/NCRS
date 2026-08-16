const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
const API_V1 = `${API_BASE}/api/v1`;

// --- Auth helpers ---
export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('nyanthepa_token');
}

export function setToken(token: string): void {
  localStorage.setItem('nyanthepa_token', token);
}

export function clearToken(): void {
  localStorage.removeItem('nyanthepa_token');
  localStorage.removeItem('nyanthepa_user');
}

export function getStoredUser(): any | null {
  if (typeof window === 'undefined') return null;
  const u = localStorage.getItem('nyanthepa_user');
  return u ? JSON.parse(u) : null;
}

// --- Base fetch wrapper ---
async function apiFetch(path: string, options: RequestInit = {}): Promise<any> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_V1}${path}`, { ...options, headers });
  if (res.status === 401) {
    clearToken();
    if (typeof window !== 'undefined') window.location.href = '/admin/login';
    throw new Error('Unauthorized');
  }
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || `API error ${res.status}`);
  }
  if (res.status === 204) return null;
  return res.json();
}

// === Auth ===
export async function login(email: string, password: string) {
  const data = await apiFetch('/auth/token', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  setToken(data.access_token);
  localStorage.setItem('nyanthepa_user', JSON.stringify(data.user));
  return data;
}

export async function getMe() {
  return apiFetch('/admin/me');
}

// === Station Status ===
export async function getStatus() {
  return apiFetch('/status');
}

export async function updateStatus(data: any) {
  return apiFetch('/admin/status', { method: 'PUT', body: JSON.stringify(data) });
}

// === News ===
export async function getNews(limit = 50) {
  return apiFetch(`/admin/news`);
}

export async function createNews(data: any) {
  return apiFetch('/admin/news', { method: 'POST', body: JSON.stringify(data) });
}

export async function updateNews(id: number, data: any) {
  return apiFetch(`/admin/news/${id}`, { method: 'PUT', body: JSON.stringify(data) });
}

export async function deleteNews(id: number) {
  return apiFetch(`/admin/news/${id}`, { method: 'DELETE' });
}

// === Schedule ===
export async function getSchedule() {
  return apiFetch('/admin/schedule');
}

export async function createScheduleSlot(data: any) {
  return apiFetch('/admin/schedule', { method: 'POST', body: JSON.stringify(data) });
}

export async function updateScheduleSlot(id: number, data: any) {
  return apiFetch(`/admin/schedule/${id}`, { method: 'PUT', body: JSON.stringify(data) });
}

export async function deleteScheduleSlot(id: number) {
  return apiFetch(`/admin/schedule/${id}`, { method: 'DELETE' });
}

// === Podcasts ===
export async function getPodcasts() {
  return apiFetch('/podcasts?limit=100');
}

export async function createPodcast(data: any) {
  return apiFetch('/admin/podcasts', { method: 'POST', body: JSON.stringify(data) });
}

export async function updatePodcast(id: number, data: any) {
  return apiFetch(`/admin/podcasts/${id}`, { method: 'PUT', body: JSON.stringify(data) });
}

export async function deletePodcast(id: number) {
  return apiFetch(`/admin/podcasts/${id}`, { method: 'DELETE' });
}

// === Sports / League Tables ===
export async function getSports() {
  return apiFetch('/sports');
}

export async function updateLeague(leagueKey: string, data: any) {
  return apiFetch(`/admin/sports/${leagueKey}`, { method: 'PUT', body: JSON.stringify(data) });
}

// === Partners ===
export async function getPartners() {
  return apiFetch('/partners');
}

export async function createPartner(data: any) {
  return apiFetch('/admin/partners', { method: 'POST', body: JSON.stringify(data) });
}

export async function deletePartner(id: number) {
  return apiFetch(`/admin/partners/${id}`, { method: 'DELETE' });
}

// === Team ===
export async function getTeam() {
  return apiFetch('/team');
}

export async function createTeamMember(data: any) {
  return apiFetch('/admin/team', { method: 'POST', body: JSON.stringify(data) });
}

export async function deleteTeamMember(id: number) {
  return apiFetch(`/admin/team/${id}`, { method: 'DELETE' });
}

// === Feedback ===
export async function getFeedback() {
  return apiFetch('/admin/feedback');
}

export async function updateFeedbackStatus(id: number, status: string) {
  return apiFetch(`/admin/feedback/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  });
}
