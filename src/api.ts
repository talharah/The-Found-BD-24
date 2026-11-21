const TOKEN_KEY = 'topmoney24_token';

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string | null) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

async function request(path: string, options: RequestInit = {}) {
  const token = getToken();
  const res = await fetch(`/api${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || 'কিছু একটা সমস্যা হয়েছে।');
  }
  return data;
}

export const api = {
  register: (name: string, phone: string, password: string, referCode?: string) =>
    request('/auth/register', { method: 'POST', body: JSON.stringify({ name, phone, password, referCode }) }),

  login: (phone: string, password: string) =>
    request('/auth/login', { method: 'POST', body: JSON.stringify({ phone, password }) }),

  me: () => request('/me'),

  getPackages: () => request('/packages'),
  myPackages: () => request('/packages/mine'),
  buyPackage: (packageId: string) => request(`/packages/${packageId}/buy`, { method: 'POST' }),
  claimPackage: (userPackageId: string) => request(`/packages/mine/${userPackageId}/claim`, { method: 'POST' }),
  savePackage: (pkg: any) => request('/packages', { method: 'POST', body: JSON.stringify(pkg) }),
  deletePackage: (id: string) => request(`/packages/${id}`, { method: 'DELETE' }),

  getTeam: () => request('/team'),

  getTasks: () => request('/tasks'),
  completeTask: (taskId: string) => request(`/tasks/${taskId}/complete`, { method: 'POST' }),
  myCompletedTasks: () => request('/tasks/completed/mine'),
  saveTask: (task: any) => request('/tasks', { method: 'POST', body: JSON.stringify(task) }),
  deleteTask: (id: string) => request(`/tasks/${id}`, { method: 'DELETE' }),

  getUsers: () => request('/users'),
  adjustBalance: (userId: string, amount: number, actionType: 'add' | 'deduct' | 'set', note?: string) =>
    request(`/users/${userId}/balance`, { method: 'PATCH', body: JSON.stringify({ amount, actionType, note }) }),
  toggleUserStatus: (userId: string) => request(`/users/${userId}/status`, { method: 'PATCH' }),

  getSettings: () => request('/settings'),
  updateSettings: (settings: any) => request('/settings/settings', { method: 'PUT', body: JSON.stringify(settings) }),
  updatePaymentNumbers: (numbers: any) => request('/settings/payment-numbers', { method: 'PUT', body: JSON.stringify(numbers) }),

  submitDeposit: (method: string, senderNumber: string, amount: number, trxId: string) =>
    request('/deposits', { method: 'POST', body: JSON.stringify({ method, senderNumber, amount, trxId }) }),
  myDeposits: () => request('/deposits/mine'),
  allDeposits: () => request('/deposits'),
  approveDeposit: (id: string) => request(`/deposits/${id}/approve`, { method: 'POST' }),
  rejectDeposit: (id: string, reason?: string) =>
    request(`/deposits/${id}/reject`, { method: 'POST', body: JSON.stringify({ reason }) }),

  submitWithdraw: (method: string, accountNumber: string, amount: number) =>
    request('/withdrawals', { method: 'POST', body: JSON.stringify({ method, accountNumber, amount }) }),
  myWithdrawals: () => request('/withdrawals/mine'),
  allWithdrawals: () => request('/withdrawals'),
  completeWithdraw: (id: string, reference?: string) =>
    request(`/withdrawals/${id}/complete`, { method: 'POST', body: JSON.stringify({ reference }) }),
  rejectWithdraw: (id: string, reason?: string) =>
    request(`/withdrawals/${id}/reject`, { method: 'POST', body: JSON.stringify({ reason }) }),
};
