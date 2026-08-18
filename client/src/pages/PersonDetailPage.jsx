import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { formatAmount, formatShortDate, RELATIONSHIP_LABELS, EVENT_TYPE_LABELS, EVENT_TYPE_EMOJIS, DIRECTION_LABELS } from '../constants';
import { Loading } from '../components/common';

export default function PersonDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [person, setPerson] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.persons.get(id).then(r => setPerson(r.data)).finally(() => setLoading(false));
    }, [id]);

    if (loading) return <Loading />;
    if (!person) return <div>인물을 찾을 수 없습니다.</div>;

    const sentRatio = person.totalSent + person.totalReceived > 0
        ? Math.round((person.totalSent / (person.totalSent + person.totalReceived)) * 100) : 0;

    return (
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
            <div className="page-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <button className="btn btn-ghost" onClick={() => navigate('/persons')}>← 돌아가기</button>
                    <div>
                        <h2>{person.name}</h2>
                        <p>{RELATIONSHIP_LABELS[person.relationship]}{person.phone ? ` · ${person.phone}` : ''}</p>
                    </div>
                </div>
            </div>

            {/* Balance Summary */}
            <div className="summary-grid" style={{ marginBottom: 20 }}>
                <div className="summary-card sent">
                    <div className="icon">💸</div>
                    <div className="label">보낸 경조사비</div>
                    <div className="amount">{formatAmount(person.totalSent)}</div>
                </div>
                <div className="summary-card received">
                    <div className="icon">💰</div>
                    <div className="label">받은 경조사비</div>
                    <div className="amount">{formatAmount(person.totalReceived)}</div>
                </div>
                <div className={`summary-card ${person.balance >= 0 ? 'balance-pos' : 'balance-neg'}`} style={{ gridColumn: 'span 2' }}>
                    <div className="icon">{person.balance >= 0 ? '📈' : '📉'}</div>
                    <div className="label">잔액 (받은 - 보낸)</div>
                    <div className="amount">{formatAmount(Math.abs(person.balance))}</div>
                    <div className="sub">
                        {person.balance >= 0 ? `${person.name}에게서 ${formatAmount(person.balance)} 더 받음` : `${person.name}에게 ${formatAmount(Math.abs(person.balance))} 더 줌`}
                    </div>
                </div>
            </div>

            {/* Bar chart */}
            {person.totalSent + person.totalReceived > 0 && (
                <div className="card" style={{ marginBottom: 20, padding: '16px 20px' }}>
                    <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8 }}>지출 / 수입 비율</p>
                    <div style={{ display: 'flex', height: 12, borderRadius: 6, overflow: 'hidden', background: 'var(--border-color)' }}>
                        <div style={{ width: `${sentRatio}%`, background: 'var(--color-sent)', transition: 'width 0.5s' }} />
                        <div style={{ flex: 1, background: 'var(--color-received)' }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginTop: 4, color: 'var(--text-muted)' }}>
                        <span>지출 {sentRatio}%</span>
                        <span>수입 {100 - sentRatio}%</span>
                    </div>
                </div>
            )}

            {/* Memo */}
            {person.memo && (
                <div className="card" style={{ marginBottom: 20, padding: '16px 20px' }}>
                    <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 4 }}>📝 메모</p>
                    <p style={{ fontSize: 14 }}>{person.memo}</p>
                </div>
            )}

            {/* History */}
            <div className="card">
                <div className="card-header">
                    <span className="card-title">🕒 경조사 내역 ({person.events?.length || 0}건)</span>
                    <button className="btn btn-primary btn-sm" onClick={() => navigate('/events/new')}>+ 내역 등록</button>
                </div>
                <div className="table-wrapper">
                    {!person.events?.length ? (
                        <div className="empty-state"><div className="empty-icon">📋</div><h3>내역이 없습니다</h3></div>
                    ) : (
                        <table>
                            <thead>
                                <tr><th>날짜</th><th>유형</th><th>구분</th><th>금액</th><th>메모</th></tr>
                            </thead>
                            <tbody>
                                {person.events.map(e => (
                                    <tr key={e.id}>
                                        <td>{formatShortDate(e.eventDate)}</td>
                                        <td>{EVENT_TYPE_EMOJIS[e.type]} {EVENT_TYPE_LABELS[e.type]}</td>
                                        <td><span className={`badge badge-${e.direction.toLowerCase()}`}>{DIRECTION_LABELS[e.direction]}</span></td>
                                        <td className={e.direction === 'SENT' ? 'amount-sent' : 'amount-received'}>
                                            {e.direction === 'SENT' ? '-' : '+'}{formatAmount(e.amount)}
                                        </td>
                                        <td style={{ color: 'var(--text-muted)', fontSize: 13 }}>{e.memo || '-'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}
