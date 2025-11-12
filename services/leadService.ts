import { GoogleGenAI, Type } from "@google/genai";
import { Lead } from '../types';

// Add `gm_authFailure` and our callback to the global Window interface
declare global {
    interface Window {
        google: any;
        gm_authFailure?: () => void;
        __googleMapsCallback?: () => void;
    }
}

// This informs TypeScript about the 'google' object from the Maps API script
declare const google: any;

// Initialize the Google Gemini AI Client
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || process.env.API_KEY });

let mapsLoadingPromise: Promise<void> | null = null;

const loadGoogleMapsScript = (): Promise<void> => {
    if (mapsLoadingPromise) {
        return mapsLoadingPromise;
    }

    // If script is already loaded and available, resolve immediately
    if (window.google && window.google.maps && window.google.maps.places) {
        return Promise.resolve();
    }

    mapsLoadingPromise = new Promise((resolve, reject) => {
        const scriptId = 'google-maps-script';
        
        // Ensure no old script or callbacks are lingering from previous attempts
        document.getElementById(scriptId)?.remove();
        delete window.gm_authFailure;
        delete window.__googleMapsCallback;

        const cleanupAndReset = (error: Error) => {
            document.getElementById(scriptId)?.remove();
            delete window.gm_authFailure;
            delete window.__googleMapsCallback;
            // IMPORTANT: Reset promise to allow the operation to be retried
            mapsLoadingPromise = null; 
            reject(error);
        };

        // This is the official Google Maps callback for authentication failures.
        window.gm_authFailure = () => {
            console.error("Google Maps authentication failed: Invalid API Key.");
            const error = new Error('Google Maps API key is invalid or incorrectly configured. Please check your key and ensure the "Maps JavaScript API" is enabled in your Google Cloud project.');
            cleanupAndReset(error);
        };
        
        // This is our callback function that Google Maps will call on successful script load.
        window.__googleMapsCallback = () => {
            console.log('Google Maps API script loaded successfully via callback.');
            // On success, only clean up the callbacks. Do not reset the promise,
            // so subsequent calls will use the already loaded script.
            delete window.gm_authFailure;
            delete window.__googleMapsCallback;
            resolve();
        };

        const script = document.createElement('script');
        script.id = scriptId;
        // Add `loading=async` to address performance warnings and align with best practices.
        const googleApiKey = process.env.GOOGLE_API_KEY || process.env.API_KEY;
        if (!googleApiKey) {
            const error = new Error('Google Maps API key is not configured. Please set GOOGLE_API_KEY in your .env file.');
            cleanupAndReset(error);
            return;
        }
        script.src = `https://maps.googleapis.com/maps/api/js?key=${googleApiKey}&libraries=places&loading=async&callback=__googleMapsCallback`;
        script.async = true;
        
        // Handles network errors or cases where the script fails to load.
        script.onerror = (event) => {
            console.error('Error loading Google Maps API script:', event);
            const error = new Error('Failed to load the Google Maps script. Check your network connection and browser console for details.');
            cleanupAndReset(error);
        };

        document.head.appendChild(script);
    });

    return mapsLoadingPromise;
};


const calculateQualityScore = (lead: Partial<Lead>): { score: number; reasoning: string } => {
  let score = 0;
  const reasons: string[] = [];

  if (lead.phone) {
    score += 15;
    reasons.push('Phone');
  }
  if (lead.email) {
    score += 20;
    reasons.push('Email');
  }
  if (lead.website) {
    score += 15;
    reasons.push('Website');
  }
  if (lead.rating && lead.rating >= 4.0) {
    score += 10;
    reasons.push('High rating');
  }
  if (lead.reviewCount && lead.reviewCount >= 50) {
    score += 10;
    reasons.push('High review count');
  }
   if (lead.linkedin || lead.facebook || lead.instagram) {
    score += 5;
    reasons.push('Social media');
  }
  if (lead.address && lead.address !== 'N/A') {
    score += 5;
    reasons.push('Address');
  }

  return {
    score,
    reasoning: reasons.length > 0 ? `Scored for: ${reasons.join(', ')}.` : 'Basic info available.',
  };
};

const fetchFromGoogleMaps = async (query: string, maxResults: number = 20): Promise<any[]> => {
    await loadGoogleMapsScript();

    return new Promise((resolve, reject) => {
        if (typeof google === 'undefined' || !google.maps || !google.maps.places) {
            reject(new Error("Google Maps Places library failed to load."));
            return;
        }

        console.log(`🔍 LEGACY API: Searching for "${query}" (max ${maxResults} results)`);

        const mapDiv = document.createElement('div');
        const map = new google.maps.Map(mapDiv);
        const service = new google.maps.places.PlacesService(map);

        const request = {
            query: query,
            fields: ['place_id', 'name', 'formatted_address', 'geometry', 'types', 'rating', 'user_ratings_total']
        };

        service.textSearch(request, async (results: any, status: any) => {
            if (status === google.maps.places.PlacesServiceStatus.OK && results) {
                console.log(`✅ LEGACY API: Found ${results.length} places`);

                // Fetch phone/website for each place using getDetails
                const detailedResults = await Promise.all(
                    results.map((place: any) => {
                        return new Promise<any>((resolvePlace) => {
                            service.getDetails(
                                {
                                    placeId: place.place_id,
                                    fields: ['formatted_phone_number', 'website', 'url']
                                },
                                (details: any, detailStatus: any) => {
                                    if (detailStatus === google.maps.places.PlacesServiceStatus.OK && details) {
                                        resolvePlace({
                                            place_id: place.place_id,
                                            name: place.name,
                                            formatted_address: place.formatted_address,
                                            types: place.types || [],
                                            website: details.website || null,
                                            formatted_phone_number: details.formatted_phone_number || null,
                                            rating: place.rating || 0,
                                            user_ratings_total: place.user_ratings_total || 0,
                                            url: details.url || null
                                        });
                                    } else {
                                        // Return place without phone/website if details fail
                                        resolvePlace({
                                            place_id: place.place_id,
                                            name: place.name,
                                            formatted_address: place.formatted_address,
                                            types: place.types || [],
                                            website: null,
                                            formatted_phone_number: null,
                                            rating: place.rating || 0,
                                            user_ratings_total: place.user_ratings_total || 0,
                                            url: null
                                        });
                                    }
                                }
                            );
                        });
                    })
                );

                const limitedResults = detailedResults.slice(0, maxResults);
                const withPhone = limitedResults.filter(r => r.formatted_phone_number).length;
                const withWebsite = limitedResults.filter(r => r.website).length;
                
                console.log(`✅ LEGACY API Total: ${limitedResults.length} places (${withPhone} phone, ${withWebsite} website)`);
                
                resolve(limitedResults);
            } else {
                reject(new Error(`Google Maps API status: ${status}`));
            }
        });
    });
};


export const fetchLeads = async (country: string, city: string, district: string, keyword: string, source: 'maps' | 'web', maxResults: number = 20): Promise<Omit<Lead, 'status' | 'notes'>[]> => {
  console.log(`Fetching leads for ${keyword} in ${district}, ${city}, ${country} using ${source} (max ${maxResults} results)...`);
  
  if (source === 'maps') {
      try {
          const query = `${keyword} in ${district}, ${city}, ${country}`;
          const mapResults = await fetchFromGoogleMaps(query, maxResults);

          const generatedLeads: Omit<Lead, 'status' | 'notes'>[] = mapResults.map((item, index) => {
              const leadDataForScoring: Partial<Lead> = {
                phone: item.formatted_phone_number || null,
                email: null,
                website: item.website || null,
                rating: item.rating || 0,
                reviewCount: item.user_ratings_total || 0,
                address: item.formatted_address,
                linkedin: null,
                facebook: null,
                instagram: null,
              };

              const { score, reasoning } = calculateQualityScore(leadDataForScoring);
              
              const category = item.types && item.types.length > 0
                  ? item.types[0].replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())
                  : keyword;

              return {
                id: item.place_id!,
                generatedDate: new Date().toLocaleDateString(),
                searchCity: city,
                searchCountry: country,
                searchDistrict: district,
                leadNumber: index + 1,
                companyName: item.name!,
                category: category,
                description: `A ${category} establishment located in ${city}.`,
                address: item.formatted_address || 'N/A',
                city: city,
                country: country,
                phone: item.formatted_phone_number || null,
                email: null,
                website: item.website || null,
                rating: item.rating || 0,
                reviewCount: item.user_ratings_total || 0,
                googleMapsUri: item.url || null,
                linkedin: null,
                facebook: null,
                instagram: null,
                businessHours: 'N/A',
                qualityScore: score,
                qualityReasoning: reasoning,
              };
          });

          console.log(`Successfully fetched ${generatedLeads.length} leads using Google Maps API.`);
          return generatedLeads;
      } catch (error) {
          console.error(`Error fetching leads from Google Maps API:`, error);
          throw error;
      }
  }

  // Web search using Gemini
  const MAX_RETRIES = 3;
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      try {
            const prompt = `Your task is to act as a data scraper. Your response MUST be ONLY a valid JSON array of objects and nothing else. Do not include any introductory text, explanations, or markdown formatting like \`\`\`json. Find up to 15 businesses fitting '${keyword}' in ${district}, ${city}, ${country} using a web search. For each business, provide these exact keys: "companyName", "category", "description", "address", "phone", "website". If a value is not found, it must be null. Your entire output must start with '[' and end with ']'.`;
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: prompt,
                config: { 
                    tools: [{googleSearch: {}}],
                },
            });
        
        const rawText = response.text.trim();
        let jsonText = '[]';

        const markdownJsonMatch = rawText.match(/```(?:json)?\s*(\[[\s\S]*\])\s*```/);
        if (markdownJsonMatch && markdownJsonMatch[1]) {
            jsonText = markdownJsonMatch[1];
        } else {
            const firstBrace = rawText.indexOf('{');
            if (firstBrace !== -1) {
                const lastBracketBeforeBrace = rawText.lastIndexOf('[', firstBrace);
                if (lastBracketBeforeBrace !== -1) {
                    const lastBracket = rawText.lastIndexOf(']');
                    if (lastBracket > lastBracketBeforeBrace) {
                        jsonText = rawText.substring(lastBracketBeforeBrace, lastBracket + 1);
                    }
                }
            } else if (rawText.includes('[]')) {
                jsonText = '[]';
            } else {
                console.warn(`Could not find a valid JSON array in the response using web. Raw response:`, rawText);
            }
        }

        let parsedLeads: any[] = [];
        try {
            parsedLeads = JSON.parse(jsonText);
        } catch (parseError) {
            console.error(`Failed to parse JSON from Gemini API using web:`, jsonText, parseError);
            parsedLeads = [];
        }

        const validParsedLeads = Array.isArray(parsedLeads) ? parsedLeads.filter(
            (item): item is { companyName: string; [key: string]: any } =>
                item && typeof item.companyName === 'string' && item.companyName.trim() !== ''
        ) : [];

        const generatedLeads: Omit<Lead, 'status' | 'notes'>[] = validParsedLeads.map((item, index) => {
          const leadDataForScoring: Partial<Lead> = {
            phone: item.phone || null,
            email: null,
            website: item.website || null,
            rating: item.rating || 0,
            reviewCount: item.reviewCount || 0,
            address: item.address,
            linkedin: null,
            facebook: null,
            instagram: null,
          };

          const { score, reasoning } = calculateQualityScore(leadDataForScoring);
          
          const category = item.category || keyword;

          return {
            id: item.placeId || `${item.companyName.replace(/\s+/g, '-')}-${Date.now()}-${index}`,
            generatedDate: new Date().toLocaleDateString(),
            searchCity: city,
            searchCountry: country,
            searchDistrict: district,
            leadNumber: index + 1,
            companyName: item.companyName,
            category: category,
            description: item.description || `A ${category} establishment located in ${city}.`,
            address: item.address || 'N/A',
            city: city,
            country: country,
            phone: item.phone || null,
            email: null,
            website: item.website || null,
            rating: item.rating || 0,
            reviewCount: item.reviewCount || 0,
            googleMapsUri: item.googleMapsUri || null,
            linkedin: null,
            facebook: null,
            instagram: null,
            businessHours: item.businessHours || 'N/A',
            qualityScore: score,
            qualityReasoning: reasoning,
          };
        });
        
        console.log(`Successfully fetched ${generatedLeads.length} leads using web.`);
        return generatedLeads;

      } catch (error: any) {
        const isRetryable = error?.message?.includes('503') || error?.message?.includes('UNAVAILABLE');
        if (isRetryable && attempt < MAX_RETRIES - 1) {
            const delay = 1000 * Math.pow(2, attempt);
            console.warn(`Model overloaded (503). Attempt ${attempt + 1} failed. Retrying in ${delay}ms...`);
            await new Promise(resolve => setTimeout(resolve, delay));
            continue;
        }
        
        console.error(`Error fetching or parsing leads from Gemini API using web:`, error);
        throw error;
      }
  }

  return [];
};

const enrichmentSchema = {
    type: Type.OBJECT,
    properties: {
        email: { type: Type.STRING, description: "A publicly listed contact email address (e.g., info@, contact@). Should be null if not found." },
        linkedin: { type: Type.STRING, description: "The full URL of the company's official LinkedIn page. Should be null if not found." },
        facebook: { type: Type.STRING, description: "The full URL of the company's official Facebook page. Should be null if not found." },
        instagram: { type: Type.STRING, description: "The full URL of the company's official Instagram account. Should be null if not found." },
        description: { type: Type.STRING, description: "A 2-3 sentence summary of the company's business based on its website." },
    },
};


export const enrichLead = async (lead: Lead): Promise<Partial<Lead>> => {
    console.log(`🔍 Enriching lead with Gemini AI: ${lead.companyName}`);
    let enrichedData: Partial<Lead> = {};
    
    // Use Gemini AI for email and social media enrichment
    // Phone/Website already comes from initial search (NEW API)
    try {
        const websiteToUse = lead.website || 'unknown';
        const prompt = `
            Analyze the company '${lead.companyName}' with the website '${websiteToUse}' located at ${lead.address}. 
            Find the following information from the public web and the company's website:
            1. A publicly listed contact email address (like info@, contact@, etc.).
            2. The full URL of their official LinkedIn page.
            3. The full URL of their official Facebook page.
            4. The full URL of their official Instagram page.
            5. A concise 2-3 sentence description of what the company does, based on their 'About Us' or landing page.

            If a piece of information cannot be found, its value should be null.
            Return the information in a single raw JSON object. Do not include any surrounding text or markdown.
        `;
        
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: enrichmentSchema,
            },
        });
        
        let jsonText = response.text.trim();
        enrichedData = JSON.parse(jsonText) as Partial<Lead>;
        
        console.log(`✅ Gemini AI: Email ${enrichedData.email ? '✓' : '✗'}, Social ${enrichedData.linkedin ? '✓' : '✗'} for ${lead.companyName}`);
    } catch (error) {
        console.error(`❌ Error enriching with Gemini for ${lead.companyName}:`, error);
        throw new Error('Gemini AI ile zenginleştirme başarısız oldu');
    }
    
    // Recalculate quality score
    const updatedLeadData = { ...lead, ...enrichedData };
    const { score, reasoning } = calculateQualityScore(updatedLeadData);

    return { ...enrichedData, qualityScore: score, qualityReasoning: reasoning };
};