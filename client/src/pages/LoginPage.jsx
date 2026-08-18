import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../components/common';

export default function LoginPage() {
    const { login, user, loading } = useAuth();
    const toast = useToast();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (loading) return null;
    if (user) return <Navigate to="/" replace />; // 이미 로그인된 경우 메인으로 리다이렉트

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.email || !formData.password) {
            toast.error('이메일과 비밀번호를 입력해주세요.');
            return;
        }

        setIsSubmitting(true);
        try {
            const success = await login(formData.email, formData.password);
            if (success) {
                toast.success('로그인 되었습니다.');
            }
        } catch (error) {
            toast.error(error.message || '로그인에 실패했습니다.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="auth-container login-theme">
            <div className="auth-card">
                <div className="auth-header">
                    <div className="auth-icon">
                        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                        </svg>
                    </div>
                    <h2>환영합니다</h2>
                    <p>서비스 이용을 위해 로그인해주세요</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label className="form-label">이메일</label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                            className="form-control"
                            placeholder="name@example.com"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">비밀번호</label>
                        <input
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                            className="form-control"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn btn-primary btn-full auth-submit"
                    >
                        {isSubmitting ? '진행 중...' : '로그인'}
                    </button>
                </form>

                <div className="auth-footer">
                    <span>계정이 없으신가요? </span>
                    <Link to="/register">회원가입</Link>
                </div>
            </div>
        </div>
    );
}
