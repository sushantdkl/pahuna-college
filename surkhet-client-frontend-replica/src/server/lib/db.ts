const createDelegate = () => ({
  async create({ data }: { data?: Record<string, unknown> } = {}) {
    return { id: crypto.randomUUID(), createdAt: new Date(), ...(data ?? {}) };
  },
  async findMany() {
    return [];
  },
  async findUnique() {
    return null;
  },
  async findFirst() {
    return null;
  },
  async update({ data }: { data?: Record<string, unknown> } = {}) {
    return { id: crypto.randomUUID(), updatedAt: new Date(), ...(data ?? {}) };
  },
  async upsert({ create, update }: { create?: Record<string, unknown>; update?: Record<string, unknown> } = {}) {
    return { id: crypto.randomUUID(), updatedAt: new Date(), ...(create ?? {}), ...(update ?? {}) };
  },
});

export const db = new Proxy({}, { get: () => createDelegate() }) as any;
