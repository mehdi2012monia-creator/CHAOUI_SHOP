```ts
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    products: [],
    message: "Database is not configured yet.",
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    return NextResponse.json(
      {
        success: true,
        product: body,
        message: "Product saved temporarily. Database is not configured.",
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Invalid request.",
      },
      { status: 400 }
    );
  }
}
```
