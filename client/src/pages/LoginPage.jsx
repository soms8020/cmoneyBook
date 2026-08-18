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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-sky-50 px-4">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden shadow-indigo-100/50 border border-slate-100">
                <div className="p-8 sm:p-10">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-500 mb-6">
                            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-black text-slate-800 tracking-tight">환영합니다</h2>
                        <p className="text-slate-500 mt-2 text-sm font-medium">서비스 이용을 위해 로그인해주세요</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">이메일</label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all duration-200 bg-slate-50/50"
                                placeholder="name@example.com"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">비밀번호</label>
                            <input
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                                className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all duration-200 bg-slate-50/50"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-4 mt-2 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 shadow-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-[0.98]"
                        >
                            {isSubmitting ? '진행 중...' : '로그인'}
                        </button>
                    </form>
                </div>

                <div className="px-8 py-5 bg-slate-50 border-t border-slate-100 text-center">
                    <span className="text-sm text-slate-500 font-medium">계정이 없으신가요? </span>
                    <Link to="/register" className="text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors">
                        회원가입
                    </Link>
                </div>
            </div>
        </div>
    );
}
