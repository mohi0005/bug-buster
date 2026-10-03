import React from 'react';
import { AlertTriangle, RefreshCw, X } from 'lucide-react';

interface ErrorAlertProps {
  message: string;
  onRetry?: () => void;
  onDismiss?: () => void;
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({
  message,
  onRetry,
  onDismiss,
}) => {
  return (
    <div className="w-full rounded-2xl border border-rose-500/30 bg-rose-950/20 backdrop-blur-sm p-4 sm:p-5 flex items-start gap-3 sm:gap-4 text-rose-200 animate-fade-in">
      <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400 flex-shrink-0 mt-0.5">
        <AlertTriangle className="w-5 h-5" />
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold text-rose-100 mb-0.5">
          Analysis Encountered an Error
        </h4>
        <p className="text-xs text-rose-300/90 leading-relaxed break-words">
          {message}
        </p>

        <div className="mt-3 flex items-center gap-3">
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-medium transition-colors shadow-sm"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry Analysis</span>
            </button>
          )}
          {onDismiss && (
            <button
              type="button"
              onClick={onDismiss}
              className="text-xs text-rose-400 hover:text-rose-200 transition-colors"
            >
              Dismiss
            </button>
          )}
        </div>
      </div>

      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="text-rose-400 hover:text-rose-200 p-1 rounded-lg transition-colors flex-shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
