'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { request } from '@/lib/api-client';
import type { SiteConfig } from '@/types';

export const siteConfigKeys = {
  all:    ['siteConfig'] as const,
  detail: () => ['siteConfig', 'detail'] as const,
};

export const DEFAULT_CHAT_CONFIG = {
  chatbotEnabled: true,
  botName: 'AeroBot',
  greetingMessage: 'Hello! Welcome to AeroTurbineSpare. How can I help you today?',
  whatsappEnabled: true,
  whatsappMode: 'normal' as const,
  whatsappNumber: '+31611879800',
  whatsappBusinessPhoneId: '',
  whatsappBusinessAccountId: '',
  whatsappBusinessToken: '',
  whatsappVerifyToken: '',
  aiConfig: {
    enabled: false,
    provider: 'openai' as const,
    apiKey: '',
    model: 'gpt-4o-mini',
    customBaseUrl: '',
    customModel: '',
  },
  inboxNotifyEmail: '',
  humanHandoffEnabled: true,
};

export const DEFAULT_CONFIG: SiteConfig = {
  logoHeight:   40,
  logoWidth:    0,
  logoPaddingX: 16,
  logoPaddingY: 8,
  logoMarginX:  0,
  logoMarginY:  0,
  logoText:     'AeroTurbineSpare',
  logoSubText:  'Aerospace Parts Exchange',
  logoImageUrl: undefined,
  logoLink:     '/',
  heroHeading:    'Source Aerospace Parts with Confidence',
  heroSubheading: 'Global inventory of aviation, turbine, and defense components — NSN, CAGE, and part-number searchable in seconds.',
  heroBadgeText:  'Trusted by 500+ Aviation Companies',
  heroBgType:     'gradient',
  heroBgValue:    '#0A1628',
  heroCta1Label:  'Search Inventory',
  heroCta1Href:   '/catalog',
  heroCta2Label:  'Request a Quote',
  heroCta2Href:   '/rfq',
  chat: DEFAULT_CHAT_CONFIG,
  updatedAt: '',
  updatedBy: 'system',
};

function mergeWithDefaults(data: SiteConfig): SiteConfig {
  return {
    ...DEFAULT_CONFIG,
    ...data,
    chat: {
      ...DEFAULT_CHAT_CONFIG,
      ...(data.chat || {}),
    },
  };
}

export function useSiteConfig() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: siteConfigKeys.detail(),
    queryFn:  async () => {
      const res = await request<{ success: boolean; data: SiteConfig }>('/site-config');
      return res.success && res.data ? mergeWithDefaults(res.data) : DEFAULT_CONFIG;
    },
    staleTime: 5 * 60 * 1000,
    placeholderData: DEFAULT_CONFIG,
  });

  const saveMutation = useMutation({
    mutationFn: async (updates: Partial<SiteConfig>) => {
      const current = query.data ?? DEFAULT_CONFIG;
      const merged = { ...current, ...updates };
      const toSend = { ...merged, logoImageUrl: merged.logoImageUrl || null };
      const res = await request<{ success: boolean; data: SiteConfig; message?: string }>(
        '/site-config',
        { method: 'PUT', body: JSON.stringify(toSend) }
      );
      if (res.success && res.data) return mergeWithDefaults(res.data);
      return current;
    },
    onSuccess: (saved) => {
      queryClient.setQueryData(siteConfigKeys.detail(), saved);
    },
  });

  return {
    config:   query.data ?? DEFAULT_CONFIG,
    loading:  query.isLoading,
    saving:   saveMutation.isPending,
    save:     saveMutation.mutateAsync,
    reload:   () => queryClient.invalidateQueries({ queryKey: siteConfigKeys.detail() }),
  };
}
