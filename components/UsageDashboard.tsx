import React from 'react';
import { useSubscription } from '../context/SubscriptionContext';
import { PLANS } from '../constants/plans';

const UsageDashboard: React.FC = () => {
  const { plan, usage, getRemainingQuota, getUsagePercentage } = useSubscription();
  const planDetails = PLANS[plan];
  const remaining = getRemainingQuota();
  const percentage = getUsagePercentage();

  const getProgressColor = (percent: number) => {
    if (percent >= 90) return 'bg-red-500';
    if (percent >= 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const formatLimit = (value: number) => {
    return value === -1 ? '∞' : value.toLocaleString();
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Kullanım İstatistikleri
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {planDetails.name} Plan
          </p>
        </div>
        <button
          onClick={() => (window.location.hash = '#pricing')}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
        >
          Planı Yükselt
        </button>
      </div>

      {/* Usage Stats */}
      <div className="space-y-6">
        {/* Searches */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-gray-600 dark:text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Aramalar
              </span>
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {usage.usage.searches.count} / {formatLimit(usage.limits.searches.monthly)}
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className={`${getProgressColor(percentage.searches)} h-2 rounded-full transition-all duration-300`}
              style={{ width: `${Math.min(100, percentage.searches)}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Kalan: {remaining.searches.monthly === -1 ? '∞' : remaining.searches.monthly} aylık,{' '}
            {remaining.searches.daily === -1 ? '∞' : remaining.searches.daily} günlük
          </p>
        </div>

        {/* Enrichments */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-gray-600 dark:text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Zenginleştirmeler
              </span>
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {usage.usage.enrichments.count} / {formatLimit(usage.limits.enrichments.monthly)}
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className={`${getProgressColor(percentage.enrichments)} h-2 rounded-full transition-all duration-300`}
              style={{ width: `${Math.min(100, percentage.enrichments)}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Kalan: {remaining.enrichments.monthly === -1 ? '∞' : remaining.enrichments.monthly}{' '}
            aylık, {remaining.enrichments.daily === -1 ? '∞' : remaining.enrichments.daily} günlük
          </p>
        </div>

        {/* Exports */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-gray-600 dark:text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Export'lar
              </span>
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {usage.usage.exports.count} / {formatLimit(usage.limits.exports.monthly)}
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className={`${getProgressColor(percentage.exports)} h-2 rounded-full transition-all duration-300`}
              style={{ width: `${Math.min(100, percentage.exports)}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Kalan: {remaining.exports.monthly === -1 ? '∞' : remaining.exports.monthly} aylık
            {usage.limits.exports.maxPerExport !== -1 &&
              `, Max ${usage.limits.exports.maxPerExport} lead/export`}
          </p>
        </div>
      </div>

      {/* Period Info */}
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Dönem: {new Date(usage.period.start).toLocaleDateString('tr-TR')} -{' '}
          {new Date(usage.period.end).toLocaleDateString('tr-TR')}
        </p>
      </div>

      {/* Upgrade Alert */}
      {(percentage.searches >= 80 || percentage.enrichments >= 80 || percentage.exports >= 80) && (
        <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <div className="flex items-start gap-3">
            <svg
              className="w-5 h-5 text-yellow-600 dark:text-yellow-500 flex-shrink-0 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-yellow-900 dark:text-yellow-200">
                Limitiniz Dolmak Üzere!
              </h4>
              <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
                Daha fazla özellik ve limit için planınızı yükseltebilirsiniz.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsageDashboard;

