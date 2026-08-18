import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { formatAmount, formatShortDate, DIRECTION_LABELS, EVENT_TYPE_LABELS, EVENT_TYPE_EMOJIS, RELATIONSHIP_LABELS, RELATIONSHIP_COLORS } from '../constants';
import { Loading, EmptyState } from '../components/common';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
    PieChart, Pie, Cell, ResponsiveContainer
} from 'recharts';

export default function DashboardPage() {
    const [summary, setSummary] = useState(null);
    const [monthly, setMonthly] = useState([]);
    const [byRel, setByRel] = useState([]);
    const [recent, setRecent] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        Promise.all([
            api.stats.summary(),
            api.stats.monthly(),
            api.stats.byRelationship(),
            api.events.list({ limit: 5, sort: 'event_date', order: 'desc' }),
        ]).then(([s, m, r, e]) => {
            setSummary(s.data);
            setMonthly(m.data);
            setByRel(r.data);
            setRecent(e.data);
        }).finally(() => setLoading(false));
    }, []);

    if (loading) return <Loading />;

    const pieData = byRel.map(r => ({
        name: RELATIONSHIP_LABELS[r.relationship],
        value: (r.totalSent || 0) + (r.totalReceived || 0),
        color: RELATIONSHIP_COLORS[r.relationship] || '#94a3b8',
    })).filter(d => d.value > 0);

    return (
        <div>
            <div className="page-header">
                <div>
                    <h2>대시보드</h2>
                    <p>경조사비 현황을 한눈에 확인하세요</p>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="summary-grid" style={{ marginBottom: 24 }}>
                <div className="summary-card sent">
                    <div className="icon">💸</div>
                    <div className="label">총 지출 (보낸 경조사비)</div>
                    <div className="amount">{formatAmount(summary?.totalSent || 0)}</div>
                    <div className="sub">{summary?.sentCount || 0}건</div>
                </div>
                <div className="summary-card received">
                    <div className="icon">💰</div>
                    <div className="label">총 수입 (받은 경조사비)</div>
                    <div className="amount">{formatAmount(summary?.totalReceived || 0)}</div>
                    <div className="sub">{summary?.receivedCount || 0}건</div>
                </div>
                <div className={`summary-card ${(summary?.balance || 0) >= 0 ? 'balance-pos' : 'balance-neg'}`}>
                    <div className="icon">{(summary?.balance || 0) >= 0 ? '📈' : '📉'}</div>
                    <div className="label">잔액 (수입 - 지출)</div>
                    <div className="amount">{formatAmount(Math.abs(summary?.balance || 0))}</div>
                    <div className="sub">{(summary?.balance || 0) >= 0 ? '더 받음' : '더 줌'}</div>
                </div>
                <div className="summary-card">
                    <div className="icon">📋</div>
                    <div className="label">총 내역 수</div>
                    <div className="amount" style={{ color: 'var(--color-primary)' }}>{summary?.eventCount || 0}건</div>
                    <div className="sub">전체 기간</div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20, marginBottom: 24 }}>
                {/* Monthly Chart */}
                <div className="card">
                    <div className="card-header"><span className="card-title">📅 월별 현황</span></div>
                    <div className="card-body">
                        {monthly.length === 0 ? (
                            <EmptyState icon="📅" title="데이터 없음" description="경조사 내역을 등록하면 차트가 표시됩니다." />
                        ) : (
                            <ResponsiveContainer width="100%" height={220}>
                                <BarChart data={monthly} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                                    <YAxis tick={{ fontSize: 12 }} tickFormatter={v => `${(v / 10000).toFixed(0)}만`} />
                                    <Tooltip formatter={(v) => formatAmount(v)} />
                                    <Legend />
                                    <Bar dataKey="sent" name="지출" fill="#ef4444" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="received" name="수입" fill="#22c55e" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>

                {/* Relationship Pie */}
                <div className="card">
                    <div className="card-header"><span className="card-title">👥 관계별 분포</span></div>
                    <div className="card-body">
                        {pieData.length === 0 ? (
                            <EmptyState icon="👥" title="데이터 없음" />
                        ) : (
                            <>
                                <ResponsiveContainer width="100%" height={160}>
                                    <PieChart>
                                        <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={70}
                                            dataKey="value" paddingAngle={3}>
                                            {pieData.map((d, i) => <Cell key={i} fill={d.color} />)}
                                        </Pie>
                                        <Tooltip formatter={(v) => formatAmount(v)} />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
                                    {pieData.map((d, i) => (
                                        <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12 }}>
                                            <span style={{ width: 8, height: 8, borderRadius: '50%', background: d.color, display: 'inline-block' }} />
                                            {d.name}
                                        </span>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Recent Events */}
            <div className="card">
                <div className="card-header">
                    <span className="card-title">🕒 최근 내역</span>
                    <button className="btn btn-ghost btn-sm" onClick={() => navigate('/events')}>전체 보기 →</button>
                </div>
                <div className="table-wrapper">
                    {recent.length === 0 ? (
                        <EmptyState icon="📝" title="내역이 없습니다" description="첫 경조사비를 기록해보세요"
                            action={<button className="btn btn-primary" onClick={() => navigate('/events/new')}>내역 등록</button>}
                        />
                    ) : (
                        <table>
                            <thead>
                                <tr><th>날짜</th><th>이름</th><th>종류</th><th>구분</th><th>금액</th></tr>
                            </thead>
                            <tbody>
                                {recent.map(e => (
                                    <tr key={e.id} style={{ cursor: 'pointer' }} onClick={() => navigate('/events')}>
                                        <td>{formatShortDate(e.eventDate)}</td>
                                        <td>{e.personName}</td>
                                        <td>{EVENT_TYPE_EMOJIS[e.type]} {EVENT_TYPE_LABELS[e.type]}</td>
                                        <td><span className={`badge badge-${e.direction.toLowerCase()}`}>{DIRECTION_LABELS[e.direction]}</span></td>
                                        <td className={e.direction === 'SENT' ? 'amount-sent' : 'amount-received'}>{formatAmount(e.amount)}</td>
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
