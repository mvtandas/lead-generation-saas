import React, { useState } from 'react';
import { Lead } from '../types';
import { PhoneIcon, EmailIcon, WebIcon, LinkedInIcon, FacebookIcon, InstagramIcon, StarIcon, MapPinIcon, XCircleIcon, SparklesIcon } from './icons/IconComponents';
import LeadDetailModal from './LeadDetailModal';

interface ResultsTableProps {
  leads: Lead[];
  updateLead: (id: string, updates: Partial<Lead>) => void;
  removeLead: (id: string) => void;
  enrichLead: (id: string) => void;
  enrichingId: string | null;
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

const EditableNote: React.FC<{ note: string; onSave: (newNote: string) => void }> = ({ note, onSave }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [text, setText] = useState(note);

    const handleSave = () => {
        onSave(text);
        setIsEditing(false);
    };

    if (isEditing) {
        return (
            <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                onBlur={handleSave}
                className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm resize-none"
                autoFocus
                rows={3}
            />
        );
    }

    return (
        <div onClick={() => setIsEditing(true)} className="min-h-[2rem] cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 p-1 rounded">
            <p className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap break-words">{note || 'Click to add notes...'}</p>
        </div>
    );
};


const ResultsTable: React.FC<ResultsTableProps> = ({ leads, updateLead, removeLead, enrichLead, enrichingId }) => {
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  
  if (leads.length === 0) {
    return (
        <div className="text-center py-10 bg-white dark:bg-gray-800 rounded-lg shadow-md mt-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">No leads in your list</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Add leads from the 'Search Leads' tab to get started.</p>
        </div>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 60) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    if (score >= 40) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
  }

  return (
    <>
      {selectedLead && (
        <LeadDetailModal
          lead={selectedLead}
          isOpen={true}
          onClose={() => setSelectedLead(null)}
          onSave={(updates) => {
            updateLead(selectedLead.id, updates);
            setSelectedLead(null);
          }}
        />
      )}
      <div className="mt-6 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700 table-auto">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-white sm:pl-6 w-[25%]">Company</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white w-[18%]">Contact Details</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white w-[15%]">Quality Score</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white w-[12%]">Status</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white w-[20%]">Notes</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white w-[10%]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800/50">
                {leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50">
                    <td className="py-4 pl-4 pr-3 text-sm sm:pl-6 align-top">
                      <div className="font-medium text-gray-900 dark:text-white break-words">{lead.companyName}</div>
                      <div className="italic text-gray-500 dark:text-gray-400 break-words">{lead.category}</div>
                      <div className="text-gray-500 dark:text-gray-400 break-words mt-1">{lead.address}</div>
                       <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 whitespace-pre-wrap break-words">{lead.description}</p>
                    </td>
                    <td className="px-3 py-4 text-sm align-top">
                      <div className="flex flex-col space-y-1.5 text-gray-500 dark:text-gray-400">
                          {lead.phone && (
                              <a href={`tel:${lead.phone}`} title={lead.phone} className="flex items-center hover:text-indigo-600 group">
                                  <PhoneIcon />
                                  <span className="ml-2 group-hover:underline">{lead.phone}</span>
                              </a>
                          )}
                          {lead.email && (
                              <a href={`mailto:${lead.email}`} title={lead.email} className="flex items-center hover:text-indigo-600 group">
                                  <EmailIcon />
                                  <span className="ml-2 truncate group-hover:underline">{lead.email}</span>
                              </a>
                          )}
                          {lead.website && (
                              <a href={lead.website} target="_blank" rel="noopener noreferrer" title={lead.website} className="flex items-center hover:text-indigo-600 group">
                                  <WebIcon />
                                  <span className="ml-2 truncate group-hover:underline">{lead.website.replace(/^(https?:\/\/)?(www\.)?/, '')}</span>
                              </a>
                          )}
                          <div className="flex items-center space-x-3 pt-1">
                            {lead.linkedin && <a href={lead.linkedin} target="_blank" rel="noopener noreferrer" title="LinkedIn Profile" className="text-gray-400 hover:text-blue-700"><LinkedInIcon/></a>}
                            {lead.facebook && <a href={lead.facebook} target="_blank" rel="noopener noreferrer" title="Facebook Page" className="text-gray-400 hover:text-blue-600"><FacebookIcon/></a>}
                            {lead.instagram && <a href={lead.instagram} target="_blank" rel="noopener noreferrer" title="Instagram Profile" className="text-gray-400 hover:text-pink-500"><InstagramIcon/></a>}
                            {lead.googleMapsUri && <a href={lead.googleMapsUri} target="_blank" rel="noopener noreferrer" title="View on Google Maps" className="text-gray-400 hover:text-red-500"><MapPinIcon/></a>}
                          </div>
                      </div>
                    </td>
                    <td className="px-3 py-4 text-sm text-gray-500 dark:text-gray-400 align-top">
                        <div className="flex flex-col">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getScoreColor(lead.qualityScore)}`}>
                                {lead.qualityScore} / 80
                            </span>
                            <span className="text-xs mt-1 whitespace-normal" title={lead.qualityReasoning}>{lead.qualityReasoning}</span>
                        </div>
                    </td>
                    <td className="px-3 py-4 text-sm text-gray-500 dark:text-gray-400 align-top">
                        <select
                            value={lead.status}
                            onChange={(e) => updateLead(lead.id, { status: e.target.value as Lead['status'] })}
                            className="text-sm rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white focus:ring-indigo-500 focus:border-indigo-500 w-full"
                        >
                            <option>New</option>
                            <option>Contacted</option>
                            <option>Interested</option>
                            <option>Not Interested</option>
                        </select>
                    </td>
                    <td className="px-3 py-4 text-sm text-gray-500 dark:text-gray-400 align-top">
                       <EditableNote note={lead.notes || ''} onSave={(newNote) => updateLead(lead.id, { notes: newNote })} />
                    </td>
                    <td className="px-3 py-4 text-sm text-gray-500 dark:text-gray-400 align-top">
                        <div className="flex items-center space-x-2">
                            <button 
                                onClick={() => setSelectedLead(lead)}
                                className="text-gray-400 hover:text-blue-600" 
                                title="Detayları görüntüle"
                             >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                            </button>
                            <button 
                                onClick={() => enrichLead(lead.id)} 
                                disabled={!lead.website || enrichingId === lead.id}
                                className="text-gray-400 hover:text-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed" 
                                title={!lead.website ? 'Website required to enrich' : 'Enrich with AI'}
                             >
                                {enrichingId === lead.id ? (
                                    <svg className="animate-spin h-5 w-5 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                ) : (
                                    <SparklesIcon />
                                )}
                            </button>
                            <button onClick={() => removeLead(lead.id)} className="text-gray-400 hover:text-red-600" title="Remove from list">
                                <XCircleIcon />
                            </button>
                        </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResultsTable;