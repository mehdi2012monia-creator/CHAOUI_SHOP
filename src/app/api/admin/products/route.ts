import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    products: [],
  });
}

export async function POST(request: Request) {
  try {
    const product = await request.json();

    return NextResponse.json(
      {
        success: true,
        product,
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: "Invalid product data",
      },
      { status: 400 }
    );
  }
}
      { status: 400 }
    );
  }
}
```
