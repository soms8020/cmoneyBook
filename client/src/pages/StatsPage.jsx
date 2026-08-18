import { useEffect, useState } from 'react';
import { api } from '../api/client';
import { formatAmount, EVENT_TYPE_LABELS, EVENT_TYPE_EMOJIS, RELATIONSHIP_LABELS, RELATIONSHIP_COLORS } from '../constants';
import { Loading } from '../components/common';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell
} from 'recharts';

export default function StatsPage() {
    const [year, setYear] = useState(new Date().getFullYear());
    const [monthly, setMonthly] = useState([]);
    const [byType, setByType] = useState([]);
    const [byRel, setByRel] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        Promise.all([
            api.stats.monthly({ year }),
            api.stats.byType(),
            api.stats.byRelationship(),
        ]).then(([m, t, r]) => {
            setMonthly(m.data);
            setByType(t.data.sort((a, b) => (b.count || 0) - (a.count || 0)));
            setByRel(r.data);
        }).finally(() => setLoading(false));
    }, [year]);

    const pieData = byRel.map(r => ({
        name: RELATIONSHIP_LABELS[r.relationship],
        value: (r.totalSent || 0) + (r.totalReceived || 0),
        color: RELATIONSHIP_COLORS[r.relationship] || '#94a3b8',
    })).filter(d => d.value > 0);

    const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

    if (loading) return <Loading />;

    return (
        <div>
            <div className="page-header">
                <div><h2>통계</h2><p>경조사비 통계 분석</p></div>
                <select className="form-control" style={{ width: 120 }} value={year} onChange={e => setYear(Number(e.target.value))}>
                    {years.map(y => <option key={y} value={y}>{y}년</option>)}
                </select>
            </div>

            {/* Monthly Chart */}
            <div className="card" style={{ marginBottom: 20 }}>
                <div className="card-header"><span className="card-title">📅 {year}년 월별 현황</span></div>
                <div className="card-body">
                    {monthly.length === 0 ? (
                        <div className="empty-state"><div className="empty-icon">📅</div><h3>{year}년 데이터가 없습니다</h3></div>
                    ) : (
                        <ResponsiveContainer width="100%" height={280}>
                            <BarChart data={monthly} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                                <YAxis tick={{ fontSize: 12 }} tickFormatter={v => `${(v / 10000).toFixed(0)}만`} />
                                <Tooltip formatter={v => formatAmount(v)} />
                                <Legend />
                                <Bar dataKey="sent" name="지출" fill="#ef4444" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="received" name="수입" fill="#22c55e" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
                {/* By Type */}
                <div className="card">
                    <div className="card-header"><span className="card-title">🎉 경조사 유형별 통계</span></div>
                    <div className="table-wrapper">
                        {byType.length === 0 ? (
                            <div className="empty-state"><div className="empty-icon">🎉</div><h3>데이터 없음</h3></div>
                        ) : (
                            <table>
                                <thead><tr><th>유형</th><th>건수</th><th>평균</th><th>최소~최대</th></tr></thead>
                                <tbody>
                                    {byType.map(t => (
                                        <tr key={t.type}>
                                            <td>{EVENT_TYPE_EMOJIS[t.type]} {EVENT_TYPE_LABELS[t.type]}</td>
                                            <td>{t.count}건</td>
                                            <td style={{ fontWeight: 600 }}>{formatAmount(t.avgAmount)}</td>
                                            <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                                                {formatAmount(t.minAmount)} ~ {formatAmount(t.maxAmount)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>

                {/* By Relationship */}
                <div className="card">
                    <div className="card-header"><span className="card-title">👥 관계별 통계</span></div>
                    <div className="card-body">
                        {pieData.length === 0 ? (
                            <div className="empty-state"><div className="empty-icon">👥</div><h3>데이터 없음</h3></div>
                        ) : (
                            <>
                                <ResponsiveContainer width="100%" height={200}>
                                    <PieChart>
                                        <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} dataKey="value" paddingAngle={3}
                                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                            labelLine={false}>
                                            {pieData.map((d, i) => <Cell key={i} fill={d.color} />)}
                                        </Pie>
                                        <Tooltip formatter={v => formatAmount(v)} />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="table-wrapper" style={{ marginTop: 12 }}>
                                    <table>
                                        <thead><tr><th>관계</th><th>지출</th><th>수입</th><th>건수</th></tr></thead>
                                        <tbody>
                                            {byRel.filter(r => (r.totalSent || 0) + (r.totalReceived || 0) > 0).map(r => (
                                                <tr key={r.relationship}>
                                                    <td>{RELATIONSHIP_LABELS[r.relationship]}</td>
                                                    <td className="amount-sent">-{formatAmount(r.totalSent || 0)}</td>
                                                    <td className="amount-received">+{formatAmount(r.totalReceived || 0)}</td>
                                                    <td>{r.count}건</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
