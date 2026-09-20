import { supabase } from '@/integrations/supabase/client';

export interface GalleryRow {
  id: string;
  title: string;
  category: string;
  type: string;
  src: string | null;
  video_url: string | null;
  thumbnail: string | null;
  thumb_path?: string | null;
  width?: number | null;
  height?: number | null;
  sort_order: number;
  created_at: string;
}

export interface ResolvedGalleryItem extends GalleryRow {
  displayUrl: string | null;
  thumbUrl: string | null;
}

const isStoragePath = (value: string) => !/^https?:\/\//i.test(value) && !value.startsWith('/');

/** Turns storage paths into signed URLs that anyone can open for a year. */
export const resolveGalleryItems = async (rows: GalleryRow[]): Promise<ResolvedGalleryItem[]> => {
  const paths = new Set<string>();
  for (const row of rows) {
    const main = row.src ?? row.video_url ?? '';
    if (main && isStoragePath(main)) paths.add(main);
    if (row.thumb_path && isStoragePath(row.thumb_path)) paths.add(row.thumb_path);
  }

  let signed = new Map<string, string>();

  if (paths.size > 0) {
    const { data } = await supabase.storage
      .from('gallery')
      .createSignedUrls(Array.from(paths), 60 * 60 * 24 * 365);
    signed = new Map(
      (data ?? [])
        .filter((entry) => entry.signedUrl && entry.path)
        .map((entry) => [entry.path as string, entry.signedUrl])
    );
  }

  const resolve = (value: string | null | undefined) => {
    if (!value) return null;
    return isStoragePath(value) ? signed.get(value) ?? null : value;
  };

  return rows.map((row) => {
    const displayUrl = resolve(row.src ?? row.video_url ?? null);
    return {
      ...row,
      displayUrl,
      thumbUrl: resolve(row.thumb_path) ?? resolve(row.thumbnail) ?? displayUrl,
    };
  });
};
