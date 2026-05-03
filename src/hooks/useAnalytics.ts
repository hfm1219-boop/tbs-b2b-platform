import { useCallback } from 'react';
import { User, AnalyticsEventName, AnalyticsEventCategory, AnalyticsEventPayload } from '../types';
import { 
  trackEvent, 
  trackPageView, 
  trackCtaClick, 
  getAnalyticsUserRole 
} from '../services/analytics';

export const useAnalytics = (currentUser: User | null) => {
  const trackPageViewHook = useCallback((page: string, path: string = '', extra: AnalyticsEventPayload = {}) => {
    trackPageView(page, path, currentUser, extra);
  }, [currentUser]);

  const trackCta = useCallback((label: string, source: string, target: string, extra: AnalyticsEventPayload = {}) => {
    trackCtaClick(label, source, target, currentUser, extra);
  }, [currentUser]);

  const track = useCallback((name: AnalyticsEventName, category: AnalyticsEventCategory, payload: AnalyticsEventPayload = {}) => {
    trackEvent(name, category, {
      ...payload,
      userRole: getAnalyticsUserRole(currentUser)
    });
  }, [currentUser]);

  const trackError = useCallback((reason: string, source: string, extra: AnalyticsEventPayload = {}) => {
    track('permission_denied', 'error', {
      reason,
      source,
      ...extra
    });
  }, [track]);

  const trackPermissionDenied = useCallback((moduleName: string, reason: string = 'access_required') => {
    trackError(reason, moduleName);
  }, [trackError]);

  const trackSearch = useCallback((moduleName: string, searchTerm: string, extra: AnalyticsEventPayload = {}) => {
    track(
      moduleName === 'faq' ? 'faq_search' : 'catalog_search',
      moduleName === 'faq' ? 'faq' : 'catalog',
      {
        searchTerm,
        source: moduleName,
        ...extra
      }
    );
  }, [track]);

  const trackFilter = useCallback((moduleName: string, filterName: string, filterValue: string) => {
    track('catalog_filter_used', 'catalog', {
      source: moduleName,
      filterName,
      filterValue
    });
  }, [track]);

  const trackFormStart = useCallback((formName: string, source: string = 'page') => {
    track('access_request_started', 'public_acquisition', {
      source,
      metadata: { formName }
    });
  }, [track]);

  const trackFormSubmit = useCallback((formName: string, success: boolean, extra: AnalyticsEventPayload = {}) => {
    track('access_request_submitted', 'public_acquisition', {
      success,
      metadata: { formName },
      ...extra
    });
  }, [track]);

  return {
    trackPageView: trackPageViewHook,
    trackCta,
    track,
    trackError,
    trackPermissionDenied,
    trackSearch,
    trackFilter,
    trackFormStart,
    trackFormSubmit
  };
};
