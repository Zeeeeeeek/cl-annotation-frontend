export function updateById<T extends { id: string }>(items: T[], id: string, changes: Partial<T>): T[] {
    return items.map((item) => (item.id === id ? { ...item, ...changes } : item))
}
