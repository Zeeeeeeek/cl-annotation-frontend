const urlCache = new Map<File, { url: string; refCount: number }>();

export function acquireObjectUrl(file: File): string {
    const cached = urlCache.get(file);
    if (cached) {
        cached.refCount += 1;
        return cached.url;
    }
    const url = URL.createObjectURL(file);
    urlCache.set(file, { url, refCount: 1 });
    return url;
}

export function releaseObjectUrl(file: File): void {
    const cached = urlCache.get(file);
    if (!cached) return;
    cached.refCount -= 1;
    if (cached.refCount <= 0) {
        URL.revokeObjectURL(cached.url);
        urlCache.delete(file);
    }
}