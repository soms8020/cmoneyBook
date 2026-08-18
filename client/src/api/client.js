const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

async function request(path, options = {}) {
    const token = localStorage.getItem('token');
    const headers = { 'Content-Type': 'application/json', ...options.headers };
    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const res = await fetch(`${BASE_URL}${path}`, {
        ...options,
        headers,
        body: options.body ? JSON.stringify(options.body) : undefined,
    });

    // 만약 상태 코드가 401이면 전역으로 auth_error 이벤트를 발생시켜 로그아웃 처리
    if (res.status === 401) {
        window.dispatchEvent(new Event('auth_error'));
    }

    let json;
    const contentType = res.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
        try {
            json = await res.json();
        } catch (e) {
            throw new Error('서버로부터 올바르지 않은 응답이 왔습니다.(JSON 파싱 에러)');
        }
    } else {
        const text = await res.text();
        throw new Error(`서버 응답 오류 (상태: ${res.status}). Vercel 환경변수 누락 등의 서버 크래시일 수 있습니다. 메시지: ${text.substring(0, 50)}`);
    }

    if (!res.ok) throw new Error(json.error?.message || json.message || '서버 오류가 발생했습니다.');
    return json;
}

export const api = {
    // Auth
    auth: {
        register: (data) => request('/auth/register', { method: 'POST', body: data }),
        login: (data) => request('/auth/login', { method: 'POST', body: data }),
        getMe: () => request('/auth/me'),
    },
    // Persons
    persons: {
        list: (params = {}) => request('/persons?' + new URLSearchParams(params)),
        get: (id) => request(`/persons/${id}`),
        create: (data) => request('/persons', { method: 'POST', body: data }),
        update: (id, data) => request(`/persons/${id}`, { method: 'PUT', body: data }),
        delete: (id) => request(`/persons/${id}`, { method: 'DELETE' }),
    },
    // Events
    events: {
        list: (params = {}) => request('/events?' + new URLSearchParams(params)),
        get: (id) => request(`/events/${id}`),
        create: (data) => request('/events', { method: 'POST', body: data }),
        update: (id, data) => request(`/events/${id}`, { method: 'PUT', body: data }),
        delete: (id) => request(`/events/${id}`, { method: 'DELETE' }),
    },
    // Groups
    groups: {
        list: () => request('/groups'),
        create: (data) => request('/groups', { method: 'POST', body: data }),
        update: (id, data) => request(`/groups/${id}`, { method: 'PUT', body: data }),
        delete: (id) => request(`/groups/${id}`, { method: 'DELETE' }),
    },
    // Stats
    stats: {
        summary: (params = {}) => request('/stats/summary?' + new URLSearchParams(params)),
        monthly: (params = {}) => request('/stats/monthly?' + new URLSearchParams(params)),
        byRelationship: () => request('/stats/by-relationship'),
        byType: () => request('/stats/by-type'),
        recommendation: (params = {}) => request('/stats/recommendation?' + new URLSearchParams(params)),
    },
};
