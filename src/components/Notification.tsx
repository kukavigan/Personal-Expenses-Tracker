import { CheckCircle, XCircle } from 'lucide-react';
import { useEffect } from 'react';

interface NotificationProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

export function Notification({ message, type, onClose }: NotificationProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-6 py-4 rounded-lg shadow-lg transform transition-all ${
        type === 'success'
          ? 'bg-green-50 text-green-800 border border-green-200'
          : 'bg-red-50 text-red-800 border border-red-200'
      }`}
    >
      {type === 'success' ? (
        <CheckCircle size={24} className="flex-shrink-0" />
      ) : (
        <XCircle size={24} className="flex-shrink-0" />
      )}
      <p className="font-medium">{message}</p>
    </div>
  );
}
