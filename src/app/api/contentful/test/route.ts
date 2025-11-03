import { NextResponse } from 'next/server';

export async function GET() {
  const spaceId = process.env.CONTENTFUL_SPACE_ID!;
  const envId = process.env.CONTENTFUL_ENVIRONMENT || 'master';
  const token = process.env.CONTENTFUL_CMA_TOKEN!;

  const res = await fetch(`https://api.contentful.com/spaces/${spaceId}/environments/${envId}/content_types`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();
  return NextResponse.json(data);
}
