import { NextResponse } from "next/server";
import { addOrder, getOrders } from "@/lib/store";
import { isAdmin } from "@/lib/server-auth";
import { orderId } from "@/lib/utils";
import type { CartLine, Order } from "@/lib/types";
import { FREE_SHIPPING_THRESHOLD, STANDARD_SHIPPING } from "@/lib/checkout";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json(await getOrders());
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body || !Array.isArray(body.items) || body.items.length === 0) {
    return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
  }
  const items = body.items as CartLine[];
  const c = body.customer ?? {};
  for (const field of ["name", "email", "address", "city", "postcode"]) {
    if (!c[field] || String(c[field]).trim() === "") {
      return NextResponse.json(
        { error: `Missing field: ${field}` },
        { status: 400 }
      );
    }
  }

  const subtotal = items.reduce((s, l) => s + l.price * l.qty, 0);
  const shipping =
    subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING;

  const order: Order = {
    id: orderId(),
    createdAt: Date.now(),
    status: "paid",
    items,
    subtotal,
    shipping,
    total: subtotal + shipping,
    customer: {
      name: String(c.name),
      email: String(c.email),
      address: String(c.address),
      city: String(c.city),
      postcode: String(c.postcode),
      country: String(c.country || "United Kingdom"),
    },
  };
  await addOrder(order);
  return NextResponse.json({ ok: true, id: order.id, total: order.total }, { status: 201 });
}
