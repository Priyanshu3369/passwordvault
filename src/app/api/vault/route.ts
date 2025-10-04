import { NextResponse } from "next/server";
import dbConnect from "../../../../lib/mongodb";
import VaultItem from "@/models/VaultItem";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

// Middleware: Extract user from token
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

// CREATE Vault Item
export async function POST(req: Request) {
  try {
    await dbConnect();
    const user = getUserFromRequest(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const data = await req.json();
    const newItem = await VaultItem.create({ ...data, userId: user.userId });

    return NextResponse.json(newItem);
  } catch (err) {
    return NextResponse.json({ error: "Failed to create item" }, { status: 500 });
  }
}

// GET all Vault Items
export async function GET(req: Request) {
  try {
    await dbConnect();
    const user = getUserFromRequest(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const items = await VaultItem.find({ userId: user.userId });
    return NextResponse.json(items);
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch items" }, { status: 500 });
  }
}
