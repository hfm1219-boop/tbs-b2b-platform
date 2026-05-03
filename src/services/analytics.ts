import { 
  AnalyticsEvent, 
  AnalyticsEventCategory, 
  AnalyticsEventName, 
  AnalyticsEventPayload, 
  AnalyticsUserRole, 
  User 
} from '../types';
import { ANALYTICS_CONFIG } from '../data/analyticsConfig';

/**
 * Sanitizes the payload to remove any Personally Identifiable Information (PII).
 */
export const sanitizeAnalyticsPayload = (payload: AnalyticsEventPayload): AnalyticsEventPayload => {
  const sanitized = { ...payload };
  const forbiddenKeys = [
    'email', 'correo', 'phone', 'telefono', 'mobile', 'celular', 
    'nit', 'vat', 'address', 'direccion', 'message', 'body', 
    'text', 'password', 'name', 'nombre'
  ];

  // Remove forbidden keys from the root payload
  Object.keys(sanitized).forEach(key => {
    if (forbiddenKeys.some(forbidden => key.toLowerCase().includes(forbidden))) {
      delete (sanitized as any)[key];
    }
  });

  // Handle searchTerm limiting and PII check
  if (sanitized.searchTerm) {
    let term = sanitized.searchTerm.substring(0, 80);
    // Rough check for email or long numbers (NIT/Phone) in search term
    if (term.includes('@') || /^\d{7,}$/.test(term.replace(/\s/g, ''))) {
      term = '[REDACTED]';
    }
    sanitized.searchTerm = term;
  }

  // Remove forbidden keys from metadata if it exists
  if (sanitized.metadata) {
    const sanitizedMetadata = { ...sanitized.metadata };
    Object.keys(sanitizedMetadata).forEach(key => {
      if (forbiddenKeys.some(forbidden => key.toLowerCase().includes(forbidden))) {
        delete sanitizedMetadata[key];
      }
    });
    sanitized.metadata = sanitizedMetadata;
  }

  return sanitized;
};

/**
 * Maps User role to AnalyticsUserRole.
 */
export const getAnalyticsUserRole = (user: User | null): AnalyticsUserRole => {
  if (!user) return 'visitante';
  
  if (user.role === 'admin') return 'admin';
  if (user.role === 'proveedor') return 'proveedor';
  if (user.role === 'marca') return 'marca';
  
  if (user.accountRole === 'comprador') return 'comprador';
  if (user.accountRole === 'finanzas') return 'finanzas';
  if (user.accountRole === 'master') return 'master';
  if (user.accountRole === 'aprobador') return 'aprobador';

  return 'cliente_b2b';
};

/**
 * Main function to track an event.
 */
export const trackEvent = (
  name: AnalyticsEventName, 
  category: AnalyticsEventCategory, 
  payload: AnalyticsEventPayload = {}
) => {
  if (!ANALYTICS_CONFIG.enabled) return;

  // Check for cookie consent before tracking analytics events
  // In production, connect this validation with real cookie preferences.
  // For now, in debug/prototype mode, we allow tracking if debug is on OR if consent is given.
  const savedPreferences = localStorage.getItem('tbs_cookie_preferences');
  let analyticsAllowed = true; // Default true for prototype/debug

  if (savedPreferences) {
    try {
      const preferences = JSON.parse(savedPreferences);
      const analyticsPref = preferences.find((p: any) => p.category === 'analytics');
      if (analyticsPref && analyticsPref.enabled === false && !ANALYTICS_CONFIG.debugInConsole) {
        analyticsAllowed = false;
      }
    } catch (e) {
      console.error('Error reading cookie preferences for analytics', e);
    }
  }

  if (!analyticsAllowed) {
    if (ANALYTICS_CONFIG.debugInConsole) {
      console.log(`[TBS Analytics] Blocked ${name} due to cookie preferences`);
    }
    return;
  }

  const sanitizedPayload = sanitizeAnalyticsPayload(payload);
  const event: AnalyticsEvent = {
    name,
    category,
    payload: sanitizedPayload,
    timestamp: new Date().toISOString()
  };

  // Log to console in debug mode
  if (ANALYTICS_CONFIG.debugInConsole) {
    console.log(`[TBS Analytics] ${event.name} (${event.category})`, event.payload);
  }

  // Push to dataLayer
  if (ANALYTICS_CONFIG.useDataLayer) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: event.name,
      event_category: event.category,
      timestamp: event.timestamp,
      ...event.payload
    });
  }
};

/**
 * Shorthand for page view tracking.
 */
export const trackPageView = (
  page: string, 
  path: string, 
  user: User | null, 
  extra: AnalyticsEventPayload = {}
) => {
  trackEvent('page_view', 'navigation', {
    page,
    path,
    userRole: getAnalyticsUserRole(user),
    ...extra
  });
};

/**
 * Shorthand for CTA click tracking.
 */
export const trackCtaClick = (
  ctaLabel: string, 
  source: string, 
  target: string, 
  user: User | null, 
  extra: AnalyticsEventPayload = {}
) => {
  trackEvent('cta_click', 'engagement', {
    ctaLabel,
    source,
    target,
    userRole: getAnalyticsUserRole(user),
    ...extra
  });
};

/**
 * Shorthand for error tracking.
 */
export const trackError = (
  reason: string, 
  source: string, 
  user: User | null, 
  extra: AnalyticsEventPayload = {}
) => {
  trackEvent('permission_denied', 'error', {
    reason,
    source,
    userRole: getAnalyticsUserRole(user),
    ...extra
  });
};
