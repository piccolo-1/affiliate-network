/**
 * Everflow Tracking System Integration
 *
 * This module provides integration with the Everflow affiliate tracking platform.
 * Everflow is used to track clicks, conversions, and manage affiliate tracking links.
 */

const EVERFLOW_API_URL = process.env.EVERFLOW_API_URL || 'https://api.eflow.team/v1';
const EVERFLOW_API_KEY = process.env.EVERFLOW_API_KEY;
const EVERFLOW_NETWORK_ID = process.env.EVERFLOW_NETWORK_ID;

class EverflowClient {
  constructor() {
    this.baseUrl = EVERFLOW_API_URL;
    this.apiKey = EVERFLOW_API_KEY;
    this.networkId = EVERFLOW_NETWORK_ID;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      'X-Eflow-API-Key': this.apiKey,
      ...options.headers,
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        throw new Error(`Everflow API error: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error('Everflow API request failed:', error);
      throw error;
    }
  }

  // Affiliate Management
  async createAffiliate(affiliateData) {
    return this.request('/networks/affiliates', {
      method: 'POST',
      body: JSON.stringify({
        network_id: this.networkId,
        ...affiliateData,
      }),
    });
  }

  async getAffiliate(affiliateId) {
    return this.request(`/networks/affiliates/${affiliateId}`);
  }

  async updateAffiliate(affiliateId, data) {
    return this.request(`/networks/affiliates/${affiliateId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Offer Management
  async getOffers(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/networks/offers?${queryString}`);
  }

  async getOffer(offerId) {
    return this.request(`/networks/offers/${offerId}`);
  }

  // Tracking Links
  async generateTrackingLink(affiliateId, offerId, options = {}) {
    // Standard Everflow tracking link format
    const baseTrackingUrl = `https://www.example-tracking.com/click`;
    const params = new URLSearchParams({
      a: affiliateId,
      o: offerId,
      ...options.subIds && { sub1: options.subIds.sub1 },
      ...options.subIds && { sub2: options.subIds.sub2 },
      ...options.subIds && { sub3: options.subIds.sub3 },
      ...options.subIds && { sub4: options.subIds.sub4 },
      ...options.subIds && { sub5: options.subIds.sub5 },
    });

    return `${baseTrackingUrl}?${params.toString()}`;
  }

  // Reporting
  async getAffiliateStats(affiliateId, params = {}) {
    const queryString = new URLSearchParams({
      affiliate_id: affiliateId,
      ...params,
    }).toString();
    return this.request(`/networks/reporting/entity/affiliates?${queryString}`);
  }

  async getOfferStats(offerId, params = {}) {
    const queryString = new URLSearchParams({
      offer_id: offerId,
      ...params,
    }).toString();
    return this.request(`/networks/reporting/entity/offers?${queryString}`);
  }

  async getClickReport(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/networks/reporting/clicks?${queryString}`);
  }

  async getConversionReport(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/networks/reporting/conversions?${queryString}`);
  }

  // Postback/Conversion Tracking
  async recordConversion(data) {
    return this.request('/networks/conversions', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Get daily stats summary
  async getDailyStats(affiliateId, startDate, endDate) {
    return this.request('/networks/reporting/daily', {
      method: 'POST',
      body: JSON.stringify({
        affiliate_id: affiliateId,
        from: startDate,
        to: endDate,
        timezone_id: 67, // UTC
        columns: [
          { column: 'date' },
          { column: 'gross_click' },
          { column: 'total_click' },
          { column: 'unique_click' },
          { column: 'invalid_click' },
          { column: 'cv' },
          { column: 'cvr' },
          { column: 'revenue' },
          { column: 'payout' },
          { column: 'profit' },
          { column: 'epc' },
        ],
      }),
    });
  }
}

// Export singleton instance
export const everflow = new EverflowClient();

// Helper function to format tracking URL with sub IDs
export function formatTrackingUrl(baseUrl, affiliateId, subIds = {}) {
  const url = new URL(baseUrl);
  url.searchParams.set('aff_id', affiliateId);

  Object.entries(subIds).forEach(([key, value]) => {
    if (value) {
      url.searchParams.set(key, value);
    }
  });

  return url.toString();
}

// Generate click tracking pixel
export function generateClickPixel(trackingUrl) {
  return `<img src="${trackingUrl}" width="1" height="1" style="display:none;" />`;
}

// Generate postback URL for conversion tracking
export function generatePostbackUrl(baseUrl, params = {}) {
  const url = new URL(baseUrl);
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });
  return url.toString();
}

export default everflow;
