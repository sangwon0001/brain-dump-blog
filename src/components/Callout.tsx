import { ReactNode } from 'react';

type CalloutType = 'note' | 'warning' | 'tip' | 'danger' | 'info';

interface CalloutProps {
  type?: CalloutType;
  title?: string;
  children: ReactNode;
}

const calloutConfig: Record<CalloutType, { icon: string; bgClass: string; borderClass: string; titleClass: string }> = {
  note: {
    icon: '📝',
    bgClass: 'bg-blue-50 dark:bg-blue-950/30',
    borderClass: 'border-blue-200 dark:border-blue-800',
    titleClass: 'text-blue-800 dark:text-blue-300',
  },
  warning: {
    icon: '⚠️',
    bgClass: 'bg-yellow-50 dark:bg-yellow-950/30',
    borderClass: 'border-yellow-200 dark:border-yellow-800',
    titleClass: 'text-yellow-800 dark:text-yellow-300',
  },
  tip: {
    icon: '💡',
    bgClass: 'bg-green-50 dark:bg-green-950/30',
    borderClass: 'border-green-200 dark:border-green-800',
    titleClass: 'text-green-800 dark:text-green-300',
  },
  danger: {
    icon: '🚨',
    bgClass: 'bg-red-50 dark:bg-red-950/30',
    borderClass: 'border-red-200 dark:border-red-800',
    titleClass: 'text-red-800 dark:text-red-300',
  },
  info: {
    icon: 'ℹ️',
    bgClass: 'bg-gray-50 dark:bg-gray-800/50',
    borderClass: 'border-gray-200 dark:border-gray-700',
    titleClass: 'text-gray-800 dark:text-gray-300',
  },
};

const defaultTitles: Record<CalloutType, string> = {
  note: 'Note',
  warning: 'Warning',
  tip: 'Tip',
  danger: 'Danger',
  info: 'Info',
};

export default function Callout({ type = 'note', title, children }: CalloutProps) {
  const config = calloutConfig[type];
  const displayTitle = title || defaultTitles[type];

  return (
    <div
      className={`my-6 rounded-lg border-l-4 p-4 ${config.bgClass} ${config.borderClass}`}
    >
      <div className={`flex items-center gap-2 font-semibold mb-2 ${config.titleClass}`}>
        <span>{config.icon}</span>
        <span>{displayTitle}</span>
      </div>
      <div className="text-[var(--text-secondary)] [&>p]:m-0 [&>p:last-child]:mb-0">
        {children}
      </div>
    </div>
  );
}
