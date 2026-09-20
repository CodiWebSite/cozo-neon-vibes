import { supabase } from '@/integrations/supabase/client';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;

export interface UploadOptions {
  bucket: string;
  path: string;
  body: Blob;
  contentType?: string;
  cacheControl?: string;
  onProgress?: (percent: number) => void;
  signal?: AbortSignal;
}

/** Încarcă un fișier în storage raportând progresul real (XHR). */
export const uploadWithProgress = ({
  bucket,
  path,
  body,
  contentType,
  cacheControl = '31536000',
  onProgress,
  signal,
}: UploadOptions): Promise<void> =>
  new Promise((resolve, reject) => {
    supabase.auth
      .getSession()
      .then(({ data }) => {
        const token = data.session?.access_token ?? PUBLISHABLE_KEY;
        const xhr = new XMLHttpRequest();
        xhr.open('POST', `${SUPABASE_URL}/storage/v1/object/${bucket}/${encodeURI(path)}`);
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        xhr.setRequestHeader('apikey', PUBLISHABLE_KEY);
        xhr.setRequestHeader('x-upsert', 'false');
        xhr.setRequestHeader('cache-control', `max-age=${cacheControl}`);
        if (contentType) xhr.setRequestHeader('content-type', contentType);

        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable && onProgress) {
            onProgress(Math.round((event.loaded / event.total) * 100));
          }
        };

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            onProgress?.(100);
            resolve();
            return;
          }
          let message = `Eroare ${xhr.status}`;
          try {
            const parsed = JSON.parse(xhr.responseText) as { message?: string; error?: string };
            message = parsed.message || parsed.error || message;
          } catch {
            /* răspuns care nu e JSON */
          }
          reject(new Error(message));
        };

        xhr.onerror = () => reject(new Error('Conexiune întreruptă'));
        xhr.onabort = () => reject(new Error('Încărcare anulată'));

        if (signal) {
          signal.addEventListener('abort', () => xhr.abort(), { once: true });
        }

        xhr.send(body);
      })
      .catch(reject);
  });

/** Reîncearcă automat o operație de câteva ori, cu pauze crescătoare. */
export const withRetry = async <T>(
  run: (attempt: number) => Promise<T>,
  attempts = 3,
  baseDelayMs = 1200,
): Promise<T> => {
  let lastError: unknown;
  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      return await run(attempt);
    } catch (error) {
      lastError = error;
      const message = error instanceof Error ? error.message : '';
      // erorile permanente nu au rost reîncercate
      if (/prea mare|maximum allowed size|413|already exists|duplicate|mime type/i.test(message)) {
        throw error;
      }
      if (attempt < attempts) {
        await new Promise((r) => setTimeout(r, baseDelayMs * attempt));
      }
    }
  }
  throw lastError instanceof Error ? lastError : new Error('Încărcare eșuată');
};
