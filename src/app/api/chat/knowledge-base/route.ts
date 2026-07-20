import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const KB_DIR = path.join(process.cwd(), 'chat-data', 'kb');

async function ensureDir() {
  try { await fs.mkdir(KB_DIR, { recursive: true }); } catch { /* ok */ }
}

const DEFAULT_KB = [
  {
    id: 'kb-1',
    category: 'rfq',
    question: 'How do I request a quote?',
    answer: 'You can submit a Request for Quote (RFQ) in 3 easy steps:\n\n1. **Browse our catalog** to find the part you need\n2. Click "Request Quote" on the part page\n3. Fill in quantity, urgency, and shipping details\n\nVisit /rfq to start now. We guarantee a quote within **24 business hours**!',
    keywords: ['quote', 'rfq', 'request', 'price', 'how to order', 'buy part'],
    priority: 10,
    isActive: true,
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
  },
  {
    id: 'kb-2',
    category: 'contact',
    question: 'What is your phone number and email?',
    answer: 'You can reach us at:\n\n📞 **Phone:** +31611879800\n📧 **RFQ Email:** sales@aeroturbinespare.com\n📧 **General:** contact@aeroturbinespare.com\n\n**Address:** 1360-1362 NW 78th Ave, Doral, FL 33126, USA',
    keywords: ['phone', 'email', 'contact', 'call', 'address'],
    priority: 7,
    isActive: true,
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
  },
];

async function seedDefaults() {
  await ensureDir();
  for (const item of DEFAULT_KB) {
    const fp = path.join(KB_DIR, `${item.id}.json`);
    try { await fs.access(fp); } catch {
      await fs.writeFile(fp, JSON.stringify(item, null, 2), 'utf-8');
    }
  }
}

async function readAll() {
  await seedDefaults();
  const items: Record<string, unknown>[] = [];
  const files = await fs.readdir(KB_DIR);
  for (const f of files) {
    if (!f.endsWith('.json')) continue;
    const content = await fs.readFile(path.join(KB_DIR, f), 'utf-8');
    items.push(JSON.parse(content));
  }
  return items;
}

export async function GET() {
  const items = await readAll();
  return NextResponse.json({ items });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const item = {
      id: `kb_${Date.now()}`,
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await ensureDir();
    await fs.writeFile(path.join(KB_DIR, `${item.id}.json`), JSON.stringify(item, null, 2), 'utf-8');
    return NextResponse.json({ item }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create KB item' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const fp = path.join(KB_DIR, `${body.id}.json`);
    const existing = JSON.parse(await fs.readFile(fp, 'utf-8'));
    const updated = { ...existing, ...body, updatedAt: new Date().toISOString() };
    await fs.writeFile(fp, JSON.stringify(updated, null, 2), 'utf-8');
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: 'Failed to update KB item' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (id) {
      try { await fs.unlink(path.join(KB_DIR, `${id}.json`)); } catch { /* already gone */ }
    }
    return NextResponse.json({ deleted: id, success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete KB item' }, { status: 500 });
  }
}
