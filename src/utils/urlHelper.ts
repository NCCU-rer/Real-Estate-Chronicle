// src/utils/urlHelper.ts

export interface DashboardParams {
  start?: string;
  end?: string;
  main?: string;
  compare?: string[];
}

export const encodeDashboardUrl = (params: DashboardParams) => {
  if (typeof window === 'undefined') return '';
  const url = new URL(window.location.origin + window.location.pathname);
  if (params.start) url.searchParams.set('start', params.start);
  if (params.end) url.searchParams.set('end', params.end);
  if (params.main) url.searchParams.set('main', params.main);
  if (params.compare && params.compare.length > 0) {
    url.searchParams.set('compare', params.compare.join(','));
  }
  return url.toString();
};

export const decodeDashboardUrl = (): DashboardParams => {
  if (typeof window === 'undefined') return {};
  const params = new URLSearchParams(window.location.search);
  return {
    start: params.get('start') || undefined,
    end: params.get('end') || undefined,
    main: params.get('main') || undefined,
    compare: params.get('compare')?.split(',').filter(Boolean) || undefined,
  };
};
