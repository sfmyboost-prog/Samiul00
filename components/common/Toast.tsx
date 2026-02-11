
import React, { useEffect } from 'react';
import { CheckCircle2, X, AlertCircle } from './Icons';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = {
    success: 'bg-green-600',
    error: 'bg-red-600',
    info: 'bg-blue-600'
  }[type];

  const Icon = {
    success: CheckCircle2,
    error: AlertCircle,
    info: AlertCircle
  }[type];

  return (
    <div className={`fixed bottom-8 right-8 z-[100] flex items-center gap-3 px-6 py-4 text-white rounded-xl shadow-2xl animate-in slide-in-from-right-10 duration-300 ${bgColor}`}>
      <Icon size={20} />
      <span className="text-sm font-bold">{message}</span>
      <button onClick={onClose} className="ml-4 p-1 hover:bg-white/20 rounded-full transition-colors">
        <X size={16} />
      </button>
    </div>
  );
};

export default Toast;
