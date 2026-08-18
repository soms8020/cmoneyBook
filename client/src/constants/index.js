export const RELATIONSHIP_LABELS = {
    FAMILY: '가족/친척',
    FRIEND: '친구',
    COLLEAGUE: '직장동료',
    SCHOOL: '학교동기',
    NEIGHBOR: '이웃',
    BUSINESS: '비즈니스',
    OTHER: '기타',
};

export const EVENT_TYPE_LABELS = {
    WEDDING: '결혼',
    FUNERAL: '장례',
    FIRST_BIRTHDAY: '돌잔치',
    BIRTHDAY: '생일',
    PROMOTION: '승진',
    OPENING: '개업',
    HOUSEWARMING: '집들이',
    RECOVERY: '쾌유',
    GRADUATION: '졸업/입학',
    OTHER: '기타',
};

export const EVENT_TYPE_EMOJIS = {
    WEDDING: '💒',
    FUNERAL: '🙏',
    FIRST_BIRTHDAY: '🎂',
    BIRTHDAY: '🎁',
    PROMOTION: '🎉',
    OPENING: '🏪',
    HOUSEWARMING: '🏠',
    RECOVERY: '💐',
    GRADUATION: '🎓',
    OTHER: '📋',
};

export const DIRECTION_LABELS = {
    SENT: '보낸 경조사비',
    RECEIVED: '받은 경조사비',
};

export const QUICK_AMOUNTS = [30000, 50000, 100000, 200000, 300000];

export const RELATIONSHIP_COLORS = {
    FAMILY: '#6366f1',
    FRIEND: '#22c55e',
    COLLEAGUE: '#f59e0b',
    SCHOOL: '#3b82f6',
    NEIGHBOR: '#ec4899',
    BUSINESS: '#8b5cf6',
    OTHER: '#94a3b8',
};

export const formatAmount = (amount) =>
    new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(amount);

export const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });
};

export const formatShortDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('ko-KR');
};
