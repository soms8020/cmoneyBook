import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../components/common';

export default function RegisterPage() {
    const { register, user, loading } = useAuth();
    const toast = useToast();
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (loading) return null;
    if (user) return <Navigate to="/" replace />; // 이미 로그인된 경우 메인으로 리다이렉트

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name || !formData.email || !formData.password) {
            toast.error('모든 필드를 입력해주세요.');
            return;
        }

        if (formData.password.length < 6) {
            toast.error('비밀번호는 6자 이상이어야 합니다.');
            return;
        }

        setIsSubmitting(true);
        try {
            const success = await register(formData.name, formData.email, formData.password);
            if (success) {
                toast.success('회원가입이 완료되었습니다.');
            }
        } catch (error) {
            toast.error(error.message || '회원가입에 실패했습니다.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="auth-container register-theme">
            <div className="auth-card">
                <div className="auth-header">
                    <div className="auth-icon outline">
                        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                    </div>
                    <h2>계정 생성</h2>
                    <p>새로운 계정을 만들어 시작하세요</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label className="form-label">이름</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            className="form-control"
                            placeholder="홍길동"
                            required
                        />
                    </div>
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
                            placeholder="최소 6자 이상"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn btn-primary btn-full auth-submit"
                    >
                        {isSubmitting ? '진행 중...' : '가입하기'}
                    </button>
                </form>

                <div className="auth-footer">
                    <span>이미 계정이 있으신가요? </span>
                    <Link to="/login">로그인</Link>
                </div>
            </div>
        </div>
    );
}
