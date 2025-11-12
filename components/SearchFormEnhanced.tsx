import React, { useState, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useSubscription } from '../context/SubscriptionContext';
import { RESULT_LIMITS, API_FETCH_LIMITS } from '../constants/plans';

type SearchSource = 'maps' | 'web';

interface SearchFormProps {
  onSearch: (country: string, city: string, district: string, keyword: string, source: SearchSource) => void;
  isLoading: boolean;
}

interface SearchHistory {
  id: string;
  country: string;
  city: string;
  district: string;
  keyword: string;
  source: SearchSource;
  timestamp: number;
  resultCount?: number;
}

interface SavedSearch extends SearchHistory {
  name: string;
  isFavorite: true;
}

const POPULAR_CATEGORIES = [
  'Restaurant', 'Cafe', 'Hotel', 'Gym', 'Spa', 'Barber Shop',
  'Dentist', 'Lawyer', 'Real Estate', 'Plumber', 'Electrician',
  'Bakery', 'Pharmacy', 'Clothing Store', 'Beauty Salon', 'Car Repair'
];

const SearchFormEnhanced: React.FC<SearchFormProps> = ({ onSearch, isLoading }) => {
  const { plan } = useSubscription();
  const displayLimit = RESULT_LIMITS[plan] || 10;
  const totalFetch = API_FETCH_LIMITS[plan] || 30;
  const totalPages = Math.ceil(totalFetch / displayLimit);
  
  const [country, setCountry] = useState('Turkey');
  const [city, setCity] = useState('Istanbul');
  const [district, setDistrict] = useState('Kadıköy');
  const [keyword, setKeyword] = useState('Restaurant');
  const [searchSource, setSearchSource] = useState<SearchSource>('maps');
  
  // UI States
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showSaved, setShowSaved] = useState(false);
  
  // Data States
  const [searchHistory, setSearchHistory] = useLocalStorage<SearchHistory[]>('search-history', []);
  const [savedSearches, setSavedSearches] = useLocalStorage<SavedSearch[]>('saved-searches', []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (country && city && district && keyword) {
      onSearch(country, city, district, keyword, searchSource);
      setShowSuggestions(false);
      
      // Add to history
      const newHistoryItem: SearchHistory = {
        id: Date.now().toString(),
        country,
        city,
        district,
        keyword,
        source: searchSource,
        timestamp: Date.now()
      };
      setSearchHistory(prev => [newHistoryItem, ...prev.slice(0, 9)]); // Keep last 10
    }
  };

  const applyHistory = (item: SearchHistory) => {
    setCountry(item.country);
    setCity(item.city);
    setDistrict(item.district);
    setKeyword(item.keyword);
    setSearchSource(item.source);
    setShowHistory(false);
  };

  const saveCurrentSearch = () => {
    const name = prompt('Bu aramayı kaydetmek için bir isim girin:');
    if (name) {
      const newSaved: SavedSearch = {
        id: Date.now().toString(),
        name,
        country,
        city,
        district,
        keyword,
        source: searchSource,
        timestamp: Date.now(),
        isFavorite: true
      };
      setSavedSearches(prev => [...prev, newSaved]);
      alert('Arama kaydedildi! ⭐');
    }
  };

  const deleteSaved = (id: string) => {
    setSavedSearches(prev => prev.filter(s => s.id !== id));
  };

  const filteredSuggestions = POPULAR_CATEGORIES.filter(cat =>
    cat.toLowerCase().includes(keyword.toLowerCase())
  );

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      {/* Quick Actions Bar */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          type="button"
          onClick={() => setShowHistory(!showHistory)}
          className="flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-md hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
        >
          🔍 Geçmiş ({searchHistory.length})
        </button>
        <button
          type="button"
          onClick={() => setShowSaved(!showSaved)}
          className="flex items-center gap-2 px-3 py-1.5 text-sm bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 rounded-md hover:bg-yellow-200 dark:hover:bg-yellow-800 transition-colors"
        >
          ⭐ Favoriler ({savedSearches.length})
        </button>
        <button
          type="button"
          onClick={saveCurrentSearch}
          className="flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors ml-auto"
        >
          💾 Aramayı Kaydet
        </button>
      </div>

      {/* Search History */}
      {showHistory && searchHistory.length > 0 && (
        <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Son Aramalar</h3>
          <div className="space-y-2">
            {searchHistory.slice(0, 5).map(item => (
              <button
                key={item.id}
                type="button"
                onClick={() => applyHistory(item)}
                className="w-full flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors text-left border border-gray-200 dark:border-gray-700"
              >
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {item.keyword} - {item.district}, {item.city}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(item.timestamp).toLocaleDateString('tr-TR')} • {item.source === 'maps' ? 'Google Maps' : 'Web Araması'}
                  </div>
                </div>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Saved Searches */}
      {showSaved && savedSearches.length > 0 && (
        <div className="mb-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Favori Aramalar</h3>
          <div className="space-y-2">
            {savedSearches.map(item => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700"
              >
                <button
                  type="button"
                  onClick={() => applyHistory(item)}
                  className="flex-1 text-left hover:text-blue-600 dark:hover:text-blue-400"
                >
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    ⭐ {item.name}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {item.keyword} - {item.district}, {item.city}
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => deleteSaved(item.id)}
                  className="ml-2 p-1 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/50 rounded"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Search Form */}
      <form onSubmit={handleSubmit}>
        {/* Plan Info Banner */}
        <div className="mb-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                📊 {plan.charAt(0).toUpperCase() + plan.slice(1)} Plan
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">•</span>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Her aramada <span className="font-semibold text-blue-600 dark:text-blue-400">{totalFetch} lead</span>
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">•</span>
              <span className="text-xs text-gray-600 dark:text-gray-400">
                Sayfa başına {displayLimit} gösterilir ({totalPages} sayfa)
              </span>
            </div>
            {plan === 'free' && (
              <button
                type="button"
                onClick={() => window.location.hash = '#pricing'}
                className="text-xs font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 whitespace-nowrap"
              >
                Daha fazla için yükselt →
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
          <div className="md:col-span-1">
            <label htmlFor="country" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Ülke
            </label>
            <input
              type="text"
              id="country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="örn: Turkey"
              required
            />
          </div>
          
          <div className="md:col-span-1">
            <label htmlFor="city" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Şehir
            </label>
            <input
              type="text"
              id="city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="örn: Istanbul"
              required
            />
          </div>
          
          <div className="md:col-span-1">
            <label htmlFor="district" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              İlçe
            </label>
            <input
              type="text"
              id="district"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="örn: Kadıköy"
              required
            />
          </div>
          
          <div className="md:col-span-1 relative">
            <label htmlFor="keyword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Arama Terimi
            </label>
            <input
              type="text"
              id="keyword"
              value={keyword}
              onChange={(e) => {
                setKeyword(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="örn: Cafe, Restaurant"
              required
            />
            {showSuggestions && filteredSuggestions.length > 0 && (
              <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-60 overflow-auto">
                {filteredSuggestions.slice(0, 8).map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => {
                      setKeyword(suggestion);
                      setShowSuggestions(false);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 text-sm text-gray-900 dark:text-gray-200"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full md:col-span-1 bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Aranıyor...
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Ara
              </>
            )}
          </button>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <fieldset>
            <legend className="text-sm font-medium text-gray-700 dark:text-gray-300">Veri Kaynağı</legend>
            <div className="mt-2 flex items-center space-x-4">
              <div className="flex items-center">
                <input
                  id="maps-source"
                  name="search-source"
                  type="radio"
                  value="maps"
                  checked={searchSource === 'maps'}
                  onChange={(e) => setSearchSource(e.target.value as SearchSource)}
                  className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 dark:border-gray-600"
                />
                <label htmlFor="maps-source" className="ml-2 block text-sm text-gray-900 dark:text-gray-200">
                  Google Maps <span className="text-xs text-gray-500 dark:text-gray-400">(Yerel işletmeler için)</span>
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="web-source"
                  name="search-source"
                  type="radio"
                  value="web"
                  checked={searchSource === 'web'}
                  onChange={(e) => setSearchSource(e.target.value as SearchSource)}
                  className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 dark:border-gray-600"
                />
                <label htmlFor="web-source" className="ml-2 block text-sm text-gray-900 dark:text-gray-200">
                  Web Search <span className="text-xs text-gray-500 dark:text-gray-400">(Daha geniş kapsam)</span>
                </label>
              </div>
            </div>
          </fieldset>
        </div>
      </form>
    </div>
  );
};

export default SearchFormEnhanced;

