import React, { useState } from 'react';

type SearchSource = 'maps' | 'web';

interface SearchFormProps {
  onSearch: (country: string, city: string, district: string, keyword: string, source: SearchSource) => void;
  isLoading: boolean;
}

const POPULAR_CATEGORIES = [
  'Restaurant', 'Cafe', 'Hotel', 'Gym', 'Spa', 'Barber Shop',
  'Dentist', 'Lawyer', 'Real Estate', 'Plumber', 'Electrician',
  'Bakery', 'Pharmacy', 'Clothing Store', 'Beauty Salon', 'Car Repair'
];

const SearchForm: React.FC<SearchFormProps> = ({ onSearch, isLoading }) => {
  const [country, setCountry] = useState('Turkey');
  const [city, setCity] = useState('Istanbul');
  const [district, setDistrict] = useState('Kadıköy');
  const [keyword, setKeyword] = useState('Restaurant');
  const [searchSource, setSearchSource] = useState<SearchSource>('maps');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (country && city && district && keyword) {
      onSearch(country, city, district, keyword, searchSource);
      setShowSuggestions(false);
    }
  };

  const filteredSuggestions = POPULAR_CATEGORIES.filter(cat =>
    cat.toLowerCase().includes(keyword.toLowerCase())
  );

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
            <div className="md:col-span-1">
              <label htmlFor="country" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Search Country
              </label>
              <input
                type="text"
                id="country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="e.g., Turkey"
                required
              />
            </div>
            <div className="md:col-span-1">
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Search City
              </label>
              <input
                type="text"
                id="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="e.g., Istanbul"
                required
              />
            </div>
            <div className="md:col-span-1">
              <label htmlFor="district" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Search District
              </label>
              <input
                type="text"
                id="district"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="e.g., Kadıköy"
                required
              />
            </div>
            <div className="md:col-span-1 relative">
              <label htmlFor="keyword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Search Keyword
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
                placeholder="e.g., Cafe, Plumber"
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
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : 'Search'}
            </button>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <fieldset>
            <legend className="text-sm font-medium text-gray-700 dark:text-gray-300">Data Source</legend>
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
                  Google Maps <span className="text-xs text-gray-500 dark:text-gray-400">(For local businesses)</span>
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
                  Web Search <span className="text-xs text-gray-500 dark:text-gray-400">(Broader reach)</span>
                </label>
              </div>
            </div>
          </fieldset>
        </div>
      </form>
    </div>
  );
};

export default SearchForm;