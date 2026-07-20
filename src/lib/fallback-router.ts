import db from './fallback-db';
import {
  FALLBACK_PRODUCTS, FALLBACK_CATEGORIES, FALLBACK_INDUSTRIES,
  FALLBACK_USERS, FALLBACK_TESTIMONIALS,
} from './fallback-data';
import type {
  Product, Category, Industry, Testimonial, User,
  RFQ, Order, InventorySubmission, AuditLog, SystemSettings,
  AdminStats, BackupRecord, SiteConfig, CategoryItem,
  PaginatedResponse, AuthResponse,
} from '@/types';
import type { ChatConfig } from '@/types/chat';
import { generateRFQId } from '@/lib/utils';

let _seeded = false;

async function ensureSeeded(): Promise<void> {
  if (_seeded) return;
  const count = await db.products.count();
  if (count > 0) { _seeded = true; return; }

  await db.products.bulkAdd(FALLBACK_PRODUCTS.map((p, i) => ({ ...p, id: p.id || `fb-prod-${i}` })));
  await db.categories.bulkAdd(FALLBACK_CATEGORIES);
  await db.industries.bulkAdd(FALLBACK_INDUSTRIES);
  await db.users.bulkAdd(FALLBACK_USERS);
  await db.testimonials.bulkAdd(FALLBACK_TESTIMONIALS);

  const existingSettings = await db.systemSettings.get('default');
  if (!existingSettings) {
    await db.systemSettings.add(getDefaultSettings(), 'default');
  }

  const existingSiteConfig = await db.siteConfig.get('default');
  if (!existingSiteConfig) {
    await db.siteConfig.add(getDefaultSiteConfig(), 'default');
  }

  _seeded = true;
}

function delay(ms: number) {
  return new Promise<void>((r) => setTimeout(r, ms));
}

function generateId(prefix = 'fb'): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

function getSession(): AuthResponse | null {
  if (typeof window === 'undefined') return null;
  try { return JSON.parse(localStorage.getItem('ats_session') || 'null'); }
  catch { return null; }
}

function setSession(s: AuthResponse) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('ats_session', JSON.stringify(s));
  }
}

function ensureArray<T>(val: T | T[]): T[] {
  return Array.isArray(val) ? val : [val];
}

function ensureStringArray(val: unknown): string[] {
  if (Array.isArray(val)) return val.map(String);
  if (typeof val === 'string') {
    try {
      const parsed = JSON.parse(val);
      return Array.isArray(parsed) ? parsed.map(String) : [val];
    } catch {
      return val.split(',').map((s) => s.trim());
    }
  }
  return [];
}

function paginate<T>(items: T[], page: number, limit: number): { data: T[]; total: number } {
  const total = items.length;
  const data = items.slice((page - 1) * limit, page * limit);
  return { data, total };
}

function lsGet<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try { return JSON.parse(localStorage.getItem(key) || 'null') ?? fallback; }
  catch { return fallback; }
}

function lsSet(key: string, value: unknown) {
  if (typeof window !== 'undefined') {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* ignore */ }
  }
}

export async function seedFallbackData(): Promise<void> {
  _seeded = false;
  await db.products.clear();
  await db.categories.clear();
  await db.industries.clear();
  await db.users.clear();
  await db.testimonials.clear();
  await db.rfqs.clear();
  await db.orders.clear();
  await db.inventory.clear();
  await db.customParts.clear();
  await db.auditLogs.clear();
  await db.categoryItems.clear();
  await db.newsletters.clear();
  await db.contactSubmissions.clear();
  await db.savedParts.clear();
  await ensureSeeded();
}

export async function getFallbackStats(): Promise<{ products: number; categories: number; industries: number; users: number; testimonials: number; rfqs: number; orders: number }> {
  return {
    products: await db.products.count() + await db.customParts.count(),
    categories: await db.categories.count(),
    industries: await db.industries.count(),
    users: await db.users.count(),
    testimonials: await db.testimonials.count(),
    rfqs: await db.rfqs.count(),
    orders: await db.orders.count(),
  };
}

export async function importExcelData(rows: Record<string, unknown>[]): Promise<{ imported: number; errors: number }> {
  let imported = 0;
  let errors = 0;
  for (const row of rows) {
    try {
      const product: Product = {
        id: generateId('prod'),
        nsn: String(row.nsn || row.NSN || row.Nsn || ''),
        cage: String(row.cage || row.CAGE || row.Cage || ''),
        partNumber: String(row.partNumber || row['Part Number'] || row.PartNumber || row.part_number || ''),
        description: String(row.description || row.Description || row.desc || ''),
        shortDescription: String(row.shortDescription || row['Short Description'] || row.short_description || String(row.description || '').slice(0, 80)),
        fsg: String(row.fsg || row.FSG || ''),
        fsc: String(row.fsc || row.FSC || ''),
        category: String(row.category || row.Category || 'General'),
        manufacturer: String(row.manufacturer || row.Manufacturer || row.mfr || ''),
        condition: (['New', 'Used', 'Refurbished', 'Overhauled'].includes(String(row.condition || '')) ? String(row.condition) : 'New') as Product['condition'],
        stockStatus: (['In Stock', 'On Order', 'Obsolete', 'Limited'].includes(String(row.stockStatus || row['Stock Status'] || '')) ? String(row.stockStatus || row['Stock Status']) : 'In Stock') as Product['stockStatus'],
        quantityAvailable: Number(row.quantityAvailable || row['Qty Available'] || row.qty || 0),
        unitPrice: Number(row.unitPrice || row['Unit Price'] || row.price || 0),
        currency: String(row.currency || row.Currency || 'USD'),
        crossReferences: ensureStringArray(row.crossReferences),
        specifications: {},
        tags: ensureStringArray(row.tags),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      await db.products.add(product);
      imported++;
    } catch {
      errors++;
    }
  }
  return { imported, errors };
}

export async function fallbackRouter<T>(endpoint: string, options?: RequestInit): Promise<T> {
  await ensureSeeded();

  const DELAY_MS = parseInt(process.env.NEXT_PUBLIC_MOCK_DELAY || '400', 10);
  await delay(DELAY_MS);

  const method = options?.method?.toUpperCase() || 'GET';
  const [path, qs] = endpoint.split('?');
  const params = new URLSearchParams(qs || '');

  if (path === '/health' && method === 'GET') {
    return { success: true, status: 'ok', timestamp: new Date().toISOString(), source: 'fallback' } as T;
  }

  // ── AUTH ──────────────────────────────────────────────────
  if (path === '/auth/login' && method === 'POST') {
    const body = JSON.parse(options?.body as string || '{}');
    const users = await db.users.toArray();
    const user = users.find((u) => u.email === body.email && u.password === body.password);
    if (!user) throw new Error('Invalid email or password');
    if (user.isActive === false) throw new Error('Account is suspended. Contact support.');
    const { password: _, ...safeUser } = user;
    const resp: AuthResponse = { success: true, token: 'fb-jwt-' + user.id, user: safeUser as AuthResponse['user'] };
    setSession(resp);
    return resp as T;
  }

  if (path === '/auth/register' && method === 'POST') {
    const body = JSON.parse(options?.body as string || '{}');
    const existing = await db.users.where('email').equals(body.email).first();
    if (existing) throw new Error('An account with this email already exists');
    const newUser: User = {
      id: generateId('user'),
      email: body.email,
      password: body.password,
      fullName: body.fullName || '',
      company: body.company || '',
      phone: body.phone || '',
      role: 'User',
      country: body.country || 'United States',
      isActive: true,
      createdAt: new Date().toISOString(),
    };
    await db.users.add(newUser);
    const { password: _, ...safeUser } = newUser;
    const session: AuthResponse = { success: true, token: 'fb-jwt-' + newUser.id, user: safeUser as AuthResponse['user'] };
    setSession(session);
    return { success: true, message: 'Registration successful' } as T;
  }

  if (path === '/auth/logout' && method === 'POST') {
    if (typeof window !== 'undefined') localStorage.removeItem('ats_session');
    return { success: true } as T;
  }

  // ── PRODUCTS ──────────────────────────────────────────────
  if (path === '/products' && method === 'GET') {
    const q = params.get('search')?.toLowerCase();
    const cat = params.get('category');
    const fsg = params.get('fsg');
    const cage = params.get('cage');
    const cond = params.get('condition');
    const stock = params.get('stockStatus');
    const page = parseInt(params.get('page') || '1', 10);
    const limit = parseInt(params.get('limit') || '20', 10);

    const [fallbackProds, customProds] = await Promise.all([
      db.products.toArray(),
      db.customParts.toArray(),
    ]);
    let results = [...customProds, ...fallbackProds];

    if (q) results = results.filter((p) =>
      p.partNumber.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.nsn.includes(q) ||
      p.cage.toLowerCase().includes(q) ||
      p.manufacturer.toLowerCase().includes(q) ||
      p.tags.some((t) => t.toLowerCase().includes(q))
    );
    if (cat) results = results.filter((p) => p.category === cat);
    if (fsg) results = results.filter((p) => p.fsg === fsg);
    if (cage) results = results.filter((p) => p.cage.toLowerCase() === cage.toLowerCase());
    if (cond) results = results.filter((p) => p.condition === cond);
    if (stock) results = results.filter((p) => p.stockStatus === stock);

    const { data, total } = paginate(results, page, limit);
    const resp: PaginatedResponse<Product> = {
      success: true, data,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
    return resp as T;
  }

  if (path.startsWith('/products/') && method === 'GET') {
    const id = path.split('/products/')[1];
    const [fallbackProds, customProds] = await Promise.all([
      db.products.toArray(),
      db.customParts.toArray(),
    ]);
    const all = [...customProds, ...fallbackProds];
    const product = all.find((p) => p.id === id || p.partNumber === id);
    if (!product) throw new Error('Product not found');
    return { success: true, data: product } as T;
  }

  // ── CATEGORIES ────────────────────────────────────────────
  if (path === '/categories' && method === 'GET') {
    const cats = await db.categories.toArray();
    return { success: true, data: cats } as T;
  }

  if (path === '/nav-categories' && method === 'GET') {
    const cats = await db.categories.toArray();
    const storedItems = await db.categoryItems.toArray();
    const result = {
      fsgCategories: cats.map((c) => ({
        id: c.id, name: c.name, fsg: c.fsg, fsc: c.fsc,
        description: c.description, icon: c.icon, partCount: c.partCount,
      })),
      productCategories: cats.map((c) => ({
        id: c.id, name: c.name, slug: c.name.toLowerCase().replace(/\s+/g, '-'),
        type: 'product', items: storedItems.filter((i) => i.categoryId === c.id),
      })),
      partCategories: [],
    };
    return { success: true, data: result } as T;
  }

  // ── INDUSTRIES ────────────────────────────────────────────
  if (path === '/industries' && method === 'GET') {
    const inds = await db.industries.toArray();
    return { success: true, data: inds } as T;
  }

  if (path.startsWith('/industries/') && method === 'GET') {
    const slug = path.split('/industries/')[1];
    const industry = await db.industries.where('slug').equals(slug).first();
    if (!industry) throw new Error('Industry not found');
    return { success: true, data: industry } as T;
  }

  // ── TESTIMONIALS ──────────────────────────────────────────
  if (path === '/testimonials' && method === 'GET') {
    const testimonials = await db.testimonials.toArray();
    return { success: true, data: testimonials } as T;
  }

  // ── RFQ ───────────────────────────────────────────────────
  if (path === '/rfq/submit' && method === 'POST') {
    const body = JSON.parse(options?.body as string || '{}');
    const rfq: RFQ = {
      id: generateRFQId(),
      ...body,
      status: 'Pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await db.rfqs.add(rfq);
    return { success: true, rfqId: rfq.id, message: 'RFQ submitted. Our team will respond within 24 hours.' } as T;
  }

  // ── DASHBOARD ─────────────────────────────────────────────
  if (path === '/dashboard/rfqs' && method === 'GET') {
    const rfqs = await db.rfqs.toArray();
    return { success: true, data: rfqs } as T;
  }

  if (path.match(/^\/dashboard\/rfqs\/(.+)\/(accept|reject)$/) && method === 'POST') {
    const match = path.match(/^\/dashboard\/rfqs\/(.+)\/(accept|reject)$/);
    const rfqId = match![1];
    const action = match![2];
    const status = action === 'accept' ? 'Accepted' : 'Cancelled';
    const rfq = await db.rfqs.get(rfqId);
    if (rfq) {
      await db.rfqs.put({ ...rfq, status: status as RFQ['status'], updatedAt: new Date().toISOString() });
    }
    return { success: true, message: action === 'accept' ? 'Quote accepted' : 'Quote rejected' } as T;
  }

  if (path === '/dashboard/orders' && method === 'GET') {
    const orders = await db.orders.toArray();
    return { success: true, data: orders } as T;
  }

  if (path === '/dashboard/saved' && method === 'GET') {
    const session = getSession();
    const saved = await db.savedParts.where('userId').equals(session?.user?.id || 'none').toArray();
    const prodIds = saved.map((s) => s.productId);
    const allProds = await db.products.toArray();
    const products = allProds.filter((p) => prodIds.includes(p.id));
    return { success: true, data: products } as T;
  }

  if (path === '/dashboard/saved' && method === 'POST') {
    const { productId } = JSON.parse(options?.body as string || '{}');
    const session = getSession();
    if (session?.user?.id) {
      const existing = await db.savedParts.where({ productId, userId: session.user.id }).first();
      if (!existing) {
        await db.savedParts.add({ id: generateId('sv'), productId, userId: session.user.id, savedAt: new Date().toISOString() });
      }
    }
    return { success: true } as T;
  }

  if (path.startsWith('/dashboard/saved/') && method === 'DELETE') {
    const productId = path.split('/dashboard/saved/')[1];
    const session = getSession();
    if (session?.user?.id) {
      const saved = await db.savedParts.where({ productId, userId: session.user.id }).first();
      if (saved) await db.savedParts.delete(saved.id);
    }
    return { success: true } as T;
  }

  if (path === '/dashboard/profile' && method === 'GET') {
    const session = getSession();
    if (!session) throw new Error('Not authenticated');
    return { success: true, data: session.user } as T;
  }

  if (path === '/dashboard/profile' && method === 'PUT') {
    const body = JSON.parse(options?.body as string || '{}');
    const session = getSession();
    if (!session) throw new Error('Not authenticated');
    const updated = { ...session.user, ...body };
    setSession({ ...session, user: updated });
    return { success: true, data: updated } as T;
  }

  // ── INVENTORY ─────────────────────────────────────────────
  if (path === '/inventory/submit' && method === 'POST') {
    const sub: InventorySubmission = {
      id: 'INV-' + Date.now(),
      ...JSON.parse(options?.body as string || '{}'),
      status: 'Pending',
      submittedAt: new Date().toISOString(),
    };
    await db.inventory.add(sub);
    return { success: true, submissionId: sub.id, status: 'Processing' } as T;
  }

  // ── NEWSLETTER ────────────────────────────────────────────
  if (path === '/newsletter/subscribe' && method === 'POST') {
    const { email } = JSON.parse(options?.body as string || '{}');
    const existing = await db.newsletters.where('email').equals(email).first();
    if (existing) {
      if (existing.isActive === false) {
        await db.newsletters.put({ ...existing, isActive: true });
        return { success: true, message: 'Subscription reactivated' } as T;
      }
      return { success: true, message: 'Already subscribed' } as T;
    }
    await db.newsletters.add({ id: generateId('nl'), email, isActive: true, createdAt: new Date().toISOString() });
    return { success: true, message: 'Subscribed successfully' } as T;
  }

  if (path === '/admin/newsletter/stats' && method === 'GET') {
    const subs = await db.newsletters.toArray();
    const total = subs.length;
    const active = subs.filter((s) => s.isActive !== false).length;
    return { success: true, data: { total, active, inactive: total - active } } as T;
  }

  if (path === '/admin/newsletter' && method === 'GET') {
    let subs = await db.newsletters.toArray();
    const search = params.get('search');
    const isActive = params.get('isActive');
    if (isActive) subs = subs.filter((s) => s.isActive === (isActive === 'true'));
    if (search) subs = subs.filter((s) => s.email.toLowerCase().includes(search.toLowerCase()));
    return { success: true, data: subs, pagination: { total: subs.length, page: 1, limit: 200, totalPages: 1 } } as T;
  }

  if (path.startsWith('/admin/newsletter/') && method === 'DELETE') {
    const id = path.split('/admin/newsletter/')[1];
    await db.newsletters.delete(id);
    return { success: true, message: 'Subscriber deleted' } as T;
  }

  // ── CONTACT ───────────────────────────────────────────────
  if (path === '/contact/submit' && method === 'POST') {
    const body = JSON.parse(options?.body as string || '{}');
    const submission = {
      id: generateId('contact'),
      ...body,
      status: 'Unread',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await db.contactSubmissions.add(submission);
    return { success: true, data: submission, message: 'Message sent successfully' } as T;
  }

  if (path === '/admin/contacts' && method === 'GET') {
    const page = parseInt(params.get('page') || '1', 10);
    const limit = parseInt(params.get('limit') || '20', 10);
    const status = params.get('status');
    const search = params.get('search');
    let submissions = await db.contactSubmissions.toArray();
    if (status) submissions = submissions.filter((s) => s.status === status);
    if (search) {
      const q = search.toLowerCase();
      submissions = submissions.filter((s) =>
        String(s.name).toLowerCase().includes(q) ||
        String(s.email).toLowerCase().includes(q) ||
        String(s.subject).toLowerCase().includes(q)
      );
    }
    const { data, total } = paginate(submissions, page, limit);
    return { success: true, data, pagination: { total, page, limit, totalPages: Math.ceil(total / limit) } } as T;
  }

  if (path.startsWith('/admin/contacts/') && !path.endsWith('/status') && method === 'GET') {
    const id = path.split('/admin/contacts/')[1];
    const submission = await db.contactSubmissions.get(id);
    if (!submission) throw new Error('Submission not found');
    return { success: true, data: submission } as T;
  }

  if (path.startsWith('/admin/contacts/') && path.endsWith('/status') && method === 'PUT') {
    const id = path.split('/admin/contacts/')[1].replace('/status', '');
    const body = JSON.parse(options?.body as string || '{}');
    const sub = await db.contactSubmissions.get(id);
    if (sub) {
      await db.contactSubmissions.put({ ...sub, ...body, updatedAt: new Date().toISOString() });
    }
    return { success: true, message: 'Status updated' } as T;
  }

  // ── ADMIN STATS ──────────────────────────────────────────
  if (path === '/admin/stats' && method === 'GET') {
    const allRFQs = await db.rfqs.toArray();
    const allUsers = await db.users.toArray();
    const allProds = await db.products.toArray();
    const customProds = await db.customParts.toArray();
    const allOrders = await db.orders.toArray();
    const stats: AdminStats = {
      totalUsers: allUsers.length,
      activeUsers: allUsers.filter((u) => u.isActive !== false).length,
      totalRFQs: allRFQs.length,
      pendingRFQs: allRFQs.filter((r) => r.status === 'Pending' || r.status === 'Under Review').length,
      totalParts: allProds.length + customProds.length,
      totalOrders: allOrders.length,
      revenueThisMonth: 284750,
      newUsersThisMonth: 12,
    };
    return { success: true, data: stats } as T;
  }

  // ── ADMIN USERS ──────────────────────────────────────────
  if (path === '/admin/users' && method === 'GET') {
    const page = parseInt(params.get('page') || '1', 10);
    const limit = parseInt(params.get('limit') || '20', 10);
    const search = params.get('search')?.toLowerCase();
    const overrides = lsGet<Record<string, Partial<User>>>('ats_user_overrides', {});
    let users = (await db.users.toArray()).map(({ password: _, ...u }) => ({
      ...overrides[u.id] ? { ...u, ...overrides[u.id] } : u,
    }));
    if (search) users = users.filter((u) =>
      u.fullName.toLowerCase().includes(search) ||
      u.email.toLowerCase().includes(search) ||
      u.company.toLowerCase().includes(search)
    );
    const { data, total } = paginate(users, page, limit);
    return { success: true, data, pagination: { total, page, limit, totalPages: Math.ceil(total / limit) } } as T;
  }

  if (path.startsWith('/admin/users/') && !path.includes('/reset-password') && !path.includes('/change-email') && !path.includes('/suspend') && method === 'PUT') {
    const userId = path.split('/admin/users/')[1];
    const body = JSON.parse(options?.body as string || '{}');
    const overrides = lsGet<Record<string, Partial<User>>>('ats_user_overrides', {});
    overrides[userId] = { ...(overrides[userId] || {}), ...body };
    lsSet('ats_user_overrides', overrides);
    const session = getSession();
    if (session?.user?.id === userId) {
      setSession({ ...session, user: { ...session.user, ...body } });
    }
    return { success: true, message: 'User updated successfully' } as T;
  }

  if (path.startsWith('/admin/users/') && path.endsWith('/suspend') && method === 'POST') {
    const userId = path.split('/admin/users/')[1].replace('/suspend', '');
    const overrides = lsGet<Record<string, Partial<User>>>('ats_user_overrides', {});
    const current = overrides[userId]?.isActive !== false;
    overrides[userId] = { ...(overrides[userId] || {}), isActive: current ? false : true };
    lsSet('ats_user_overrides', overrides);
    return { success: true, message: current ? 'User suspended' : 'User reactivated' } as T;
  }

  // ── ADMIN RFQs ───────────────────────────────────────────
  if (path === '/admin/rfqs' && method === 'GET') {
    const page = parseInt(params.get('page') || '1', 10);
    const limit = parseInt(params.get('limit') || '20', 10);
    const status = params.get('status');
    let rfqs = await db.rfqs.toArray();
    if (status) rfqs = rfqs.filter((r) => r.status === status);
    const { data, total } = paginate(rfqs, page, limit);
    return { success: true, data, pagination: { total, page, limit, totalPages: Math.ceil(total / limit) } } as T;
  }

  if (path.startsWith('/admin/rfqs/') && method === 'PUT') {
    const rfqId = path.split('/admin/rfqs/')[1];
    const body = JSON.parse(options?.body as string || '{}');
    const rfq = await db.rfqs.get(rfqId);
    if (rfq) {
      await db.rfqs.put({ ...rfq, ...body, updatedAt: new Date().toISOString() });
    }
    return { success: true, message: 'RFQ updated' } as T;
  }

  // ── ADMIN PARTS ──────────────────────────────────────────
  if (path === '/admin/parts' && method === 'GET') {
    const page = parseInt(params.get('page') || '1', 10);
    const limit = parseInt(params.get('limit') || '20', 10);
    const q = params.get('search')?.toLowerCase();
    const [fallbackProds, customProds] = await Promise.all([
      db.products.toArray(),
      db.customParts.toArray(),
    ]);
    let parts = [...customProds, ...fallbackProds];
    if (q) parts = parts.filter((p) =>
      p.partNumber.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.nsn.includes(q) ||
      p.manufacturer.toLowerCase().includes(q)
    );
    const { data, total } = paginate(parts, page, limit);
    return { success: true, data, pagination: { total, page, limit, totalPages: Math.ceil(total / limit) } } as T;
  }

  if (path === '/admin/parts' && method === 'POST') {
    const session = getSession();
    const body = JSON.parse(options?.body as string || '{}');
    const newPart: Product = {
      id: generateId('part'),
      nsn: body.nsn || '',
      cage: body.cage || '',
      partNumber: body.partNumber || '',
      description: body.description || '',
      shortDescription: body.shortDescription || body.description || '',
      fsg: body.fsg || '',
      fsc: body.fsc || '',
      category: body.category || 'General',
      manufacturer: body.manufacturer || '',
      condition: body.condition || 'New',
      stockStatus: body.stockStatus || 'In Stock',
      quantityAvailable: Number(body.quantityAvailable) || 0,
      unitPrice: Number(body.unitPrice) || 0,
      currency: 'USD',
      crossReferences: body.crossReferences || [],
      specifications: {},
      tags: body.tags || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await db.customParts.add(newPart);
    return { success: true, data: newPart, message: 'Part created' } as T;
  }

  if (path.startsWith('/admin/parts/') && method === 'PUT') {
    const partId = path.split('/admin/parts/')[1];
    const body = JSON.parse(options?.body as string || '{}');
    const existing = await db.customParts.get(partId);
    if (existing) {
      await db.customParts.put({ ...existing, ...body, updatedAt: new Date().toISOString() });
    }
    return { success: true, message: 'Part updated' } as T;
  }

  if (path.startsWith('/admin/parts/') && method === 'DELETE') {
    const partId = path.split('/admin/parts/')[1];
    const existing = await db.customParts.get(partId);
    if (existing) await db.customParts.delete(partId);
    return { success: true, message: 'Part deleted' } as T;
  }

  // ── ADMIN INVENTORY ──────────────────────────────────────
  if (path === '/admin/inventory' && method === 'GET') {
    const subs = await db.inventory.toArray();
    return { success: true, data: subs } as T;
  }

  // ── ADMIN EXPORT ─────────────────────────────────────────
  if (path === '/admin/export/users' && method === 'GET') {
    const users = (await db.users.toArray()).map(({ password: _, ...u }) => u);
    return { success: true, data: users, format: params.get('format') || 'json' } as T;
  }

  if (path === '/admin/export/rfqs' && method === 'GET') {
    const rfqs = await db.rfqs.toArray();
    return { success: true, data: rfqs, format: params.get('format') || 'json' } as T;
  }

  if (path === '/admin/export/parts' && method === 'GET') {
    const parts = await db.products.toArray();
    return { success: true, data: parts, format: params.get('format') || 'json' } as T;
  }

  // ── SUPERADMIN ───────────────────────────────────────────
  if (path === '/superadmin/stats' && method === 'GET') {
    const allRFQs = await db.rfqs.toArray();
    const allUsers = await db.users.toArray();
    const allProds = await db.products.toArray();
    const customProds = await db.customParts.toArray();
    const allOrders = await db.orders.toArray();
    const stats: AdminStats = {
      totalUsers: allUsers.length,
      activeUsers: allUsers.filter((u) => u.isActive !== false).length,
      totalRFQs: allRFQs.length,
      pendingRFQs: allRFQs.filter((r) => r.status === 'Pending').length,
      totalParts: allProds.length + customProds.length,
      totalOrders: allOrders.length,
      revenueThisMonth: 284750,
      newUsersThisMonth: 12,
    };
    return { success: true, data: stats } as T;
  }

  if (path === '/superadmin/audit-logs' && method === 'GET') {
    const page = parseInt(params.get('page') || '1', 10);
    const limit = parseInt(params.get('limit') || '50', 10);
    const action = params.get('action');
    let logs = await db.auditLogs.toArray();
    if (logs.length === 0) logs = getMockAuditLogs();
    if (action) logs = logs.filter((l) => l.action === action);
    const { data, total } = paginate(logs, page, limit);
    return { success: true, data, pagination: { total, page, limit, totalPages: Math.ceil(total / limit) } } as T;
  }

  if (path === '/superadmin/settings' && method === 'GET') {
    const settings = await db.systemSettings.get('default');
    return { success: true, data: settings || getDefaultSettings() } as T;
  }

  if (path === '/superadmin/settings' && method === 'PUT') {
    const body = JSON.parse(options?.body as string || '{}');
    const session = getSession();
    const existing = await db.systemSettings.get('default') || getDefaultSettings();
    const updated: SystemSettings = {
      ...existing,
      ...body,
      updatedAt: new Date().toISOString(),
      updatedBy: session?.user?.email || 'superadmin',
    };
    await db.systemSettings.put(updated, 'default');
    return { success: true, data: updated, message: 'Settings saved' } as T;
  }

  if (path === '/superadmin/backup/trigger' && method === 'POST') {
    const session = getSession();
    const backup: BackupRecord = {
      id: generateId('backup'),
      triggeredBy: session?.user?.email || 'superadmin',
      type: 'manual',
      status: 'Complete',
      sizeBytes: 4_200_000 + Math.floor(Math.random() * 500_000),
      downloadUrl: '#',
      createdAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
    };
    await db.backups.add(backup);
    return { success: true, data: backup, message: 'Backup completed successfully' } as T;
  }

  if (path === '/superadmin/backup/list' && method === 'GET') {
    const backups = await db.backups.toArray();
    if (backups.length === 0) {
      for (const b of getMockBackups()) await db.backups.add(b);
      return { success: true, data: getMockBackups() } as T;
    }
    return { success: true, data: backups } as T;
  }

  if (path === '/superadmin/users/create' && method === 'POST') {
    const body = JSON.parse(options?.body as string || '{}');
    const existing = await db.users.where('email').equals(body.email).first();
    if (existing) throw new Error('Email already in use');
    const newUser: User = {
      id: generateId('user-custom'),
      email: body.email,
      password: body.password || 'password123',
      fullName: body.fullName || '',
      company: body.company || '',
      cageCode: body.cageCode,
      phone: body.phone || '',
      role: body.role || 'User',
      country: body.country || 'United States',
      address: body.address,
      isActive: true,
      createdAt: new Date().toISOString(),
    };
    await db.users.add(newUser);
    return { success: true, data: newUser, message: 'User created successfully' } as T;
  }

  if (path === '/superadmin/users/make-admin' && method === 'POST') {
    const { userId, role } = JSON.parse(options?.body as string || '{}');
    const overrides = lsGet<Record<string, Partial<User>>>('ats_user_overrides', {});
    overrides[userId] = { ...(overrides[userId] || {}), role };
    lsSet('ats_user_overrides', overrides);
    return { success: true, message: `User role updated to ${role}` } as T;
  }

  if (path === '/superadmin/export/master' && method === 'GET') {
    const [users, parts, rfqs, orders, inventory, logs] = await Promise.all([
      db.users.toArray(),
      db.products.toArray(),
      db.rfqs.toArray(),
      db.orders.toArray(),
      db.inventory.toArray(),
      db.auditLogs.toArray(),
    ]);
    const allData = {
      exportedAt: new Date().toISOString(),
      users: users.map(({ password: _, ...u }) => u),
      parts, rfqs, orders, inventory,
      auditLogs: logs.length ? logs : getMockAuditLogs(),
    };
    return { success: true, data: allData } as T;
  }

  // ── SITE CONFIG ──────────────────────────────────────────
  if (path === '/site-config' && method === 'GET') {
    const stored = await db.siteConfig.get('default');
    const defaults = getDefaultSiteConfig();
    const config: SiteConfig = {
      ...defaults,
      ...stored,
      chat: { ...defaults.chat, ...(stored?.chat || {}) },
      updatedAt: stored?.updatedAt || defaults.updatedAt,
      updatedBy: stored?.updatedBy || defaults.updatedBy,
    };
    return { success: true, data: config } as T;
  }

  if (path === '/site-config' && method === 'PUT') {
    const session = getSession();
    const body = JSON.parse(options?.body as string || '{}');
    const existing = await db.siteConfig.get('default') || getDefaultSiteConfig();
    const updated: SiteConfig = {
      ...existing,
      ...body,
      updatedAt: new Date().toISOString(),
      updatedBy: session?.user?.email || 'admin',
    };
    await db.siteConfig.put(updated, 'default');
    return { success: true, data: updated, message: 'Site configuration saved' } as T;
  }

  // ── DEV FEATURES ─────────────────────────────────────────
  if (path === '/dev/features' && method === 'GET') {
    const features = lsGet<Record<string, { featureKey: string; isEnabled: boolean }[]>>('ats_dev_features', getDefaultFeatures());
    return { success: true, data: features } as T;
  }

  if (path.match(/^\/dev\/features\/(.+)/) && method === 'PUT') {
    const role = path.split('/dev/features/')[1];
    const { featureKey, isEnabled } = JSON.parse(options?.body as string || '{}');
    const features = lsGet<Record<string, { featureKey: string; isEnabled: boolean }[]>>('ats_dev_features', getDefaultFeatures());
    const roleFeatures = features[role] || [];
    const existing = roleFeatures.findIndex((f) => f.featureKey === featureKey);
    if (existing >= 0) roleFeatures[existing].isEnabled = isEnabled;
    else roleFeatures.push({ featureKey, isEnabled });
    features[role] = roleFeatures;
    lsSet('ats_dev_features', features);
    return { success: true, message: `${isEnabled ? 'Enabled' : 'Disabled'} ${featureKey} for ${role}` } as T;
  }

  // ── CATEGORY ITEMS ───────────────────────────────────────
  if (path === '/category-items' && method === 'GET') {
    const catId = params.get('categoryId');
    const allItems = await db.categoryItems.toArray();
    const data = catId ? allItems.filter((i) => i.categoryId === catId) : allItems;
    return { success: true, data } as T;
  }

  if (path === '/admin/category-items' && method === 'POST') {
    const body = JSON.parse(options?.body as string || '{}');
    const allItems = await db.categoryItems.toArray();
    const maxSort = allItems.length > 0 ? Math.max(...allItems.map((i) => i.sortOrder || 0)) : 0;
    const newItem: CategoryItem = {
      id: generateId('ci'),
      categoryId: body.categoryId || '',
      title: body.title || '',
      slug: body.slug || '',
      description: body.description || '',
      image: body.image || '',
      link: body.link || '',
      data: body.data || undefined,
      cardConfig: body.cardConfig || undefined,
      sortOrder: body.sortOrder ?? maxSort + 1,
      isActive: body.isActive !== false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await db.categoryItems.add(newItem);
    return { success: true, data: newItem, message: 'Item created' } as T;
  }

  if (path.startsWith('/admin/category-items/') && method === 'PUT') {
    const itemId = path.split('/admin/category-items/')[1];
    const body = JSON.parse(options?.body as string || '{}');
    const item = await db.categoryItems.get(itemId);
    if (item) {
      await db.categoryItems.put({ ...item, ...body, updatedAt: new Date().toISOString() });
    }
    return { success: true, message: 'Item updated' } as T;
  }

  if (path.startsWith('/admin/category-items/') && method === 'DELETE') {
    const itemId = path.split('/admin/category-items/')[1];
    await db.categoryItems.delete(itemId);
    return { success: true, message: 'Item deleted' } as T;
  }

  if (path === '/admin/category-items/bulk-import' && method === 'POST') {
    const body = JSON.parse(options?.body as string || '{}');
    const { categoryId, append } = body;
    const incoming = (body.items || body.data || []) as Record<string, unknown>[];
    const existing = append ? await db.categoryItems.toArray() : [];
    const maxSort = existing.length > 0 ? Math.max(...existing.map((i) => i.sortOrder || 0)) : 0;
    if (!append && existing.length > 0) {
      await db.categoryItems.clear();
    }
    const newItems: CategoryItem[] = incoming.map((item, idx) => {
      const vals = Object.values(item).filter((v) => v != null && v !== '');
      const rawTitle = vals.length ? String(vals[0]) : 'Unnamed Item';
      let rawSlug = (item.slug || item.Slug || '' as string).toString().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      if (!rawSlug) rawSlug = (rawTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'item') + '-' + idx;
      const data: Record<string, unknown> = {};
      for (const [key, val] of Object.entries(item)) {
        if (!['slug', 'Slug', 'navCategoryId'].includes(key)) data[key] = val;
      }
      return {
        id: generateId('ci'),
        categoryId: categoryId || (item.categoryId as string) || '',
        title: rawTitle,
        slug: rawSlug,
        description: (item.description || item.Description || '') as string,
        image: (item.image || item.Image || '') as string,
        link: (item.link || item.Link || '') as string,
        data: Object.keys(data).length ? data : undefined,
        sortOrder: (item.sortOrder as number) ?? maxSort + idx + 1,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    });
    await db.categoryItems.bulkAdd(newItems);
    return { success: true, data: newItems.map((n) => ({ slug: n.slug, action: 'created' })), message: `${newItems.length} items imported` } as T;
  }

  // ── CHAT ─────────────────────────────────────────────────
  if (path === '/admin/chat/conversations' && method === 'GET') {
    let convs = lsGet<Record<string, unknown>[]>('ats_chat_conversations', []);
    const status = params.get('status');
    const search = params.get('search');
    if (status && status !== 'all') {
      if (status === 'unread') convs = convs.filter((c) => c.isUnread);
      else convs = convs.filter((c) => c.status === status);
    }
    if (search) {
      const q = search.toLowerCase();
      convs = convs.filter((c) =>
        String(c.visitorName).toLowerCase().includes(q) ||
        String(c.lastMessage).toLowerCase().includes(q) ||
        String(c.visitorEmail).toLowerCase().includes(q)
      );
    }
    const pageNum = parseInt(params.get('page') || '1', 10);
    const limitNum = parseInt(params.get('limit') || '20', 10);
    const unreadCount = convs.filter((c) => c.isUnread).length;
    const { data, total } = paginate(convs, pageNum, limitNum);
    return { success: true, data, unreadCount, pagination: { total, page: pageNum, limit: limitNum, totalPages: Math.ceil(total / limitNum) } } as T;
  }

  if (path.startsWith('/admin/chat/conversations/unread') && method === 'GET') {
    const convs = lsGet<Record<string, unknown>[]>('ats_chat_conversations', []);
    const unreadCount = convs.filter((c) => c.isUnread).length;
    return { success: true, data: { unreadCount } } as T;
  }

  // ── KNOWLEDGE BASE ───────────────────────────────────────
  if (path === '/admin/knowledge-base' && method === 'GET') {
    let items = lsGet<Record<string, unknown>[]>('ats_knowledge_base', []);
    const category = params.get('category');
    const search = params.get('search');
    if (category) items = items.filter((i) => i.category === category);
    if (search) {
      const q = search.toLowerCase();
      items = items.filter((i) =>
        String(i.question).toLowerCase().includes(q) ||
        String(i.answer).toLowerCase().includes(q)
      );
    }
    return { success: true, data: items, pagination: { total: items.length, page: 1, limit: 200, totalPages: 1 } } as T;
  }

  if (path === '/admin/knowledge-base' && method === 'POST') {
    const body = JSON.parse(options?.body as string || '{}');
    const entry = { id: generateId('kb'), ...body, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    const existing = lsGet<Record<string, unknown>[]>('ats_knowledge_base', []);
    lsSet('ats_knowledge_base', [entry, ...existing]);
    return { success: true, data: entry } as T;
  }

  // ── DEV CONFIG ───────────────────────────────────────────
  if (path === '/dev/config' && method === 'GET') {
    const config = lsGet<Record<string, string>>('ats_dev_config', {
      NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || '',
      NEXT_PUBLIC_USE_MOCK: process.env.NEXT_PUBLIC_USE_MOCK || 'false',
      DATABASE_URL: 'postgresql://localhost:5432/aeroturbine',
      REDIS_URL: 'redis://localhost:6379',
      STORAGE_BACKEND: 'local',
    });
    return { success: true, data: config } as T;
  }

  if (path === '/dev/config' && method === 'PUT') {
    const body = JSON.parse(options?.body as string || '{}');
    const config = lsGet<Record<string, string>>('ats_dev_config', {});
    lsSet('ats_dev_config', { ...config, ...body });
    return { success: true, message: 'Config saved' } as T;
  }

  return { success: true, data: [] } as T;
}

// ─── Default settings / helpers ────────────────────────────

function getDefaultSettings(): SystemSettings {
  return {
    siteName: 'AeroTurbineSpare',
    siteUrl: 'https://aeroturbinespare.com',
    maintenanceMode: false,
    allowRegistration: true,
    rfqEmailRecipient: 'sales@aeroturbinespare.com',
    smtpHost: 'smtp.sendgrid.net',
    smtpPort: 587,
    smtpUser: 'apikey',
    maxRFQsPerDay: 50,
    sessionTimeoutMinutes: 60,
    enableAuditLogging: true,
    backupSchedule: 'daily',
    dataRetentionDays: 365,
    cloudinaryCloudName: '',
    cloudinaryApiKey: '',
    cloudinaryApiSecret: '',
    updatedAt: '2026-06-01T00:00:00Z',
    updatedBy: 'superadmin@aeroturbinespare.com',
  };
}

function getDefaultSiteConfig(): SiteConfig {
  const DEFAULT_CHAT_CONFIG: ChatConfig = {
    chatbotEnabled: true,
    botName: 'AeroBot',
    greetingMessage: 'Hello! Welcome to AeroTurbineSpare. How can I help you today?',
    whatsappEnabled: true,
    whatsappMode: 'normal',
    whatsappNumber: '+31611879800',
    whatsappBusinessPhoneId: '',
    whatsappBusinessAccountId: '',
    whatsappBusinessToken: '',
    whatsappVerifyToken: '',
    aiConfig: {
      enabled: false,
      provider: 'openai',
      apiKey: '',
      model: 'gpt-4o-mini',
      customBaseUrl: '',
      customModel: '',
    },
    inboxNotifyEmail: '',
    humanHandoffEnabled: true,
  };
  return {
    logoHeight: 40, logoWidth: 0, logoPaddingX: 16, logoPaddingY: 8,
    logoMarginX: 0, logoMarginY: 0,
    logoText: 'AeroTurbineSpare', logoSubText: 'Aerospace Parts Exchange',
    heroHeading: 'Source Aerospace Parts with Confidence',
    heroSubheading: 'Global inventory of aviation, turbine, and defense components — NSN, CAGE, and part-number searchable in seconds.',
    heroBadgeText: 'Trusted by 500+ Aviation Companies',
    heroBgType: 'gradient', heroBgValue: '#0A1628',
    heroCta1Label: 'Search Inventory', heroCta1Href: '/catalog',
    heroCta2Label: 'Request a Quote', heroCta2Href: '/rfq',
    chat: DEFAULT_CHAT_CONFIG,
    updatedAt: new Date().toISOString(),
    updatedBy: 'system',
  };
}

function getDefaultFeatures(): Record<string, { featureKey: string; isEnabled: boolean }[]> {
  const ALL_FEATURES = [
    'users.manage', 'users.roles', 'users.suspend', 'users.create',
    'blog.write', 'blog.publish', 'blog.delete', 'blog.media',
    'seo.manage', 'seo.schemas', 'seo.sitemap', 'seo.frontend-edit',
    'products.manage', 'products.import', 'inventory.manage',
    'orders.manage', 'rfqs.manage', 'chat.manage',
    'settings.system', 'settings.branding', 'settings.email',
    'traders.manage', 'content.manage', 'db.access', 'backup.manage', 'audit.view',
  ];
  const ALL_ROLES = ['Dev', 'SuperAdmin', 'Admin', 'SEOManager', 'ContentManager', 'Trader', 'User'];
  const result: Record<string, { featureKey: string; isEnabled: boolean }[]> = {};
  for (const role of ALL_ROLES) {
    result[role] = ALL_FEATURES.map((f) => ({
      featureKey: f,
      isEnabled: role === 'Dev' || role === 'SuperAdmin' || (role === 'Admin' && !f.startsWith('settings.')),
    }));
  }
  return result;
}

function getMockAuditLogs(): AuditLog[] {
  const actions = [
    { action: 'LOGIN', resource: 'auth', status: 'Success' as const },
    { action: 'SUBMIT_RFQ', resource: 'rfq', status: 'Success' as const },
    { action: 'UPDATE_PROFILE', resource: 'user', status: 'Success' as const },
    { action: 'SUSPEND_USER', resource: 'user', status: 'Warning' as const },
    { action: 'MASTER_EXPORT', resource: 'system', status: 'Success' as const },
    { action: 'UPDATE_SETTINGS', resource: 'system', status: 'Success' as const },
  ];
  const users = ['admin@aeroturbinespare.com', 'superadmin@aeroturbinespare.com', 'demo@aeroturbinespare.com'];
  return Array.from({ length: 40 }, (_, i) => {
    const a = actions[i % actions.length];
    const u = users[i % users.length];
    return {
      id: `log-seed-${i + 1}`,
      userId: `user-00${(i % 3) + 1}`,
      userEmail: u,
      userRole: u.includes('super') ? 'SuperAdmin' : u.includes('admin') ? 'Admin' : 'User',
      action: a.action,
      resource: a.resource,
      resourceId: `res-${i}`,
      details: `Mock audit entry ${i + 1}`,
      ipAddress: `192.168.1.${(i % 50) + 1}`,
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      status: a.status,
      createdAt: new Date(Date.now() - i * 3_600_000).toISOString(),
    } as AuditLog;
  });
}

function getMockBackups(): BackupRecord[] {
  return [
    {
      id: 'backup-seed-1',
      triggeredBy: 'system', type: 'scheduled', status: 'Complete',
      sizeBytes: 4_234_567, downloadUrl: '#',
      createdAt: new Date(Date.now() - 86_400_000).toISOString(),
      completedAt: new Date(Date.now() - 86_390_000).toISOString(),
    },
    {
      id: 'backup-seed-2',
      triggeredBy: 'superadmin@aeroturbinespare.com', type: 'manual', status: 'Complete',
      sizeBytes: 4_100_000, downloadUrl: '#',
      createdAt: new Date(Date.now() - 7 * 86_400_000).toISOString(),
      completedAt: new Date(Date.now() - 7 * 86_400_000 + 10_000).toISOString(),
    },
  ];
}
