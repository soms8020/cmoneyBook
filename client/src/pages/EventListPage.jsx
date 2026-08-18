import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { formatAmount, formatShortDate, DIRECTION_LABELS, EVENT_TYPE_LABELS, EVENT_TYPE_EMOJIS, RELATIONSHIP_LABELS } from '../constants';
import { Loading, EmptyState, Pagination, ConfirmDialog } from '../components/common';
import { useToast } from '../components/common';

const ALL_TYPES = ['WEDDING', 'FUNERAL', 'FIRST_BIRTHDAY', 'BIRTHDAY', 'PROMOTION', 'OPENING', 'HOUSEWARMING', 'RECOVERY', 'GRADUATION', 'OTHER'];

export default function EventListPage() {
    const [events, setEvents] = useState([]);
    const [meta, setMeta] = useState({});
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [filters, setFilters] = useState({ direction: '', type: '', search: '' });
    const [deleteId, setDeleteId] = useState(null);
    const navigate = useNavigate();
    const toast = useToast();

    const load = useCallback(async (p = 1) => {
        setLoading(true);
        try {
            const params = { page: p, limit: 20 };
            if (filters.direction) params.direction = filters.direction;
            if (filters.type) params.type = filters.type;
            const res = await api.events.list(params);
            setEvents(res.data);
            setMeta(res.meta);
        } finally { setLoading(false); }
    }, [filters]);

    useEffect(() => { load(page); }, [load, page]);

    const handleDelete = async () => {
        try {
            await api.events.delete(deleteId);
            toast.success('내역이 삭제되었습니다.');
            setDeleteId(null);
            load(page);
        } catch (e) { toast.error(e.message); }
    };

    return (
        <div>
            <div className="page-header">
                <div><h2>경조사 내역</h2><p>주고받은 경조사비 내역</p></div>
                <button className="btn btn-primary" onClick={() => navigate('/events/new')}>+ 내역 등록</button>
            </div>

            <div className="card">
                <div className="card-body" style={{ paddingBottom: 0 }}>
                    <div className="filter-bar">
                        <select className="form-control" value={filters.direction}
                            onChange={e => { setFilters(f => ({ ...f, direction: e.target.value })); setPage(1); }}>
                            <option value="">전체 구분</option>
                            <option value="SENT">보낸 경조사비</option>
                            <option value="RECEIVED">받은 경조사비</option>
                        </select>
                        <select className="form-control" value={filters.type}
                            onChange={e => { setFilters(f => ({ ...f, type: e.target.value })); setPage(1); }}>
                            <option value="">전체 유형</option>
                            {ALL_TYPES.map(t => <option key={t} value={t}>{EVENT_TYPE_LABELS[t]}</option>)}
                        </select>
                    </div>
                </div>
                <div className="table-wrapper">
                    {loading ? <Loading /> : events.length === 0 ? (
                        <EmptyState icon="📝" title="내역이 없습니다" description="경조사비를 기록해보세요"
                            action={<button className="btn btn-primary" onClick={() => navigate('/events/new')}>첫 내역 등록</button>} />
                    ) : (
                        <table>
                            <thead>
                                <tr><th>날짜</th><th>이름 (관계)</th><th>유형</th><th>구분</th><th>금액</th><th>메모</th><th>관리</th></tr>
                            </thead>
                            <tbody>
                                {events.map(e => (
                                    <tr key={e.id}>
                                        <td style={{ whiteSpace: 'nowrap' }}>{formatShortDate(e.eventDate)}</td>
                                        <td>
                                            <span style={{ fontWeight: 600 }}>{e.personName}</span>
                                            <span style={{ fontSize: 12, color: 'var(--text-muted)', marginLeft: 6 }}>
                                                {RELATIONSHIP_LABELS[e.personRelationship]}
                                            </span>
                                        </td>
                                        <td>{EVENT_TYPE_EMOJIS[e.type]} {EVENT_TYPE_LABELS[e.type]}</td>
                                        <td><span className={`badge badge-${e.direction.toLowerCase()}`}>{DIRECTION_LABELS[e.direction]}</span></td>
                                        <td className={e.direction === 'SENT' ? 'amount-sent' : 'amount-received'}>
                                            {e.direction === 'SENT' ? '-' : '+'}{formatAmount(e.amount)}
                                        </td>
                                        <td style={{ color: 'var(--text-muted)', fontSize: 13 }}>{e.memo || '-'}</td>
                                        <td>
                                            <div style={{ display: 'flex', gap: 4 }}>
                                                <button className="btn btn-ghost btn-sm" onClick={() => navigate(`/events/${e.id}/edit`)}>✏️</button>
                                                <button className="btn btn-ghost btn-sm" onClick={() => setDeleteId(e.id)}>🗑️</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
                {meta.totalPages > 1 && (
                    <div style={{ padding: '16px 20px' }}>
                        <Pagination page={page} totalPages={meta.totalPages} onChange={p => setPage(p)} />
                    </div>
                )}
            </div>

            <ConfirmDialog
                isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete}
                title="내역 삭제" message="이 내역을 삭제하면 복구할 수 없습니다. 삭제하시겠습니까?" danger
            />
        </div>
    );
}
