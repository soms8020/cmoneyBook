const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

async function request(path, options = {}) {
    const res = await fetch(`${BASE_URL}${path}`, {
        headers: { 'Content-Type': 'application/json', ...options.headers },
        ...options,
        body: options.body ? JSON.stringify(options.body) : undefined,
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error?.message || '서버 오류가 발생했습니다.');
    return json;
}

export const api = {
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
