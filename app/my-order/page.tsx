import Navbar from "@/components/Navbar";
import MyOrderClient from "@/components/MyOrderClient";

type MyOrderPageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

const normalizeParam = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value);

export default async function MyOrderPage({ searchParams }: MyOrderPageProps) {
  const params = await searchParams;
  const orderId = normalizeParam(params.orderId)?.trim() ?? null;
  const phone = normalizeParam(params.phone)?.trim() ?? null;

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <MyOrderClient initialOrderId={orderId} initialPhone={phone} />
    </main>
  );
}
