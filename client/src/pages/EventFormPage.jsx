import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../api/client';
import { EVENT_TYPE_LABELS, EVENT_TYPE_EMOJIS, RELATIONSHIP_LABELS, QUICK_AMOUNTS, formatAmount } from '../constants';
import { useToast } from '../components/common';

const TYPES = Object.keys(EVENT_TYPE_LABELS);
const RELATIONSHIPS = Object.keys(RELATIONSHIP_LABELS);

export default function EventFormPage() {
    const { id } = useParams();
    const isEdit = !!id;
    const navigate = useNavigate();
    const toast = useToast();

    const [persons, setPersons] = useState([]);
    const [form, setForm] = useState({
        personId: '', type: 'WEDDING', direction: 'SENT',
        amount: '', eventDate: new Date().toISOString().slice(0, 10), memo: '',
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [showNewPerson, setShowNewPerson] = useState(false);
    const [newPerson, setNewPerson] = useState({ name: '', relationship: 'COLLEAGUE' });

    useEffect(() => {
        api.persons.list({ limit: 100 }).then(r => setPersons(r.data));
        if (isEdit) {
            api.events.get(id).then(r => {
                const e = r.data;
                setForm({ personId: e.personId, type: e.type, direction: e.direction, amount: String(e.amount), eventDate: e.eventDate, memo: e.memo || '' });
            });
        }
    }, [id, isEdit]);

    const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

    const validate = () => {
        const e = {};
        if (!form.personId) e.personId = '인물을 선택해주세요.';
        if (!form.type) e.type = '유형을 선택해주세요.';
        if (!form.amount || Number(form.amount) <= 0) e.amount = '금액을 입력해주세요.';
        if (!form.eventDate) e.eventDate = '날짜를 선택해주세요.';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);
        try {
            const data = { ...form, amount: Number(form.amount) };
            if (isEdit) await api.events.update(id, data);
            else await api.events.create(data);
            toast.success(isEdit ? '내역이 수정되었습니다.' : '내역이 저장되었습니다.');
            navigate('/events');
        } catch (err) { toast.error(err.message); }
        finally { setLoading(false); }
    };

    const handleAddPerson = async () => {
        if (!newPerson.name.trim()) return;
        try {
            const res = await api.persons.create(newPerson);
            setPersons(p => [...p, res.data]);
            set('personId', res.data.id);
            setShowNewPerson(false);
            setNewPerson({ name: '', relationship: 'COLLEAGUE' });
            toast.success('인물이 등록되었습니다.');
        } catch (err) { toast.error(err.message); }
    };

    return (
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
            <div className="page-header">
                <div>
                    <h2>{isEdit ? '내역 수정' : '내역 등록'}</h2>
                    <p>경조사비 {isEdit ? '수정' : '등록'}</p>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                {/* 구분 */}
                <div className="card" style={{ marginBottom: 16 }}>
                    <div className="card-header"><span className="card-title">📋 기본 정보</span></div>
                    <div className="card-body">
                        <div className="form-group">
                            <label className="form-label required">구분</label>
                            <div className="direction-toggle">
                                <button type="button"
                                    className={`direction-btn sent ${form.direction === 'SENT' ? 'selected' : ''}`}
                                    onClick={() => set('direction', 'SENT')}>💸 보낸 경조사비</button>
                                <button type="button"
                                    className={`direction-btn received ${form.direction === 'RECEIVED' ? 'selected' : ''}`}
                                    onClick={() => set('direction', 'RECEIVED')}>💰 받은 경조사비</button>
                            </div>
                        </div>

                        {/* 인물 선택 */}
                        <div className="form-group">
                            <label className="form-label required">인물</label>
                            <div style={{ display: 'flex', gap: 8 }}>
                                <select className={`form-control ${errors.personId ? 'error' : ''}`}
                                    value={form.personId} onChange={e => set('personId', e.target.value)}>
                                    <option value="">인물 선택</option>
                                    {persons.map(p => (
                                        <option key={p.id} value={p.id}>{p.name} ({RELATIONSHIP_LABELS[p.relationship]})</option>
                                    ))}
                                </select>
                                <button type="button" className="btn btn-secondary btn-sm"
                                    style={{ whiteSpace: 'nowrap' }} onClick={() => setShowNewPerson(s => !s)}>
                                    {showNewPerson ? '취소' : '+ 신규'}
                                </button>
                            </div>
                            {errors.personId && <p className="form-error">{errors.personId}</p>}
                        </div>

                        {/* 신규 인물 등록 */}
                        {showNewPerson && (
                            <div style={{ background: 'var(--bg-base)', padding: 16, borderRadius: 'var(--border-radius-md)', marginBottom: 16 }}>
                                <div className="form-row" style={{ marginBottom: 8 }}>
                                    <div>
                                        <label className="form-label">이름</label>
                                        <input className="form-control" value={newPerson.name}
                                            onChange={e => setNewPerson(p => ({ ...p, name: e.target.value }))} placeholder="이름 입력" />
                                    </div>
                                    <div>
                                        <label className="form-label">관계</label>
                                        <select className="form-control" value={newPerson.relationship}
                                            onChange={e => setNewPerson(p => ({ ...p, relationship: e.target.value }))}>
                                            {RELATIONSHIPS.map(r => <option key={r} value={r}>{RELATIONSHIP_LABELS[r]}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <button type="button" className="btn btn-primary btn-sm" onClick={handleAddPerson}>인물 추가</button>
                            </div>
                        )}

                        {/* 날짜 */}
                        <div className="form-group">
                            <label className="form-label required">날짜</label>
                            <input type="date" className={`form-control ${errors.eventDate ? 'error' : ''}`}
                                value={form.eventDate} onChange={e => set('eventDate', e.target.value)} />
                            {errors.eventDate && <p className="form-error">{errors.eventDate}</p>}
                        </div>
                    </div>
                </div>

                {/* 경조사 유형 */}
                <div className="card" style={{ marginBottom: 16 }}>
                    <div className="card-header"><span className="card-title">🎉 경조사 유형</span></div>
                    <div className="card-body">
                        <div className="event-type-grid">
                            {TYPES.map(t => (
                                <button key={t} type="button"
                                    className={`event-type-btn ${form.type === t ? 'selected' : ''}`}
                                    onClick={() => set('type', t)}>
                                    <span className="emoji">{EVENT_TYPE_EMOJIS[t]}</span>
                                    {EVENT_TYPE_LABELS[t]}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 금액 */}
                <div className="card" style={{ marginBottom: 16 }}>
                    <div className="card-header"><span className="card-title">💵 금액</span></div>
                    <div className="card-body">
                        <div className="form-group">
                            <label className="form-label required">금액 (원)</label>
                            <input type="number" className={`form-control ${errors.amount ? 'error' : ''}`}
                                value={form.amount} onChange={e => set('amount', e.target.value)}
                                placeholder="0" min="1" />
                            {errors.amount && <p className="form-error">{errors.amount}</p>}
                            {form.amount && <p className="form-hint">{formatAmount(Number(form.amount))}</p>}
                        </div>
                        <div className="quick-amounts">
                            {QUICK_AMOUNTS.map(a => (
                                <button key={a} type="button" className="quick-amount-btn" onClick={() => set('amount', String(a))}>
                                    {formatAmount(a)}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 메모 */}
                <div className="card" style={{ marginBottom: 24 }}>
                    <div className="card-header"><span className="card-title">📝 메모 (선택)</span></div>
                    <div className="card-body">
                        <textarea className="form-control" rows={3} value={form.memo}
                            onChange={e => set('memo', e.target.value)} placeholder="메모를 입력하세요..." />
                    </div>
                </div>

                <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                    <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>취소</button>
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? '저장 중...' : (isEdit ? '수정 완료' : '등록 완료')}
                    </button>
                </div>
            </form>
        </div>
    );
}
