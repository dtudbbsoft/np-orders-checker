import { NextRequest, NextResponse } from 'next/server';
import { createUserSchema, logError } from './utils';
import { DEFAULT_BACKEND_URL } from '../../utils/constants';

/**
 * POST /api/v1/users - Creates a new user.
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = await req.json();
    const parsedBody = createUserSchema.safeParse(body);

    if (!parsedBody.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: parsedBody.error.flatten() },
        { status: 400 }
      );
    }

    const backendUrl = `${DEFAULT_BACKEND_URL}/users`;
    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(parsedBody.data),
    });

    if (!response.ok) {
      const errorText = await response.text();
      logError(`[POST /users] Backend error: ${response.status} ${response.statusText} - ${errorText}`);
      return NextResponse.json(
        { error: errorText || 'Failed to create user' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    logError(`[POST /users] Error: ${error}`);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
