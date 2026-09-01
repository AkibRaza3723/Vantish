import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, CheckCircle, XCircle, Info, AlertTriangle, Trash2 } from 'lucide-react';
import './Toast.css';

// ─── Toast Context ───────────────────────────────────────────────────────────

const ToastContext = createContext(null);

const TOAST_ICONS = {
  success: <CheckCircle size={17} />,
  error:   <XCircle size={17} />,
  info:    <Info size={17} />,
  warning: <AlertTriangle size={17} />,
};

let toastIdCounter = 0;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const [confirmState, setConfirmState] = useState(null); // { title, message, variant, resolve }

  const removeToast = useCallback((id) => {
    setToasts(prev =>
      prev.map(t => t.id === id ? { ...t, exiting: true } : t)
    );
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 260);
  }, []);

  const showToast = useCallback((message, type = 'info', duration = 3800) => {
    const id = ++toastIdCounter;
    setToasts(prev => [...prev, { id, message, type, exiting: false }]);
    if (duration > 0) {
      setTimeout(() => removeToast(id), duration);
    }
    return id;
  }, [removeToast]);

  const toast = {
    success: (msg, dur) => showToast(msg, 'success', dur),
    error:   (msg, dur) => showToast(msg, 'error', dur),
    info:    (msg, dur) => showToast(msg, 'info', dur),
    warning: (msg, dur) => showToast(msg, 'warning', dur),
  };

  // ─── Confirm Dialog ────────────────────────────────────────────────────────
  const confirm = useCallback(({ title, message, variant = 'danger', confirmText = 'Confirm', cancelText = 'Cancel' }) => {
    return new Promise((resolve) => {
      setConfirmState({ title, message, variant, confirmText, cancelText, resolve });
    });
  }, []);

  const handleConfirmClose = (result) => {
    if (confirmState?.resolve) confirmState.resolve(result);
    setConfirmState(null);
  };

  return (
    <ToastContext.Provider value={{ toast, confirm }}>
      {children}

      {/* Toast Portal */}
      {createPortal(
        <div className="toast-container" aria-live="polite">
          {toasts.map(t => (
            <div
              key={t.id}
              className={`toast toast-${t.type} ${t.exiting ? 'toast-exit' : ''}`}
              role="alert"
            >
              <span className="toast-icon">{TOAST_ICONS[t.type]}</span>
              <span className="toast-message">{t.message}</span>
              <button className="toast-close" onClick={() => removeToast(t.id)} aria-label="Dismiss">
                <X size={13} />
              </button>
            </div>
          ))}
        </div>,
        document.body
      )}

      {/* Confirm Dialog Portal */}
      {confirmState && createPortal(
        <div className="confirm-dialog-backdrop" onClick={() => handleConfirmClose(false)}>
          <div className="confirm-dialog" onClick={e => e.stopPropagation()}>
            <div className={`confirm-dialog-icon ${confirmState.variant === 'danger' ? 'danger' : 'info'}`}>
              {confirmState.variant === 'danger' ? <Trash2 size={24} /> : <Info size={24} />}
            </div>
            <h3>{confirmState.title}</h3>
            <p>{confirmState.message}</p>
            <div className="confirm-dialog-actions">
              <button className="btn-confirm-cancel" onClick={() => handleConfirmClose(false)}>
                {confirmState.cancelText}
              </button>
              <button
                className={`btn-confirm-ok ${confirmState.variant === 'danger' ? 'danger' : 'primary'}`}
                onClick={() => handleConfirmClose(true)}
              >
                {confirmState.confirmText}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
  return ctx;
};
