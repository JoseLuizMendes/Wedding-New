import { revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

interface RevalidateRequest {
  tag: string;
  secret: string;
}

/**
 * API route for on-demand cache revalidation
 * POST /api/revalidate
 * Body: { tag: string, secret: string }
 * 
 * Note: Next.js 16 introduced a new cacheLife system where revalidateTag
 * requires a second parameter for the cache profile. Using 'default'
 * applies standard revalidation behavior.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as RevalidateRequest;
    const { tag, secret } = body;

    // Validate secret
    if (!secret || secret !== process.env.REVALIDATION_SECRET) {
      return NextResponse.json(
        { error: 'Invalid secret' },
        { status: 401 }
      );
    }

    // Validate tag
    if (!tag || typeof tag !== 'string') {
      return NextResponse.json(
        { error: 'Invalid tag' },
        { status: 400 }
      );
    }

    // Revalidate the cache tag with default profile (Next.js 16 API)
    revalidateTag(tag, 'default');

    return NextResponse.json({
      revalidated: true,
      tag,
      timestamp: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json(
      { error: 'Failed to revalidate' },
      { status: 500 }
    );
  }
}
