// Generic in-memory database using a Map to store, retrieve, delete, and list items by their `id` property
export class InMemoryDB<T extends { id: string }> {
  private store: Map<string, T> = new Map();

  set(item: T): void {
    this.store.set(item.id, item);
  }

  get(id: string): T | undefined {
    return this.store.get(id);
  }

  del(id: string) : boolean {
    return this.store.delete(id);
  }

  getAll(): T[] {
    return Array.from(this.store.values());
  }
}
