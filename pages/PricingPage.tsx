import React, { useState } from 'react';
import { useSubscription } from '../context/SubscriptionContext';
import { PlanType } from '../types/subscription';
import { PLANS, PLAN_FEATURE_LIST } from '../constants/plans';
import ThemeToggle from '../components/ThemeToggle';

const PricingPage: React.FC = () => {
  const { plan: currentPlan, upgradePlan } = useSubscription();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleUpgrade = async (planId: PlanType) => {
    if (planId === currentPlan) return;

    setIsProcessing(true);

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    upgradePlan(planId);
    setIsProcessing(false);

    // Show success message and redirect
    alert(`Başarıyla ${PLANS[planId].name} planına yükseltildiniz!`);
    window.location.hash = '#dashboard';
  };

  const getYearlyPrice = (monthlyPrice: number) => {
    return Math.floor(monthlyPrice * 12 * 0.8); // 20% discount
  };

  const getDisplayPrice = (planId: PlanType) => {
    const plan = PLANS[planId];
    if (billingCycle === 'yearly') {
      return {
        amount: getYearlyPrice(plan.price),
        period: '/yıl',
        savings: plan.price * 12 * 0.2
      };
    }
    return {
      amount: plan.price,
      period: '/ay',
      savings: 0
    };
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">LeadGen AI</h1>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <button
                onClick={() => (window.location.hash = '#dashboard')}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                Dashboard'a Dön
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <div className="bg-gradient-to-br from-blue-600 to-purple-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            İşinize Uygun Planı Seçin
          </h2>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-8">
            Her büyüklükteki işletme için esnek ve uygun fiyatlı paketler
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-lg p-1">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2 rounded-md font-medium transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-white text-blue-600'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              Aylık
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-6 py-2 rounded-md font-medium transition-all relative ${
                billingCycle === 'yearly'
                  ? 'bg-white text-blue-600'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              Yıllık
              <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
                %20 İndirim
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {Object.values(PLANS).map((plan) => {
            const displayPrice = getDisplayPrice(plan.id);
            const isCurrentPlan = plan.id === currentPlan;
            const isPlanHighlighted = plan.highlighted;

            return (
              <div
                key={plan.id}
                className={`bg-white dark:bg-gray-800 rounded-2xl shadow-xl ${
                  isPlanHighlighted ? 'ring-2 ring-blue-500 scale-105' : ''
                } relative`}
              >
                {isPlanHighlighted && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                      En Popüler
                    </span>
                  </div>
                )}

                <div className="p-8">
                  {/* Plan Header */}
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      {plan.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
                      {plan.description}
                    </p>

                    {/* Price */}
                    <div className="mb-4">
                      <span className="text-4xl font-bold text-gray-900 dark:text-white">
                        ${displayPrice.amount}
                      </span>
                      <span className="text-gray-600 dark:text-gray-400">{displayPrice.period}</span>
                    </div>

                    {billingCycle === 'yearly' && displayPrice.savings > 0 && (
                      <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                        ${displayPrice.savings.toFixed(0)} tasarruf
                      </p>
                    )}
                  </div>

                  {/* CTA Button */}
                  <button
                    onClick={() => handleUpgrade(plan.id)}
                    disabled={isCurrentPlan || isProcessing}
                    className={`w-full py-3 px-6 rounded-lg font-semibold mb-8 transition-all ${
                      isCurrentPlan
                        ? 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                        : isPlanHighlighted
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white transform hover:scale-105'
                        : 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100'
                    }`}
                  >
                    {isCurrentPlan
                      ? 'Mevcut Plan'
                      : isProcessing
                      ? 'İşleniyor...'
                      : plan.price === 0
                      ? 'Ücretsiz Başla'
                      : 'Planı Seç'}
                  </button>

                  {/* Features List */}
                  <div className="space-y-3">
                    {PLAN_FEATURE_LIST[plan.id].map((feature, index) => (
                      <div key={index} className="flex items-start gap-3">
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
                        <span className="text-sm text-gray-600 dark:text-gray-400">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Current Plan Badge */}
        {currentPlan && (
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Şu anki planınız:{' '}
              <span className="font-semibold text-gray-900 dark:text-white">
                {PLANS[currentPlan].name}
              </span>
            </p>
          </div>
        )}
      </div>

      {/* Comparison Table */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h3 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
          Detaylı Plan Karşılaştırması
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                  Özellik
                </th>
                {Object.values(PLANS).map((plan) => (
                  <th
                    key={plan.id}
                    className="px-6 py-4 text-center text-sm font-semibold text-gray-900 dark:text-white"
                  >
                    {plan.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {/* Search Limits */}
              <tr>
                <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                  Aylık Arama Limiti
                </td>
                {Object.values(PLANS).map((plan) => (
                  <td
                    key={plan.id}
                    className="px-6 py-4 text-sm text-center text-gray-600 dark:text-gray-400"
                  >
                    {plan.limits.searches.monthly === -1
                      ? 'Sınırsız'
                      : plan.limits.searches.monthly}
                  </td>
                ))}
              </tr>

              {/* Enrichment Limits */}
              <tr className="bg-gray-50 dark:bg-gray-900/50">
                <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                  Aylık Zenginleştirme
                </td>
                {Object.values(PLANS).map((plan) => (
                  <td
                    key={plan.id}
                    className="px-6 py-4 text-sm text-center text-gray-600 dark:text-gray-400"
                  >
                    {plan.limits.enrichments.monthly === -1
                      ? 'Sınırsız'
                      : plan.limits.enrichments.monthly}
                  </td>
                ))}
              </tr>

              {/* Export Limits */}
              <tr>
                <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                  Export Limiti
                </td>
                {Object.values(PLANS).map((plan) => (
                  <td
                    key={plan.id}
                    className="px-6 py-4 text-sm text-center text-gray-600 dark:text-gray-400"
                  >
                    {plan.limits.exports.monthly === -1 ? 'Sınırsız' : plan.limits.exports.monthly}
                    {plan.limits.exports.maxPerExport !== -1 &&
                      ` (max ${plan.limits.exports.maxPerExport})`}
                  </td>
                ))}
              </tr>

              {/* Advanced Filters */}
              <tr className="bg-gray-50 dark:bg-gray-900/50">
                <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                  Gelişmiş Filtreler
                </td>
                {Object.values(PLANS).map((plan) => (
                  <td key={plan.id} className="px-6 py-4 text-center">
                    {plan.features.advancedFilters ? (
                      <svg
                        className="w-5 h-5 text-green-500 mx-auto"
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
                    ) : (
                      <svg
                        className="w-5 h-5 text-gray-300 dark:text-gray-600 mx-auto"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    )}
                  </td>
                ))}
              </tr>

              {/* API Access */}
              <tr>
                <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">API Erişimi</td>
                {Object.values(PLANS).map((plan) => (
                  <td key={plan.id} className="px-6 py-4 text-center">
                    {plan.features.apiAccess ? (
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {plan.features.apiCallsPerDay === -1
                          ? 'Sınırsız'
                          : `${plan.features.apiCallsPerDay}/gün`}
                      </span>
                    ) : (
                      <svg
                        className="w-5 h-5 text-gray-300 dark:text-gray-600 mx-auto"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    )}
                  </td>
                ))}
              </tr>

              {/* Support */}
              <tr className="bg-gray-50 dark:bg-gray-900/50">
                <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">Destek</td>
                {Object.values(PLANS).map((plan) => (
                  <td
                    key={plan.id}
                    className="px-6 py-4 text-sm text-center text-gray-600 dark:text-gray-400"
                  >
                    {plan.features.support === 'community' && 'Topluluk'}
                    {plan.features.support === 'email' && 'Email (48s)'}
                    {plan.features.support === 'priority' && 'Öncelikli'}
                    {plan.features.support === 'dedicated' && '24/7 Özel'}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* FAQ */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h3 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
          Sıkça Sorulan Sorular
        </h3>

        <div className="space-y-6">
          <details className="bg-white dark:bg-gray-800 rounded-lg p-6 cursor-pointer">
            <summary className="font-semibold text-gray-900 dark:text-white">
              Plan değişikliği nasıl yapılır?
            </summary>
            <p className="mt-3 text-gray-600 dark:text-gray-400">
              İstediğiniz zaman planınızı yükseltebilir veya düşürebilirsiniz. Yükseltme anında
              geçerli olur, düşürmeler ise mevcut faturalandırma döneminizin sonunda aktif olur.
            </p>
          </details>

          <details className="bg-white dark:bg-gray-800 rounded-lg p-6 cursor-pointer">
            <summary className="font-semibold text-gray-900 dark:text-white">
              Limitler her ay sıfırlanır mı?
            </summary>
            <p className="mt-3 text-gray-600 dark:text-gray-400">
              Evet, tüm kullanım limitleri her faturalandırma döneminin başında otomatik olarak
              sıfırlanır.
            </p>
          </details>

          <details className="bg-white dark:bg-gray-800 rounded-lg p-6 cursor-pointer">
            <summary className="font-semibold text-gray-900 dark:text-white">
              Para iade garantisi var mı?
            </summary>
            <p className="mt-3 text-gray-600 dark:text-gray-400">
              Evet, 30 gün içinde memnun kalmazsanız tam para iade garantisi sunuyoruz.
            </p>
          </details>

          <details className="bg-white dark:bg-gray-800 rounded-lg p-6 cursor-pointer">
            <summary className="font-semibold text-gray-900 dark:text-white">
              Ödeme yöntemleri nelerdir?
            </summary>
            <p className="mt-3 text-gray-600 dark:text-gray-400">
              Kredi kartı, banka kartı ve banka havalesi ile ödeme yapabilirsiniz. Tüm ödemeler
              güvenli şekilde işlenir.
            </p>
          </details>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-bold mb-4">Hala Emin Değil Misiniz?</h3>
          <p className="text-xl text-blue-100 mb-8">
            Ücretsiz plan ile başlayın, kredi kartı gerekmez!
          </p>
          <button
            onClick={() => handleUpgrade('free')}
            className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-50 transition-colors"
          >
            Ücretsiz Başlayın
          </button>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;

