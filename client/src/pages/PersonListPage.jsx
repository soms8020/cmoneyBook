import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { formatAmount, RELATIONSHIP_LABELS } from '../constants';
import { Loading, EmptyState, Pagination, ConfirmDialog } from '../components/common';
import { useToast } from '../components/common';

const RELATIONSHIPS = Object.keys(RELATIONSHIP_LABELS);

export default function PersonListPage() {
    const [persons, setPersons] = useState([]);
    const [meta, setMeta] = useState({});
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [relFilter, setRelFilter] = useState('');
    const [deleteId, setDeleteId] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [editTarget, setEditTarget] = useState(null);
    const [form, setForm] = useState({ name: '', relationship: 'COLLEAGUE', phone: '', memo: '' });
    const navigate = useNavigate();
    const toast = useToast();

    const load = useCallback(async (p = 1) => {
        setLoading(true);
        try {
            const params = { page: p, limit: 20 };
            if (search) params.search = search;
            if (relFilter) params.relationship = relFilter;
            const res = await api.persons.list(params);
            setPersons(res.data);
            setMeta(res.meta);
        } finally { setLoading(false); }
    }, [search, relFilter]);

    useEffect(() => { load(page); }, [load, page]);

    const openAdd = () => { setEditTarget(null); setForm({ name: '', relationship: 'COLLEAGUE', phone: '', memo: '' }); setShowForm(true); };
    const openEdit = (p) => { setEditTarget(p); setForm({ name: p.name, relationship: p.relationship, phone: p.phone || '', memo: p.memo || '' }); setShowForm(true); };

    const handleSave = async () => {
        if (!form.name.trim()) return toast.error('이름을 입력해주세요.');
        try {
            if (editTarget) {
                await api.persons.update(editTarget.id, form);
                toast.success('인물이 수정되었습니다.');
            } else {
                await api.persons.create(form);
                toast.success('인물이 등록되었습니다.');
            }
            setShowForm(false);
            load(page);
        } catch (e) { toast.error(e.message); }
    };

    const handleDelete = async () => {
        try {
            await api.persons.delete(deleteId);
            toast.success('삭제되었습니다.'); setDeleteId(null); load(page);
        } catch (e) { toast.error(e.message); }
    };

    return (
        <div>
            <div className="page-header">
                <div><h2>인물 관리</h2><p>경조사 관련 인물 목록</p></div>
                <button className="btn btn-primary" onClick={openAdd}>+ 인물 등록</button>
            </div>

            <div className="filter-bar" style={{ marginBottom: 16 }}>
                <input className="form-control search-input" placeholder="이름 검색..." value={search}
                    onChange={e => { setSearch(e.target.value); setPage(1); }} />
                <select className="form-control" value={relFilter}
                    onChange={e => { setRelFilter(e.target.value); setPage(1); }}>
                    <option value="">전체 관계</option>
                    {RELATIONSHIPS.map(r => <option key={r} value={r}>{RELATIONSHIP_LABELS[r]}</option>)}
                </select>
            </div>

            {loading ? <Loading /> : persons.length === 0 ? (
                <EmptyState icon="👥" title="인물이 없습니다" description="경조사 관련 인물을 등록해보세요"
                    action={<button className="btn btn-primary" onClick={openAdd}>인물 등록</button>} />
            ) : (
                <div className="person-grid">
                    {persons.map(p => (
                        <div key={p.id} className="person-card" onClick={() => navigate(`/persons/${p.id}`)}>
                            <div className="person-card-header">
                                <div className="person-avatar">{p.name[0]}</div>
                                <div>
                                    <div className="person-name">{p.name}</div>
                                    <div className="person-relation">{RELATIONSHIP_LABELS[p.relationship]}</div>
                                </div>
                                <div style={{ marginLeft: 'auto', display: 'flex', gap: 4 }} onClick={e => e.stopPropagation()}>
                                    <button className="btn btn-ghost btn-sm" onClick={() => openEdit(p)}>✏️</button>
                                    <button className="btn btn-ghost btn-sm" onClick={() => setDeleteId(p.id)}>🗑️</button>
                                </div>
                            </div>
                            <div className="person-balance-row"><span className="label">보낸 경조사비</span><span className="value amount-sent">-{formatAmount(p.totalSent || 0)}</span></div>
                            <div className="person-balance-row" style={{ marginTop: 4 }}><span className="label">받은 경조사비</span><span className="value amount-received">+{formatAmount(p.totalReceived || 0)}</span></div>
                            <div className="person-balance-row" style={{ marginTop: 8, paddingTop: 8, borderTop: '1px solid var(--border-color)' }}>
                                <span className="label">잔액</span>
                                <span className={`value ${(p.balance || 0) >= 0 ? 'balance-positive' : 'balance-negative'}`}>
                                    {(p.balance || 0) >= 0 ? '+' : ''}{formatAmount(p.balance || 0)}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <Pagination page={page} totalPages={meta.totalPages} onChange={setPage} />

            {/* Person Form Modal */}
            {showForm && (
                <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowForm(false)}>
                    <div className="modal">
                        <div className="modal-header">
                            <span className="modal-title">{editTarget ? '인물 수정' : '인물 등록'}</span>
                            <button className="modal-close" onClick={() => setShowForm(false)}>×</button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <label className="form-label required">이름</label>
                                <input className="form-control" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="이름 입력" />
                            </div>
                            <div className="form-group">
                                <label className="form-label required">관계</label>
                                <select className="form-control" value={form.relationship} onChange={e => setForm(f => ({ ...f, relationship: e.target.value }))}>
                                    {RELATIONSHIPS.map(r => <option key={r} value={r}>{RELATIONSHIP_LABELS[r]}</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">전화번호</label>
                                <input className="form-control" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="010-0000-0000" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">메모</label>
                                <textarea className="form-control" rows={2} value={form.memo} onChange={e => setForm(f => ({ ...f, memo: e.target.value }))} placeholder="메모 입력" />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={() => setShowForm(false)}>취소</button>
                            <button className="btn btn-primary" onClick={handleSave}>{editTarget ? '수정' : '등록'}</button>
                        </div>
                    </div>
                </div>
            )}

            <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete}
                title="인물 삭제" message="인물을 삭제하면 관련 내역도 모두 삭제됩니다." danger />
        </div>
    );
}
