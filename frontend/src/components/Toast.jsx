import React from 'react';
import {
  IoCheckmarkCircle,
  IoCloseCircle,
  IoWarning,
  IoInformationCircle,
  IoClose,
} from 'react-icons/io5';
import { useToastStore } from '../store/useToastStore';

const Toast = () => {
  const { toasts, removeToast } = useToastStore();

  if (!toasts || toasts.length === 0) return null;

  const getTypeStyles = (type) => {
    switch (type) {
      case 'error':
        return {
          container: 'bg-white border-l-4 border-rose-500 text-gray-800 shadow-lg',
          iconBg: 'bg-rose-100 text-rose-600',
          icon: <IoCloseCircle className="w-5 h-5" />,
        };
      case 'warning':
        return {
          container: 'bg-white border-l-4 border-amber-500 text-gray-800 shadow-lg',
          iconBg: 'bg-amber-100 text-amber-600',
          icon: <IoWarning className="w-5 h-5" />,
        };
      case 'info':
        return {
          container: 'bg-white border-l-4 border-blue-500 text-gray-800 shadow-lg',
          iconBg: 'bg-blue-100 text-blue-600',
          icon: <IoInformationCircle className="w-5 h-5" />,
        };
      case 'success':
      default:
        return {
          container: 'bg-white border-l-4 border-emerald-500 text-gray-800 shadow-lg',
          iconBg: 'bg-emerald-100 text-emerald-600',
          icon: <IoCheckmarkCircle className="w-5 h-5" />,
        };
    }
  };

  return (
    <div className="fixed top-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const style = getTypeStyles(toast.type);

        return (
          <div
            key={toast.id}
            role="alert"
            className={`pointer-events-auto flex items-center gap-3 p-4 rounded-xl border border-gray-100 transition-all duration-200 ease-out transform translate-y-0 ${style.container}`}
          >
            <div className={`p-1.5 rounded-lg shrink-0 ${style.iconBg}`}>
              {style.icon}
            </div>

            <div className="flex-1 text-sm font-medium leading-5 pt-0.5 text-gray-800 break-words">
              {toast.message}
            </div>

            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              className="text-gray-400 hover:text-gray-600 p-1 rounded-md transition-colors cursor-pointer shrink-0"
              aria-label="Close notification"
            >
              <IoClose className="w-5 h-5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default Toast;
