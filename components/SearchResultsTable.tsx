import React from 'react';
import { Lead } from '../types';
import { PhoneIcon, WebIcon, StarIcon, MapPinIcon } from './icons/IconComponents';

interface SearchResultsTableProps {
  leads: Omit<Lead, 'status' | 'notes'>[];
  onAddLead: (lead: Omit<Lead, 'status' | 'notes'>) => void;
  myLeadIds: Set<string>;
}

const RatingStars: React.FC<{ rating: number }> = ({ rating }) => {
    return (
        <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
                <StarIcon key={i} filled={i < Math.round(rating)} />
            ))}
            <span className="text-gray-600 dark:text-gray-400 text-xs ml-1">({rating.toFixed(1)})</span>
        </div>
    );
};

const SearchResultsTable: React.FC<SearchResultsTableProps> = ({ leads, onAddLead, myLeadIds }) => {
  if (leads.length === 0) {
    return (
        <div className="text-center py-10 bg-white dark:bg-gray-800 rounded-lg shadow-md mt-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">İşletme Bulunamadı</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Yeni lead'ler bulmak için arama kriterlerinizi değiştirmeyi deneyin.</p>
        </div>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 60) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    if (score >= 40) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
  }

  return (
    <div className="mt-6 flow-root">
      <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-white sm:pl-6">Şirket</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">İletişim Bilgileri</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">Kalite Skoru</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">Değerlendirme</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">İşlem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800/50">
                {leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50">
                    <td className="py-4 pl-4 pr-3 text-sm sm:pl-6 align-top">
                      <div className="font-medium text-gray-900 dark:text-white">{lead.companyName}</div>
                      <div className="italic text-gray-500 dark:text-gray-400">{lead.category}</div>
                      <div className="text-gray-500 dark:text-gray-400 mt-1">{lead.address}</div>
                    </td>
                    <td className="px-3 py-4 text-sm align-top">
                      <div className="flex flex-col space-y-1.5 text-gray-500 dark:text-gray-400">
                          {lead.phone ? (
                              <a href={`tel:${lead.phone}`} title={lead.phone} className="flex items-center hover:text-indigo-600 group">
                                  <PhoneIcon />
                                  <span className="ml-2 group-hover:underline">{lead.phone}</span>
                              </a>
                          ) : (
                              <span className="flex items-center text-xs text-gray-400">
                                  <PhoneIcon />
                                  <span className="ml-2">Telefon bulunamadı</span>
                              </span>
                          )}
                          
                          {lead.website ? (
                              <a href={lead.website} target="_blank" rel="noopener noreferrer" title={lead.website} className="flex items-center hover:text-indigo-600 group">
                                  <WebIcon />
                                  <span className="ml-2 truncate group-hover:underline">{lead.website.replace(/^(https?:\/\/)?(www\.)?/, '')}</span>
                              </a>
                          ) : (
                              <span className="flex items-center text-xs text-gray-400">
                                  <WebIcon />
                                  <span className="ml-2">Website bulunamadı</span>
                              </span>
                          )}
                          
                          {lead.googleMapsUri && <a href={lead.googleMapsUri} target="_blank" rel="noopener noreferrer" title="Google Maps'te Görüntüle" className="flex items-center hover:text-indigo-600 group pt-1"><MapPinIcon/><span className="ml-2 group-hover:underline">Haritada Gör</span></a>}
                      </div>
                    </td>
                    <td className="px-3 py-4 text-sm text-gray-500 dark:text-gray-400 align-top">
                        <div className="flex flex-col">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getScoreColor(lead.qualityScore)}`}>
                                {lead.qualityScore} / 80
                            </span>
                            <span className="text-xs mt-1" title={lead.qualityReasoning}>{lead.qualityReasoning}</span>
                        </div>
                    </td>
                    <td className="px-3 py-4 text-sm text-gray-500 dark:text-gray-400 align-top">
                        <RatingStars rating={lead.rating} />
                        <div className="text-xs">{lead.reviewCount} değerlendirme</div>
                    </td>
                    <td className="px-3 py-4 text-sm text-gray-500 dark:text-gray-400 align-top">
                        <button
                            onClick={() => onAddLead(lead)}
                            disabled={myLeadIds.has(lead.id)}
                            className="px-3 py-1.5 text-xs font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            {myLeadIds.has(lead.id) ? 'Eklendi' : 'Listeye Ekle'}
                        </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResultsTable;