import { NextResponse, NextRequest } from "next/server";

export async function GET() {
  return NextResponse.json({
    method: "GET",
    message: "hello worlddasdasd,",
  });
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  return NextResponse.json({
    method: "POST",
    message: "POSTTTTTT",
    body,
  });
}

export async function PUT(req: NextRequest) {
  const body = await req.json();

  return NextResponse.json({
    method: "PUT",
    message: "PUTTTTT",
    body,
  });
}

export async function DELETE(req: NextRequest) {
  const body = await req.json();

  return NextResponse.json({
    method: "DELETE",
    message: "DELETEEEEE",
    body,
  });
}
