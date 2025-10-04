import { NextResponse } from "next/server";
import dbConnect from "../../../../../lib/mongodb";
import VaultItem from "@/models/VaultItem";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

function getUserFromRequest(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader) return null;
  try {
    const token = authHeader.split(" ")[1];
    return jwt.verify(token, JWT_SECRET) as { userId: string };
  } catch {
    return null;
  }
}

// UPDATE
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    const user = getUserFromRequest(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const data = await req.json();
    const updated = await VaultItem.findOneAndUpdate(
      { _id: params.id, userId: user.userId },
      data,
      { new: true }
    );

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Failed to update item" }, { status: 500 });
  }
}

// DELETE
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    const user = getUserFromRequest(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await VaultItem.findOneAndDelete({ _id: params.id, userId: user.userId });
    return NextResponse.json({ message: "✅ Deleted successfully" });
  } catch {
    return NextResponse.json({ error: "Failed to delete item" }, { status: 500 });
  }
}
