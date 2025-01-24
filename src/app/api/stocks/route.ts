import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = "http://localhost:8080";

export async function GET() {
  try {
    const response = await fetch(`${BACKEND_URL}/stocks`);
    if (!response.ok) {
      throw new Error("Failed to fetch stocks");
    }
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching stocks:", error);
    return NextResponse.json(
      { error: "Failed to fetch stocks" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const stock = await request.json();
    const response = await fetch(`${BACKEND_URL}/stocks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(stock),
    });

    if (!response.ok) {
      throw new Error("Failed to add stock");
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error adding stock:", error);
    return NextResponse.json({ error: "Failed to add stock" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const stock = await request.json();
    const response = await fetch(`${BACKEND_URL}/stocks/${params.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(stock),
    });

    if (!response.ok) {
      throw new Error("Failed to update stock");
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error updating stock:", error);
    return NextResponse.json(
      { error: "Failed to update stock" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const response = await fetch(`${BACKEND_URL}/stocks/${params.id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete stock");
    }

    return NextResponse.json({ message: "Stock deleted successfully" });
  } catch (error) {
    console.error("Error deleting stock:", error);
    return NextResponse.json(
      { error: "Failed to delete stock" },
      { status: 500 }
    );
  }
}
