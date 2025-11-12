import React from 'react';
import { Lead } from '../types';

interface DashboardStatsProps {
  leads: Lead[];
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ leads }) => {
  // Calculate stats
  const totalLeads = leads.length;
  const highQualityLeads = leads.filter(l => l.qualityScore >= 60).length;
  const contactedLeads = leads.filter(l => l.status === 'Contacted' || l.status === 'Interested').length;
  const leadsWithEmail = leads.filter(l => l.email).length;

  // Average quality score
  const avgQualityScore = totalLeads > 0 
    ? Math.round(leads.reduce((sum, l) => sum + l.qualityScore, 0) / totalLeads)
    : 0;

  // Status distribution
  const newLeads = leads.filter(l => l.status === 'New').length;
  const interestedLeads = leads.filter(l => l.status === 'Interested').length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Total Leads */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Toplam Lead
            </p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
              {totalLeads}
            </p>
          </div>
          <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
            <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
        </div>
        <div className="mt-3 flex items-center text-sm">
          <span className="text-green-600 dark:text-green-400 font-medium">{newLeads} yeni</span>
          <span className="text-gray-500 dark:text-gray-400 mx-2">•</span>
          <span className="text-gray-600 dark:text-gray-400">{interestedLeads} ilgili</span>
        </div>
      </div>

      {/* High Quality Leads */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Yüksek Kalite
            </p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
              {highQualityLeads}
            </p>
          </div>
          <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
            <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <div className="mt-3">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600 dark:text-gray-400">Kalite Ortalaması</span>
            <span className="font-medium text-gray-900 dark:text-white">{avgQualityScore}/80</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-green-600 h-2 rounded-full"
              style={{ width: `${(avgQualityScore / 80) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Contacted Leads */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              İletişime Geçilen
            </p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
              {contactedLeads}
            </p>
          </div>
          <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full">
            <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
        <div className="mt-3">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Dönüşüm Oranı: {totalLeads > 0 ? Math.round((contactedLeads / totalLeads) * 100) : 0}%
          </div>
        </div>
      </div>

      {/* Leads with Email */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Email Mevcut
            </p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
              {leadsWithEmail}
            </p>
          </div>
          <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-full">
            <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
            </svg>
          </div>
        </div>
        <div className="mt-3">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {totalLeads > 0 ? Math.round((leadsWithEmail / totalLeads) * 100) : 0}% lead'de email var
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;

