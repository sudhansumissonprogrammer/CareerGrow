import React, { createContext, useCallback, useContext, useMemo, useState } from "react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback((message, type = "info") => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const toast = { id, message, type };
    setToasts((current) => [...current, toast]);

    window.setTimeout(() => {
      removeToast(id);
    }, 4000);
  }, [removeToast]);

  const showSuccess = useCallback((message) => showToast(message, "success"), [showToast]);
  const showError = useCallback((message) => showToast(message, "error"), [showToast]);

  const value = useMemo(
    () => ({ showToast, showSuccess, showError }),
    [showToast, showSuccess, showError]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed inset-x-0 top-5 z-50 flex justify-center px-4 sm:justify-end sm:px-6 pointer-events-none">
        <div className="flex w-full max-w-sm flex-col gap-3">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              className={`pointer-events-auto rounded-3xl border border-slate-200 bg-white p-4 shadow-2xl shadow-slate-900/10 transition duration-200 ${
                toast.type === "success"
                  ? "border-emerald-200 bg-emerald-50"
                  : toast.type === "error"
                  ? "border-rose-200 bg-rose-50"
                  : "border-slate-200 bg-white"
              }`}
            >
              <p className="text-sm font-semibold text-slate-900">{toast.type === "success" ? "Success" : toast.type === "error" ? "Error" : "Notice"}</p>
              <p className="mt-1 text-sm leading-6 text-slate-700">{toast.message}</p>
            </div>
          ))}
        </div>
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
