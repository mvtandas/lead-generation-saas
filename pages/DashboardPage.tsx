import React, { useState, useEffect, useCallback, useMemo } from 'react';
import SearchFormEnhanced from '../components/SearchFormEnhanced';
import ResultsTable from '../components/ResultsTable';
import SearchResultsTable from '../components/SearchResultsTable';
import FilterControls from '../components/FilterControls';
import Pagination from '../components/Pagination';
import UpgradeModal from '../components/PremiumModal';
import UpgradeModalNew from '../components/UpgradeModal';
import UsageDashboard from '../components/UsageDashboard';
import ThemeToggle from '../components/ThemeToggle';
import DashboardStats from '../components/DashboardStats';
import { TableSkeleton } from '../components/LoadingSkeleton';
import { Lead, QualityScoreFilterType } from '../types';
import { fetchLeads, enrichLead } from '../services/leadService';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { exportToXlsx } from '../utils/exportToXlsx';
import { exportToCsv } from '../utils/exportToCsv';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useSubscription } from '../context/SubscriptionContext';
import { RESULT_LIMITS, API_FETCH_LIMITS } from '../constants/plans';

const LEADS_PER_PAGE = 10;
const FREE_PLAN_LEAD_LIMIT = 25;
type View = 'search' | 'myLeads';

const CREDIT_COSTS = {
    maps_search: 1,
    web_search: 1,
    enrich: 2,
};

const DashboardPage: React.FC = () => {
  const { user, logout, updateUser } = useAuth();
  const { showToast } = useToast();
  const { canPerformAction, recordAction, plan, upgradePlan } = useSubscription();
  const userMyLeadsKey = user ? `myLeads_${user.id}` : 'myLeads';
  
  const [activeView, setActiveView] = useState<View>('search');
  
  const [myLeads, setMyLeads] = useLocalStorage<Lead[]>(userMyLeadsKey, []);
  const [searchResults, setSearchResults] = useState<Omit<Lead, 'status' | 'notes'>[]>([]);
  const [allSearchResults, setAllSearchResults] = useState<Omit<Lead, 'status' | 'notes'>[]>([]); // Full results from API
  const [currentSearchPage, setCurrentSearchPage] = useState(1);
  
  const [isLoading, setIsLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [enrichingId, setEnrichingId] = useState<string | null>(null);

  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [upgradeReason, setUpgradeReason] = useState<'CREDITS' | 'LEAD_LIMIT' | 'EXPORT_LIMIT'>('CREDITS');
  const [isNewUpgradeModalOpen, setIsNewUpgradeModalOpen] = useState(false);
  const [upgradeModalReason, setUpgradeModalReason] = useState<string>('');

  const openUpgradeModal = (reason: 'CREDITS' | 'LEAD_LIMIT' | 'EXPORT_LIMIT') => {
      setUpgradeReason(reason);
      setIsUpgradeModalOpen(true);
  }
  
  // Filtering and Pagination state for "My Leads" view
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<Lead['status'] | 'All'>('All');
  const [qualityScoreFilter, setQualityScoreFilter] = useState<QualityScoreFilterType>(QualityScoreFilterType.ANY);
  const [minRating, setMinRating] = useState<number>(0);
  const [minReviews, setMinReviews] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(1);

  const handleSearch = async (country: string, city: string, district: string, keyword: string, source: 'maps' | 'web') => {
    if (!user) return;

    // Check subscription limits
    const canSearch = canPerformAction('search');
    if (!canSearch.allowed) {
      setUpgradeModalReason(canSearch.reason || 'Arama limitiniz doldu');
      setIsNewUpgradeModalOpen(true);
      showToast(canSearch.reason || 'Arama limitiniz doldu', 'error');
      return;
    }

    // Old credit system (keeping for now)
    const cost = source === 'maps' ? CREDIT_COSTS.maps_search : CREDIT_COSTS.web_search;
    if (user.credits < cost) {
        openUpgradeModal('CREDITS');
        return;
    }

    setIsLoading(true);
    setSearchResults([]);
    setAllSearchResults([]);
    setCurrentSearchPage(1);
    setSearchError(null);
    try {
      // Fetch more data than we show (for pagination without extra API calls)
      const apiFetchLimit = API_FETCH_LIMITS[plan] || 30;
      const displayLimit = RESULT_LIMITS[plan] || 10;
      
      const fetchedLeads = await fetchLeads(country, city, district, keyword, source, apiFetchLimit);
      
      // Store all results
      setAllSearchResults(fetchedLeads);
      
      // Show only first page
      setSearchResults(fetchedLeads.slice(0, displayLimit));
      
      // Record usage
      recordAction('search', { query: keyword, resultCount: fetchedLeads.length });
      
      updateUser(u => ({ ...u, credits: u.credits - cost }));
      
      const totalPages = Math.ceil(fetchedLeads.length / displayLimit);
      const withPhone = fetchedLeads.filter(l => l.phone).length;
      const withWebsite = fetchedLeads.filter(l => l.website).length;
      showToast(
        `${fetchedLeads.length} lead bulundu! (${withPhone} telefon, ${withWebsite} website) • ${displayLimit} lead/sayfa`,
        'success'
      );
    } catch (error: any) {
      console.error("Failed to fetch leads:", error);
      setSearchError(error.message || 'An unknown error occurred. Please try again.');
      showToast(error.message || 'Lead arama başarısız oldu', 'error');
    } finally {
      setIsLoading(false);
    }
  };
  
  const addLeadToList = (leadToAdd: Omit<Lead, 'status' | 'notes'>) => {
    console.log('🔵 addLeadToList called for:', leadToAdd.companyName, 'ID:', leadToAdd.id);
    
    if (!user) {
      console.log('❌ No user found');
      return;
    }

    if (user.plan === 'free' && myLeads.length >= FREE_PLAN_LEAD_LIMIT) {
        console.log('❌ Free plan limit reached:', myLeads.length, '>=', FREE_PLAN_LEAD_LIMIT);
        openUpgradeModal('LEAD_LIMIT');
        return;
    }

    if (myLeads.some(lead => lead.id === leadToAdd.id)) {
        console.log('⚠️ Lead already exists in list');
        showToast('Bu lead zaten listenizde mevcut', 'warning');
        return;
    }
    
    const newLead: Lead = {
        ...leadToAdd,
        status: 'New',
        notes: ''
    };
    
    console.log('✅ Adding lead to list:', newLead.companyName);
    console.log('Current myLeads count:', myLeads.length);
    
    setMyLeads(prev => {
      const updated = [...prev, newLead];
      console.log('Updated myLeads count:', updated.length);
      return updated;
    });
    
    showToast(`${newLead.companyName} listenize eklendi`, 'success');
  };

  const removeLeadFromList = (id: string) => {
    if(window.confirm('Bu lead\'i listenizden çıkarmak istediğinizden emin misiniz?')){
        const lead = myLeads.find(l => l.id === id);
        setMyLeads(prev => prev.filter(lead => lead.id !== id));
        showToast(`${lead?.companyName || 'Lead'} listenizden çıkarıldı`, 'info');
    }
  };

  const updateLeadInList = (id: string, updates: Partial<Lead>) => {
    setMyLeads(prev => prev.map(lead => lead.id === id ? { ...lead, ...updates } : lead));
  };

  const handleEnrichLead = async (id: string) => {
    if (!user) return;
    
    // Check subscription limits
    const canEnrich = canPerformAction('enrichment');
    if (!canEnrich.allowed) {
      setUpgradeModalReason(canEnrich.reason || 'Zenginleştirme limitiniz doldu');
      setIsNewUpgradeModalOpen(true);
      showToast(canEnrich.reason || 'Zenginleştirme limitiniz doldu', 'error');
      return;
    }

    const cost = CREDIT_COSTS.enrich;
    if (user.credits < cost) {
        openUpgradeModal('CREDITS');
        return;
    }

    const leadToEnrich = myLeads.find(lead => lead.id === id);
    if (!leadToEnrich) return;

    setEnrichingId(id);
    try {
        const enrichedData = await enrichLead(leadToEnrich);
        updateLeadInList(id, enrichedData);
        
        // Record usage
        recordAction('enrichment', { leadId: id });
        
        updateUser(u => ({ ...u, credits: u.credits - cost }));
        showToast(`${leadToEnrich.companyName} zenginleştirildi`, 'success');
    } catch (error) {
        console.error("Failed to enrich lead:", error);
        showToast("Ek bilgi bulunamadı", 'error');
    } finally {
        setEnrichingId(null);
    }
  };

  const handleEnrichSearchResult = async (id: string) => {
    if (!user) return;
    
    // Check subscription limits
    const canEnrich = canPerformAction('enrichment');
    if (!canEnrich.allowed) {
      setUpgradeModalReason(canEnrich.reason || 'Zenginleştirme limitiniz doldu');
      setIsNewUpgradeModalOpen(true);
      showToast(canEnrich.reason || 'Zenginleştirme limitiniz doldu', 'error');
      return;
    }

    const cost = CREDIT_COSTS.enrich;
    if (user.credits < cost) {
        openUpgradeModal('CREDITS');
        return;
    }

    const leadToEnrich = allSearchResults.find(lead => lead.id === id);
    if (!leadToEnrich) return;

    setEnrichingId(id);
    try {
        const enrichedData = await enrichLead(leadToEnrich as Lead);
        
        // Update both allSearchResults and searchResults
        setAllSearchResults(prev => prev.map(lead => 
          lead.id === id ? { ...lead, ...enrichedData } : lead
        ));
        setSearchResults(prev => prev.map(lead => 
          lead.id === id ? { ...lead, ...enrichedData } : lead
        ));
        
        // Record usage
        recordAction('enrichment', { leadId: id });
        
        updateUser(u => ({ ...u, credits: u.credits - cost }));
        showToast(`${leadToEnrich.companyName} zenginleştirildi! Telefon/Website bilgisi eklendi.`, 'success');
    } catch (error) {
        console.error("Failed to enrich lead:", error);
        showToast("Ek bilgi bulunamadı", 'error');
    } finally {
        setEnrichingId(null);
    }
  };
  
  const filteredMyLeads = useMemo(() => {
    let leadsToFilter = [...myLeads];
    
    if (searchTerm) {
        const lowercasedTerm = searchTerm.toLowerCase();
        leadsToFilter = leadsToFilter.filter(lead =>
            lead.companyName.toLowerCase().includes(lowercasedTerm) ||
            lead.category.toLowerCase().includes(lowercasedTerm) ||
            (lead.notes && lead.notes.toLowerCase().includes(lowercasedTerm)) ||
            (lead.description && lead.description.toLowerCase().includes(lowercasedTerm))
        );
    }

    if (statusFilter !== 'All') {
        leadsToFilter = leadsToFilter.filter(lead => lead.status === statusFilter);
    }

    if (qualityScoreFilter !== QualityScoreFilterType.ANY) {
        leadsToFilter = leadsToFilter.filter(lead => {
            if (qualityScoreFilter === QualityScoreFilterType.HIGH) return lead.qualityScore >= 60;
            if (qualityScoreFilter === QualityScoreFilterType.MEDIUM) return lead.qualityScore >= 40 && lead.qualityScore < 60;
            if (qualityScoreFilter === QualityScoreFilterType.LOW) return lead.qualityScore < 40;
            return true;
        });
    }

    // Rating filter
    if (minRating > 0) {
        leadsToFilter = leadsToFilter.filter(lead => lead.rating >= minRating);
    }

    // Review count filter
    if (minReviews > 0) {
        leadsToFilter = leadsToFilter.filter(lead => lead.reviewCount >= minReviews);
    }
    
    return leadsToFilter;
  }, [myLeads, searchTerm, statusFilter, qualityScoreFilter, minRating, minReviews]);

  useEffect(() => {
    if(currentPage > Math.ceil(filteredMyLeads.length / LEADS_PER_PAGE) && filteredMyLeads.length > 0) {
        setCurrentPage(1);
    } else if (filteredMyLeads.length === 0) {
        setCurrentPage(1);
    }
  }, [filteredMyLeads, currentPage]);

  const handleExport = () => {
    // Check subscription limits
    const canExport = canPerformAction('export', { leadCount: filteredMyLeads.length });
    if (!canExport.allowed) {
      setUpgradeModalReason(canExport.reason || 'Export limitiniz doldu');
      setIsNewUpgradeModalOpen(true);
      showToast(canExport.reason || 'Export limitiniz doldu', 'error');
      return;
    }

    exportToXlsx(filteredMyLeads, `my_leads_export`);
    
    // Record usage
    recordAction('export', { leadCount: filteredMyLeads.length, format: 'xlsx' });
    
    showToast(`${filteredMyLeads.length} lead Excel formatında export edildi`, 'success');
  };

  const handleExportCSV = () => {
    // Check subscription limits
    const canExport = canPerformAction('export', { leadCount: filteredMyLeads.length });
    if (!canExport.allowed) {
      setUpgradeModalReason(canExport.reason || 'Export limitiniz doldu');
      setIsNewUpgradeModalOpen(true);
      showToast(canExport.reason || 'Export limitiniz doldu', 'error');
      return;
    }

    exportToCsv(filteredMyLeads, `my_leads_export`);
    
    // Record usage
    recordAction('export', { leadCount: filteredMyLeads.length, format: 'csv' });
    
    showToast(`${filteredMyLeads.length} lead CSV formatında export edildi`, 'success');
  };

  const paginatedMyLeads = filteredMyLeads.slice(
    (currentPage - 1) * LEADS_PER_PAGE,
    currentPage * LEADS_PER_PAGE
  );
  
  const myLeadIds = useMemo(() => new Set(myLeads.map(l => l.id)), [myLeads]);

  const TabButton: React.FC<{view: View, label: string}> = ({ view, label }) => (
      <button
          onClick={() => setActiveView(view)}
          className={`px-4 py-2 text-sm font-medium rounded-md ${activeView === view ? 'bg-indigo-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
      >
          {label}
      </button>
  );

  return (
    <div className="min-h-screen text-gray-900 dark:text-gray-100 p-4 sm:p-6 lg:p-8">
      <UpgradeModal isOpen={isUpgradeModalOpen} onClose={() => setIsUpgradeModalOpen(false)} reason={upgradeReason} />
      <UpgradeModalNew
        isOpen={isNewUpgradeModalOpen}
        onClose={() => setIsNewUpgradeModalOpen(false)}
        currentPlan={plan}
        suggestedPlan="pro"
        reason={upgradeModalReason}
        onUpgrade={(newPlan) => {
          upgradePlan(newPlan);
          showToast(`${newPlan.toUpperCase()} planına yükseltildiniz!`, 'success');
        }}
      />
      
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Lead Generation</h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">Hoş geldiniz, {user?.email}</p>
        </div>
        <div className="flex items-center gap-4">
            <div className="text-right">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                    {plan} Plan
                </p>
                <p className="text-lg font-semibold text-indigo-600 dark:text-indigo-400">
                    {user?.credits} Credits
                </p>
            </div>
            <ThemeToggle />
             <button
                onClick={() => window.location.hash = '#pricing'}
                className="px-4 py-2 text-sm font-semibold bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-md hover:from-blue-600 hover:to-purple-700"
            >
                Yükselt
            </button>
            <button
              onClick={logout}
              className="px-4 py-2 text-sm font-medium bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"
            >
              Çıkış
            </button>
        </div>
      </header>
      
      <div className="flex space-x-2 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
        <TabButton view="search" label="Lead Ara" />
        <TabButton view="myLeads" label={`Lead Listem (${myLeads.length})`} />
      </div>

      {/* Main Layout: Content + Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content Area */}
        <main className="lg:col-span-3">
        {activeView === 'search' && (
          <div>
            <SearchFormEnhanced onSearch={handleSearch} isLoading={isLoading} />
            {isLoading ? (
              <TableSkeleton rows={10} />
            ) : searchError ? (
                <div className="text-center py-10 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg shadow-md mt-6">
                    <h3 className="text-lg font-medium text-red-800 dark:text-red-200">Arama Başarısız</h3>
                    <p className="mt-1 text-sm text-red-600 dark:text-red-300">{searchError}</p>
                </div>
            ) : (
                <>
                  <SearchResultsTable 
                    leads={searchResults} 
                    onAddLead={addLeadToList} 
                    myLeadIds={myLeadIds}
                  />
                  
                  {/* Pagination for Search Results */}
                  {allSearchResults.length > 0 && (
                    <div className="mt-6">
                      <Pagination
                        currentPage={currentSearchPage}
                        totalItems={allSearchResults.length}
                        leadsPerPage={RESULT_LIMITS[plan] || 10}
                        onPageChange={(page) => {
                          setCurrentSearchPage(page);
                          const displayLimit = RESULT_LIMITS[plan] || 10;
                          const start = (page - 1) * displayLimit;
                          const end = start + displayLimit;
                          setSearchResults(allSearchResults.slice(start, end));
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                      />
                      <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-2">
                        Toplam {allSearchResults.length} lead bulundu • Sayfa başına {RESULT_LIMITS[plan] || 10} lead gösteriliyor
                      </p>
                    </div>
                  )}
                </>
            )}
          </div>
        )}

        {activeView === 'myLeads' && (
          <div>
            {myLeads.length > 0 ? (
                <>
                    <FilterControls
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        statusFilter={statusFilter}
                        setStatusFilter={setStatusFilter}
                        qualityScoreFilter={qualityScoreFilter}
                        setQualityScoreFilter={setQualityScoreFilter}
                        minRating={minRating}
                        setMinRating={setMinRating}
                        minReviews={minReviews}
                        setMinReviews={setMinReviews}
                        onExport={handleExport}
                        onExportCSV={handleExportCSV}
                        filteredCount={filteredMyLeads.length}
                    />
                    <ResultsTable 
                        leads={paginatedMyLeads} 
                        updateLead={updateLeadInList} 
                        removeLead={removeLeadFromList} 
                        enrichLead={handleEnrichLead}
                        enrichingId={enrichingId}
                    />
                    {filteredMyLeads.length > LEADS_PER_PAGE && (
                        <Pagination
                            currentPage={currentPage}
                            totalLeads={filteredMyLeads.length}
                            leadsPerPage={LEADS_PER_PAGE}
                            onPageChange={setCurrentPage}
                        />
                    )}
                </>
            ) : (
                 <div className="text-center py-10 bg-white dark:bg-gray-800 rounded-lg shadow-md mt-6">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Lead listeniz boş.</h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">"Lead Ara" sekmesine giderek yeni lead'ler bulun ve ekleyin.</p>
                </div>
            )}
          </div>
        )}
        </main>

        {/* Sidebar */}
        <aside className="lg:col-span-1 space-y-6">
          {/* Usage Dashboard */}
          <UsageDashboard />

          {/* Stats Summary (only in myLeads view) */}
          {activeView === 'myLeads' && myLeads.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Lead Özeti
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Toplam</span>
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                      {myLeads.length}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '100%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Yüksek Kalite</span>
                    <span className="text-lg font-bold text-green-600 dark:text-green-400">
                      {myLeads.filter(l => l.qualityScore >= 60).length}
                    </span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Email Mevcut</span>
                    <span className="text-lg font-bold text-purple-600 dark:text-purple-400">
                      {myLeads.filter(l => l.email).length}
                    </span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Ort. Kalite</span>
                    <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                      {myLeads.length > 0 
                        ? Math.round(myLeads.reduce((sum, l) => sum + l.qualityScore, 0) / myLeads.length)
                        : 0}/80
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </aside>
      </div>

      <footer className="text-center mt-8 text-sm text-gray-500 dark:text-gray-400">
        <p>Lead verileri Google Maps & Gemini AI tarafından sağlanmaktadır.</p>
      </footer>
    </div>
  );
};

export default DashboardPage;