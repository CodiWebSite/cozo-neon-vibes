import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface SiteContent {
  id: string;
  content_key: string;
  content_value: string;
  content_type: string;
  description: string;
}

export const useContent = () => {
  const [content, setContent] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  const fetchContent = async () => {
    try {
      const { data, error } = await supabase
        .from('site_content')
        .select('*');

      if (error) throw error;

      const contentMap = data?.reduce((acc, item) => {
        acc[item.content_key] = item.content_value;
        return acc;
      }, {} as Record<string, string>) || {};

      setContent(contentMap);
    } catch (error) {
      console.error('Error fetching content:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  const getContent = (key: string, fallback = '') => {
    return content[key] || fallback;
  };

  return { content, getContent, loading, refetch: fetchContent };
};