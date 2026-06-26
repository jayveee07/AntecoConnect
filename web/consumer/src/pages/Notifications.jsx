import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell, Receipt, AlertTriangle, Zap, CheckCheck,
  Trash2, Pin, PinOff, ArrowLeft,
} from 'lucide-react';

const STORAGE_KEY = 'anteco_notifications';

const DEFAULT_NOTIFS = [
  { id: 'n1', type: 'bill', title: 'Bill due in 3 days', desc: 'Your electric bill of ₱1,245.00 is due on Jun 30', time: '2 hours ago', unread: true, retained: false },
  { id: 'n2', type: 'outage', title: 'Scheduled maintenance', desc: 'Power interruption on July 2, 9AM–2PM in your area', time: '1 day ago', unread: true, retained: false },
  { id: 'n3', type: 'payment', title: 'Payment confirmed', desc: 'Your payment of ₱1,200.00 was received', time: '3 days ago', unread: false, retained: false },
  { id: 'n4', type: 'usage', title: 'Usage alert', desc: 'Your consumption is 15% higher than last month', time: '5 days ago', unread: false, retained: true },
  { id: 'n5', type: 'outage', title: 'Power restored', desc: 'Power has been restored in your area after maintenance', time: '1 week ago', unread: false, retained: false },
];

function loadNotifications() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return DEFAULT_NOTIFS;
}

function saveNotifications(notifs) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notifs));
}

const typeIcons = { bill: Receipt, outage: AlertTriangle, payment: CheckCheck, usage: Zap };

export default function NotificationsPage() {
  const navigate = useNavigate();
  const [notifs, setNotifs] = React.useState(loadNotifications);
  const [filter, setFilter] = React.useState('all');

  const filtered = notifs.filter((n) => {
    if (filter === 'unread') return n.unread;
    if (filter === 'retained') return n.retained;
    return true;
  });

  const unreadCount = notifs.filter((n) => n.unread).length;
  const retainedCount = notifs.filter((n) => n.retained).length;

  const update = (updater) => {
    setNotifs((prev) => {
      const next = updater(prev);
      saveNotifications(next);
      return next;
    });
  };

  const toggleRead = (id) => {
    update((prev) => prev.map((n) => n.id === id ? { ...n, unread: !n.unread } : n));
  };

  const toggleRetain = (id) => {
    update((prev) => prev.map((n) => n.id === id ? { ...n, retained: !n.retained } : n));
  };

  const remove = (id) => {
    update((prev) => prev.filter((n) => n.id !== id));
  };

  const markAllRead = () => {
    update((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const tabs = [
    { key: 'all', label: 'All', count: notifs.length },
    { key: 'unread', label: 'Unread', count: unreadCount },
    { key: 'retained', label: 'Retained', count: retainedCount },
  ];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all"
        >
          <ArrowLeft className="w-5 h-5 text-gray-500" />
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-bold">Notifications</h1>
          <p className="text-sm text-gray-500">{unreadCount} unread</p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="flex items-center gap-1.5 px-3 py-2 text-sm text-primary-600 dark:text-primary-400 font-medium hover:bg-primary-50 dark:hover:bg-primary-950 rounded-xl transition-all"
          >
            <CheckCheck className="w-4 h-4" />
            Mark all read
          </button>
        )}
      </div>

      <div className="flex gap-2 mb-4">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-3 py-1.5 text-sm rounded-lg font-medium transition-all ${
              filter === tab.key
                ? 'bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300'
                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            {tab.label}
            {tab.count > 0 && (
              <span className="ml-1.5 text-xs opacity-60">({tab.count})</span>
            )}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <Bell className="w-12 h-12 mb-4 opacity-50" />
          <p className="text-sm">No {filter !== 'all' ? filter : ''} notifications</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((n) => {
            const Icon = typeIcons[n.type] || Bell;
            return (
              <div
                key={n.id}
                className={`group flex items-start gap-3 p-4 rounded-2xl border transition-all ${
                  n.unread
                    ? 'bg-primary-50/50 dark:bg-primary-950/30 border-primary-200 dark:border-primary-800'
                    : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800'
                } ${n.retained ? 'ring-2 ring-primary-300 dark:ring-primary-700' : ''}`}
              >
                <div className={`p-2 rounded-xl shrink-0 ${
                  n.unread
                    ? 'bg-primary-100 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-400'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={`text-sm ${n.unread ? 'font-semibold' : ''}`}>{n.title}</p>
                    <span className="text-xs text-gray-400 whitespace-nowrap shrink-0">{n.time}</span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">{n.desc}</p>
                  <div className="flex items-center gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => toggleRead(n.id)}
                      className={`text-xs font-medium px-2 py-1 rounded-lg transition-all ${
                        n.unread
                          ? 'text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-950'
                          : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                    >
                      {n.unread ? 'Mark read' : 'Mark unread'}
                    </button>
                    <button
                      onClick={() => toggleRetain(n.id)}
                      className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-lg transition-all ${
                        n.retained
                          ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950'
                          : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                    >
                      {n.retained ? <PinOff className="w-3 h-3" /> : <Pin className="w-3 h-3" />}
                      {n.retained ? 'Unpin' : 'Retain'}
                    </button>
                    <button
                      onClick={() => remove(n.id)}
                      className="flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950 transition-all"
                    >
                      <Trash2 className="w-3 h-3" />
                      Remove
                    </button>
                  </div>
                </div>
                {n.retained && (
                  <div className="shrink-0">
                    <Pin className="w-4 h-4 text-primary-500" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
