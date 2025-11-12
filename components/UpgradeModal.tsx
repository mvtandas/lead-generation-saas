import React from 'react';
import { PlanType } from '../types/subscription';
import { PLANS, PLAN_FEATURE_LIST } from '../constants/plans';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlan: PlanType;
  suggestedPlan?: PlanType;
  reason?: string;
  onUpgrade: (plan: PlanType) => void;
}

const UpgradeModal: React.FC<UpgradeModalProps> = ({
  isOpen,
  onClose,
  currentPlan,
  suggestedPlan = 'pro',
  reason,
  onUpgrade
}) => {
  if (!isOpen) return null;

  const suggested = PLANS[suggestedPlan];
  const features = PLAN_FEATURE_LIST[suggestedPlan];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
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
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Planınızı Yükseltin
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Daha fazla özellik ve limite erişin
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Reason */}
          {reason && (
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
                <p className="text-sm text-yellow-800 dark:text-yellow-200">{reason}</p>
              </div>
            </div>
          )}
        </div>

        {/* Plan Comparison */}
        <div className="p-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Current Plan */}
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <div className="text-center mb-4">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Mevcut Plan
                </span>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {PLANS[currentPlan].name}
                </h3>
                <div className="mt-2">
                  <span className="text-3xl font-bold text-gray-900 dark:text-white">
                    ${PLANS[currentPlan].price}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400">/ay</span>
                </div>
              </div>

              <div className="space-y-2">
                {PLAN_FEATURE_LIST[currentPlan].slice(0, 5).map((feature, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <svg
                      className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-sm text-gray-600 dark:text-gray-400">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Suggested Plan */}
            <div className="border-2 border-blue-500 rounded-lg p-6 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-1 rounded-full text-xs font-semibold">
                  Önerilen
                </span>
              </div>

              <div className="text-center mb-4">
                <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                  Yükselt
                </span>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {suggested.name}
                </h3>
                <div className="mt-2">
                  <span className="text-3xl font-bold text-gray-900 dark:text-white">
                    ${suggested.price}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400">/ay</span>
                </div>
                {suggested.price > 0 && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Günlük sadece ${(suggested.price / 30).toFixed(2)}
                  </p>
                )}
              </div>

              <div className="space-y-2 mb-6">
                {features.slice(0, 7).map((feature, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <svg
                      className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => {
                  onUpgrade(suggestedPlan);
                  onClose();
                }}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105"
              >
                {suggested.name} Planına Yükselt
              </button>
            </div>
          </div>

          {/* All Plans Link */}
          <div className="mt-6 text-center">
            <button
              onClick={() => {
                window.location.hash = '#pricing';
                onClose();
              }}
              className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium"
            >
              Tüm planları görüntüle →
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
            <span>
              İstediğiniz zaman iptal edebilirsiniz • Anında aktivasyon • 30 gün para iade garantisi
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpgradeModal;

