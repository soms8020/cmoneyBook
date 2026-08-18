import { NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const NAV_ITEMS = [
    { to: '/', icon: '📊', label: '대시보드', exact: true },
    { to: '/events', icon: '📝', label: '경조사 내역' },
    { to: '/persons', icon: '👥', label: '인물 관리' },
    { to: '/stats', icon: '📈', label: '통계' },
];

export function Layout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="layout">
            {/* Sidebar overlay (mobile) */}
            <div
                className={`sidebar-overlay ${sidebarOpen ? 'visible' : ''}`}
                onClick={() => setSidebarOpen(false)}
            />
            {/* Sidebar */}
            <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
                <div className="sidebar-logo">
                    <div className="logo-icon">💝</div>
                    <div>
                        <h1>경조사 장부</h1>
                        <p>상부상조 기록</p>
                    </div>
                </div>
                <nav className="sidebar-nav">
                    {NAV_ITEMS.map(item => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            end={item.exact}
                            className={({ isActive }) => isActive ? 'active' : ''}
                            onClick={() => setSidebarOpen(false)}
                        >
                            <span className="nav-icon">{item.icon}</span>
                            {item.label}
                        </NavLink>
                    ))}
                </nav>
                <div style={{ padding: '16px 20px', marginTop: 'auto' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', padding: '0 8px' }}>
                        <div style={{ fontSize: '14px' }}>
                            <div style={{ fontWeight: 'bold', color: '#334155' }}>{user?.name}</div>
                            <div style={{ fontSize: '12px', color: '#64748b' }}>{user?.email}</div>
                        </div>
                        <button
                            onClick={handleLogout}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: '4px' }}
                            title="로그아웃"
                        >
                            <svg style={{ width: '20px', height: '20px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                        </button>
                    </div>
                    <button
                        className="btn btn-primary btn-full"
                        style={{ fontSize: 14 }}
                        onClick={() => { navigate('/events/new'); setSidebarOpen(false); }}
                    >
                        + 내역 등록
                    </button>
                </div>
            </aside>

            {/* Main */}
            <div className="main-content">
                <header className="top-header">
                    <button className="menu-btn" onClick={() => setSidebarOpen(true)}>☰</button>
                    <span className="header-title">경조사 장부</span>
                    <div className="header-spacer" />
                    <button
                        className="btn btn-primary btn-sm"
                        onClick={() => navigate('/events/new')}
                    >
                        + 내역 등록
                    </button>
                </header>
                <main className="page-wrapper">{children}</main>
            </div>

            {/* Bottom Nav (mobile) */}
            <nav className="bottom-nav">
                {NAV_ITEMS.map(item => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        end={item.exact}
                        className={({ isActive }) => isActive ? 'active' : ''}
                    >
                        <span className="nav-icon">{item.icon}</span>
                        {item.label}
                    </NavLink>
                ))}
            </nav>
        </div>
    );
}
