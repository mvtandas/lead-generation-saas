import React, { useState } from 'react';
import { Lead, QualityScoreFilterType } from '../types';
import { DownloadIcon } from './icons/IconComponents';

interface FilterControlsProps {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    statusFilter: Lead['status'] | 'All';
    setStatusFilter: (status: Lead['status'] | 'All') => void;
    qualityScoreFilter: QualityScoreFilterType;
    setQualityScoreFilter: (filter: QualityScoreFilterType) => void;
    minRating?: number;
    setMinRating?: (rating: number) => void;
    minReviews?: number;
    setMinReviews?: (reviews: number) => void;
    onExport: () => void;
    onExportCSV: () => void;
    filteredCount: number;
}

const FilterControls: React.FC<FilterControlsProps> = ({
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    qualityScoreFilter,
    setQualityScoreFilter,
    minRating = 0,
    setMinRating,
    minReviews = 0,
    setMinReviews,
    onExport,
    onExportCSV,
    filteredCount,
}) => {
    const [showExportMenu, setShowExportMenu] = useState(false);
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
    return (
        <div className="mt-6 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Search Input */}
                <div className="md:col-span-2">
                    <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Search by Name, Category, or Notes
                    </label>
                    <input
                        type="text"
                        id="search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="e.g., Italian Cafe..."
                    />
                </div>

                {/* Status Filter */}
                <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Status
                    </label>
                    <select
                        id="status"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as Lead['status'] | 'All')}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    >
                        <option value="All">All Statuses</option>
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Interested">Interested</option>
                        <option value="Not Interested">Not Interested</option>
                    </select>
                </div>

                {/* Quality Score Filter */}
                <div>
                    <label htmlFor="quality" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Quality Score
                    </label>
                    <select
                        id="quality"
                        value={qualityScoreFilter}
                        onChange={(e) => setQualityScoreFilter(e.target.value as QualityScoreFilterType)}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    >
                        {Object.values(QualityScoreFilterType).map(value => (
                             <option key={value} value={value}>{value}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Advanced Filters */}
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                    onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                    className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-2"
                >
                    <svg className={`w-4 h-4 transition-transform ${showAdvancedFilters ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                    Gelişmiş Filtreler
                </button>
                
                {showAdvancedFilters && (
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Min Rating Filter */}
                        {setMinRating && (
                            <div>
                                <label htmlFor="minRating" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Minimum Rating: {minRating > 0 ? `${minRating.toFixed(1)}+` : 'Tümü'}
                                </label>
                                <input
                                    type="range"
                                    id="minRating"
                                    min="0"
                                    max="5"
                                    step="0.5"
                                    value={minRating}
                                    onChange={(e) => setMinRating(parseFloat(e.target.value))}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                                />
                                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    <span>0</span>
                                    <span>5</span>
                                </div>
                            </div>
                        )}

                        {/* Min Reviews Filter */}
                        {setMinReviews && (
                            <div>
                                <label htmlFor="minReviews" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Minimum Review: {minReviews > 0 ? `${minReviews}+` : 'Tümü'}
                                </label>
                                <input
                                    type="range"
                                    id="minReviews"
                                    min="0"
                                    max="100"
                                    step="10"
                                    value={minReviews}
                                    onChange={(e) => setMinReviews(parseInt(e.target.value))}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                                />
                                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    <span>0</span>
                                    <span>100+</span>
                                </div>
                            </div>
                        )}

                        {/* Reset Filters Button */}
                        <div className="md:col-span-2">
                            <button
                                onClick={() => {
                                    if (setMinRating) setMinRating(0);
                                    if (setMinReviews) setMinReviews(0);
                                }}
                                className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                            >
                                Gelişmiş Filtreleri Sıfırla
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
                 <p className="text-sm text-gray-600 dark:text-gray-400">
                    {filteredCount} {filteredCount === 1 ? 'lead' : 'leads'} found.
                </p>
                <div className="relative">
                    <button
                        onClick={() => setShowExportMenu(!showExportMenu)}
                        disabled={filteredCount === 0}
                        className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-green-300 disabled:cursor-not-allowed"
                    >
                        <DownloadIcon />
                        Export Filtered
                        <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                    {showExportMenu && (
                        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-700 ring-1 ring-black ring-opacity-5 z-10">
                            <div className="py-1" role="menu">
                                <button
                                    onClick={() => {
                                        onExport();
                                        setShowExportMenu(false);
                                    }}
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                                    role="menuitem"
                                >
                                    <div className="flex items-center">
                                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9 2a2 2 0 00-2 2v8a2 2 0 002 2h6a2 2 0 002-2V6.414A2 2 0 0016.414 5L14 2.586A2 2 0 0012.586 2H9z" />
                                            <path d="M3 8a2 2 0 012-2v10h8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
                                        </svg>
                                        Export as Excel (.xlsx)
                                    </div>
                                </button>
                                <button
                                    onClick={() => {
                                        onExportCSV();
                                        setShowExportMenu(false);
                                    }}
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                                    role="menuitem"
                                >
                                    <div className="flex items-center">
                                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                                        </svg>
                                        Export as CSV (.csv)
                                    </div>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FilterControls;
