import { useState, useCallback } from 'react';
import { createPortal } from 'react-dom';

// ===== Toast =====
let _showToast = null;
export function useToast() {
    return { success: (msg) => _showToast?.('success', msg), error: (msg) => _showToast?.('error', msg) };
}
export function ToastContainer() {
    const [toasts, setToasts] = useState([]);
    _showToast = (type, message) => {
        const id = Date.now();
        setToasts(p => [...p, { id, type, message }]);
        setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3000);
    };
    return createPortal(
        <div className="toast-container">
            {toasts.map(t => (
                <div key={t.id} className={`toast toast-${t.type}`}>
                    {t.type === 'success' ? '✅' : '❌'} {t.message}
                </div>
            ))}
        </div>,
        document.body
    );
}

// ===== Modal =====
export function Modal({ isOpen, onClose, title, children, size = '' }) {
    if (!isOpen) return null;
    return createPortal(
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
            <div className={`modal ${size ? `modal-${size}` : ''}`}>
                <div className="modal-header">
                    <span className="modal-title">{title}</span>
                    <button className="modal-close" onClick={onClose}>×</button>
                </div>
                {children}
            </div>
        </div>,
        document.body
    );
}

// ===== Confirm Dialog =====
export function ConfirmDialog({ isOpen, onClose, onConfirm, title, message, danger }) {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
            <div className="modal-body">
                <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>{message}</p>
            </div>
            <div className="modal-footer">
                <button className="btn btn-secondary" onClick={onClose}>취소</button>
                <button className={`btn ${danger ? 'btn-danger' : 'btn-primary'}`} onClick={onConfirm}>확인</button>
            </div>
        </Modal>
    );
}

// ===== Loading =====
export function Loading() {
    return <div className="loading-wrapper"><div className="spinner" /></div>;
}

// ===== Empty State =====
export function EmptyState({ icon = '📋', title, description, action }) {
    return (
        <div className="empty-state">
            <div className="empty-icon">{icon}</div>
            <h3>{title}</h3>
            {description && <p>{description}</p>}
            {action}
        </div>
    );
}

// ===== Pagination =====
export function Pagination({ page, totalPages, onChange }) {
    if (totalPages <= 1) return null;
    return (
        <div className="pagination">
            <button className="page-btn" disabled={page <= 1} onClick={() => onChange(page - 1)}>‹</button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                const p = Math.max(1, Math.min(page - 2, totalPages - 4)) + i;
                return (
                    <button key={p} className={`page-btn ${p === page ? 'active' : ''}`} onClick={() => onChange(p)}>
                        {p}
                    </button>
                );
            })}
            <button className="page-btn" disabled={page >= totalPages} onClick={() => onChange(page + 1)}>›</button>
        </div>
    );
}
