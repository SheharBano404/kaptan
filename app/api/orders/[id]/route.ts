import { NextResponse } from "next/server";
import { updateOrderStatus } from "@/lib/store";
import { isAdmin } from "@/lib/server-auth";
import type { Order } from "@/lib/types";

export const dynamic = "force-dynamic";

const STATUSES: Order["status"][] = ["pending", "paid", "shipped", "cancelled"];

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { status } = await req.json().catch(() => ({ status: "" }));
  if (!STATUSES.includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }
  await updateOrderStatus(params.id, status);
  return NextResponse.json({ ok: true });
}
