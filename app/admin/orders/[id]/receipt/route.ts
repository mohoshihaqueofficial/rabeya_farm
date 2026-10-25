import { getCurrentAdmin } from "@/lib/admin-auth";
import { getOrder, readReceipt } from "@/lib/orders";

const contentTypes: Record<string, string> = { jpg: "image/jpeg", png: "image/png", webp: "image/webp" };

// Payment receipts are private: only a logged-in admin can view them (route handlers must check auth themselves).
export async function GET(_request: Request, { params }: RouteContext<"/admin/orders/[id]/receipt">) {
  if (!(await getCurrentAdmin())) return new Response("Unauthorized", { status: 401 });
  const { id } = await params;
  const order = await getOrder(id);
  const file = order?.receipt ? await readReceipt(order.receipt) : null;
  if (!order?.receipt || !file) return new Response("Not found", { status: 404 });
  return new Response(new Uint8Array(file), {
    headers: {
      "Content-Type": contentTypes[order.receipt.split(".").pop() ?? ""] ?? "application/octet-stream",
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
      "Content-Disposition": `inline; filename="${order.receipt}"`,
    },
  });
}
