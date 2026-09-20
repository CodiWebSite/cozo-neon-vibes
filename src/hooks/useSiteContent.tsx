import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface SiteContentRow {
  content_key: string;
  content_value: string;
  label: string;
  section: string;
}

export const useSiteContentRows = () =>
  useQuery({
    queryKey: ['site_content'],
    queryFn: async (): Promise<SiteContentRow[]> => {
      const { data, error } = await supabase
        .from('site_content')
        .select('content_key, content_value, label, section')
        .order('section', { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
    staleTime: 60_000,
  });

/**
 * Returns a translate-like helper: t('hero_badge', 'fallback text')
 */
export const useSiteContent = () => {
  const { data, isLoading } = useSiteContentRows();

  const map = new Map((data ?? []).map((row) => [row.content_key, row.content_value]));

  const t = (key: string, fallback: string) => {
    const value = map.get(key);
    return value && value.trim().length > 0 ? value : fallback;
  };

  return { t, isLoading };
};
