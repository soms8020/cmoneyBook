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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-pink-50 px-4">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden shadow-purple-100/50 border border-slate-100">
                <div className="p-8 sm:p-10">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-purple-50 text-purple-500 mb-6">
                            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-black text-slate-800 tracking-tight">계정 생성</h2>
                        <p className="text-slate-500 mt-2 text-sm font-medium">새로운 계정을 만들어 시작하세요</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">이름</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all duration-200 bg-slate-50/50"
                                placeholder="홍길동"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">이메일</label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all duration-200 bg-slate-50/50"
                                placeholder="name@example.com"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">비밀번호</label>
                            <input
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all duration-200 bg-slate-50/50"
                                placeholder="최소 6자 이상"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-4 mt-6 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200 shadow-purple-200 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-[0.98]"
                        >
                            {isSubmitting ? '진행 중...' : '가입하기'}
                        </button>
                    </form>
                </div>

                <div className="px-8 py-5 bg-slate-50 border-t border-slate-100 text-center">
                    <span className="text-sm text-slate-500 font-medium">이미 계정이 있으신가요? </span>
                    <Link to="/login" className="text-sm font-bold text-purple-600 hover:text-purple-800 transition-colors">
                        로그인
                    </Link>
                </div>
            </div>
        </div>
    );
}
