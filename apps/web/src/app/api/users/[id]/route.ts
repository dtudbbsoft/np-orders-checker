import { NextRequest, NextResponse } from "next/server";
import { logError } from '../utils';
import { DEFAULT_BACKEND_URL } from "@/app/utils/constants";

export async function PATCH(
  req: NextRequest,
  context: { params: { id: string } }
): Promise<NextResponse> {
    try {
const { id } = await context.params;
    const backendUrl = `${DEFAULT_BACKEND_URL}/users/${id}`;

    const body = await req.json();
    const res = await fetch(backendUrl, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errorText = await res.text();
      logError(`[PATCH /users/${id}] Backend error: ${res.status} ${res.statusText} - ${errorText}`);
      return NextResponse.json(
        { error: errorText || 'Failed to update user' },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data, { status: 200 });
    } catch (error) {
        logError(`[PATCH /users/:id] Error: ${error}`);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Internal server error' },
            { status: 500 }
        );
    }
}