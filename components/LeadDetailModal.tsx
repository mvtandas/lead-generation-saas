import React, { useState } from 'react';
import { Lead } from '../types';
import { PhoneIcon, EmailIcon, WebIcon, LinkedInIcon, FacebookIcon, InstagramIcon, MapPinIcon, StarIcon } from './icons/IconComponents';
import { isValidEmail, isValidPhone, isValidURL, formatURL } from '../utils/validation';

interface LeadDetailModalProps {
  lead: Lead;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updates: Partial<Lead>) => void;
}

const LeadDetailModal: React.FC<LeadDetailModalProps> = ({ lead, isOpen, onClose, onSave }) => {
  const [editedLead, setEditedLead] = useState<Lead>(lead);
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const validateField = (field: string, value: string): string => {
    if (!value) return '';
    
    switch (field) {
      case 'email':
        return isValidEmail(value) ? '' : 'Geçersiz email formatı';
      case 'phone':
        return isValidPhone(value) ? '' : 'Geçersiz telefon formatı';
      case 'website':
      case 'linkedin':
      case 'facebook':
      case 'instagram':
        return isValidURL(formatURL(value)) ? '' : 'Geçersiz URL formatı';
      default:
        return '';
    }
  };

  const handleSave = () => {
    // Validate all fields before saving
    const newErrors: Record<string, string> = {};
    
    if (editedLead.email) {
      const emailError = validateField('email', editedLead.email);
      if (emailError) newErrors.email = emailError;
    }
    
    if (editedLead.phone) {
      const phoneError = validateField('phone', editedLead.phone);
      if (phoneError) newErrors.phone = phoneError;
    }
    
    if (editedLead.website) {
      const websiteError = validateField('website', editedLead.website);
      if (websiteError) newErrors.website = websiteError;
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Format URLs before saving
    const formattedLead = { ...editedLead };
    if (formattedLead.website) formattedLead.website = formatURL(formattedLead.website);
    if (formattedLead.linkedin) formattedLead.linkedin = formatURL(formattedLead.linkedin);
    if (formattedLead.facebook) formattedLead.facebook = formatURL(formattedLead.facebook);
    if (formattedLead.instagram) formattedLead.instagram = formatURL(formattedLead.instagram);
    
    onSave(formattedLead);
    onClose();
  };

  const handleChange = (field: keyof Lead, value: any) => {
    setEditedLead(prev => ({ ...prev, [field]: value }));
    
    // Clear error for this field if it exists
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
    
    // Validate on change
    if (value && typeof value === 'string') {
      const error = validateField(field, value);
      if (error) {
        setErrors(prev => ({ ...prev, [field]: error }));
      }
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 60) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    if (score >= 40) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div 
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Lead Detayları</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-6">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Şirket Bilgileri</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Şirket Adı
                </label>
                <input
                  type="text"
                  value={editedLead.companyName}
                  onChange={(e) => handleChange('companyName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Kategori
                </label>
                <input
                  type="text"
                  value={editedLead.category}
                  onChange={(e) => handleChange('category', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Açıklama
                </label>
                <textarea
                  value={editedLead.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">İletişim Bilgileri</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <PhoneIcon className="inline w-4 h-4 mr-1" />
                  Telefon
                </label>
                <input
                  type="tel"
                  value={editedLead.phone || ''}
                  onChange={(e) => handleChange('phone', e.target.value || null)}
                  className={`w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                    errors.phone ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="Telefon numarası"
                />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <EmailIcon className="inline w-4 h-4 mr-1" />
                  Email
                </label>
                <input
                  type="email"
                  value={editedLead.email || ''}
                  onChange={(e) => handleChange('email', e.target.value || null)}
                  className={`w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                    errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="Email adresi"
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <WebIcon className="inline w-4 h-4 mr-1" />
                  Website
                </label>
                <input
                  type="url"
                  value={editedLead.website || ''}
                  onChange={(e) => handleChange('website', e.target.value || null)}
                  className={`w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                    errors.website ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="https://example.com"
                />
                {errors.website && <p className="text-red-500 text-xs mt-1">{errors.website}</p>}
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Sosyal Medya</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <LinkedInIcon className="inline w-4 h-4 mr-1" />
                  LinkedIn
                </label>
                <input
                  type="url"
                  value={editedLead.linkedin || ''}
                  onChange={(e) => handleChange('linkedin', e.target.value || null)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="LinkedIn URL"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <FacebookIcon className="inline w-4 h-4 mr-1" />
                  Facebook
                </label>
                <input
                  type="url"
                  value={editedLead.facebook || ''}
                  onChange={(e) => handleChange('facebook', e.target.value || null)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Facebook URL"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <InstagramIcon className="inline w-4 h-4 mr-1" />
                  Instagram
                </label>
                <input
                  type="url"
                  value={editedLead.instagram || ''}
                  onChange={(e) => handleChange('instagram', e.target.value || null)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Instagram URL"
                />
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Konum</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Adres
                </label>
                <input
                  type="text"
                  value={editedLead.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Şehir
                </label>
                <input
                  type="text"
                  value={editedLead.city}
                  onChange={(e) => handleChange('city', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Ülke
                </label>
                <input
                  type="text"
                  value={editedLead.country}
                  onChange={(e) => handleChange('country', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Ratings & Quality */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Değerlendirme ve Kalite</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Rating
                </label>
                <div className="flex items-center gap-2">
                  <StarIcon filled={true} />
                  <span className="text-gray-900 dark:text-white">{editedLead.rating.toFixed(1)}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Review Sayısı
                </label>
                <p className="text-gray-900 dark:text-white">{editedLead.reviewCount}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Kalite Skoru
                </label>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(editedLead.qualityScore)}`}>
                  {editedLead.qualityScore} / 80
                </span>
              </div>

              <div className="md:col-span-3">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Kalite Açıklaması
                </label>
                <p className="text-sm text-gray-600 dark:text-gray-400">{editedLead.qualityReasoning}</p>
              </div>
            </div>
          </div>

          {/* Status & Notes */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Durum ve Notlar</h3>
            
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Durum
                </label>
                <select
                  value={editedLead.status}
                  onChange={(e) => handleChange('status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Interested">Interested</option>
                  <option value="Not Interested">Not Interested</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Notlar
                </label>
                <textarea
                  value={editedLead.notes || ''}
                  onChange={(e) => handleChange('notes', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Lead hakkında notlarınızı buraya yazın..."
                />
              </div>
            </div>
          </div>

          {/* Additional Info */}
          {editedLead.googleMapsUri && (
            <div>
              <a
                href={editedLead.googleMapsUri}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                <MapPinIcon className="mr-1" />
                Google Maps'te Görüntüle
              </a>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            İptal
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
          >
            Kaydet
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeadDetailModal;

