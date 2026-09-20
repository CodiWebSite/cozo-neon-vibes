import { supabase } from '@/integrations/supabase/client';

export interface GalleryRow {
  id: string;
  title: string;
  category: string;
  type: string;
  src: string | null;
  video_url: string | null;
  thumbnail: string | null;
  sort_order: number;
  created_at: string;
}

export interface ResolvedGalleryItem extends GalleryRow {
  displayUrl: string | null;
}

const isStoragePath = (value: string) => !/^https?:\/\//i.test(value) && !value.startsWith('/');

/** Turns storage paths into signed URLs that anyone can open for a year. */
export const resolveGalleryItems = async (rows: GalleryRow[]): Promise<ResolvedGalleryItem[]> => {
  const paths = rows
    .map((row) => row.src ?? row.video_url ?? '')
    .filter((value) => value.length > 0 && isStoragePath(value));

  let signed = new Map<string, string>();

  if (paths.length > 0) {
    const { data } = await supabase.storage.from('gallery').createSignedUrls(paths, 60 * 60 * 24 * 365);
    signed = new Map(
      (data ?? [])
        .filter((entry) => entry.signedUrl && entry.path)
        .map((entry) => [entry.path as string, entry.signedUrl])
    );
  }

  return rows.map((row) => {
    const raw = row.src ?? row.video_url ?? null;
    if (!raw) return { ...row, displayUrl: null };
    return { ...row, displayUrl: isStoragePath(raw) ? signed.get(raw) ?? null : raw };
  });
};
