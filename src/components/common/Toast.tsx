import { useEffect, useState } from 'react';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastProps {
  messages?: ToastMessage[];
  message?: string;
  type?: ToastType;
  onClose?: () => void;
  onRemove?: (id: string) => void;
}

export default function Toast({ messages, message, type = 'info', onClose, onRemove }: ToastProps) {
  // 단순 메시지 모드
  if (message && onClose) {
    return (
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 space-y-2">
        <ToastItem
          toast={{ id: 'single', message, type }}
          onRemove={() => onClose()}
        />
      </div>
    );
  }

  // 다중 메시지 모드
  if (messages && onRemove) {
    return (
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 space-y-2">
        {messages.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
        ))}
      </div>
    );
  }

  return null;
}

function ToastItem({
  toast,
  onRemove
}: {
  toast: ToastMessage;
  onRemove: (id: string) => void;
}) {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => onRemove(toast.id), 300);
    }, 3000);

    return () => clearTimeout(timer);
  }, [toast.id, onRemove]);

  const typeStyles = {
    success: 'bg-green-500 text-white',
    error: 'bg-red-500 text-white',
    info: 'bg-blue-500 text-white'
  };

  return (
    <div
      className={`px-4 py-3 rounded-lg shadow-lg transition-all duration-300 ${
        typeStyles[toast.type]
      } ${isExiting ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}`}
    >
      <p className="text-sm font-medium">{toast.message}</p>
    </div>
  );
}
