import Image from "next/image";
import Script from "next/script";
import { ShieldCheck, Truck, Clock } from "lucide-react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

const STORAGE_URL = process.env.NEXT_PUBLIC_STORAGE_URL;
const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FB_PIXEL_ID;

function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-slate-900">
          Producto no encontrado
        </h1>
        <p className="mt-2 text-slate-500">
          El producto que buscas no está disponible.
        </p>
      </div>
    </div>
  );
}

export default async function Page({ searchParams }) {
  const params = await searchParams;
  const sku = params?.sku;

  if (!sku) return <NotFound />;

  const { data: product, error } = await supabase
    .from("products_data")
    .select("name, price, description_html, video_id, checkout_url")
    .eq("sku", sku)
    .single();

  if (error || !product) return <NotFound />;

  const imageUrl = STORAGE_URL + sku + ".webp";

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center">
          <Image
            src={STORAGE_URL + "logo-rubyk-black-sm.webp"}
            alt="Rubyk"
            width={120}
            height={40}
            className="h-10 w-auto md:hidden"
            priority
          />
          <Image
            src={STORAGE_URL + "logo-rubyk-black-lg.png"}
            alt="Rubyk"
            width={160}
            height={48}
            className="hidden md:block h-12 w-auto"
            priority
          />
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 pt-6 pb-28 md:pb-12">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          <div className="flex flex-col gap-4">
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-slate-200">
              <Image
                src={imageUrl}
                alt={product.name}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div className="flex items-center justify-center gap-6 py-3">
              <div className="flex items-center gap-1.5 text-slate-500 text-sm">
                <ShieldCheck className="w-4 h-4" />
                <span>Pago Seguro</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-500 text-sm">
                <Truck className="w-4 h-4" />
                <span>Envío Rápido</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-500 text-sm">
                <Clock className="w-4 h-4" />
                <span>Garantía Oficial</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
              {product.name}
            </h1>
            <p className="text-3xl text-emerald-600 font-bold">
              ${Number(product.price).toLocaleString("es-MX")}
            </p>
            <div
              className="prose prose-slate prose-sm md:prose-base max-w-none"
              dangerouslySetInnerHTML={{ __html: product.description_html }}
            />
            {product.video_id && (
              <div className="relative w-full aspect-[9/16] max-w-sm mx-auto mt-6 rounded-2xl overflow-hidden">
                <iframe
                  src={`https://www.youtube.com/embed/${product.video_id}?rel=0`}
                  title="Video del producto"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                />
              </div>
            )}
            <a
              href={product.checkout_url}
              className="hidden md:inline-flex items-center justify-center w-full py-4 px-6 rounded-xl bg-slate-900 text-white font-semibold text-lg hover:bg-slate-800 transition-colors"
            >
              Comprar Ahora — Pago Seguro
            </a>
          </div>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white/90 backdrop-blur-md border-t border-slate-200 px-4 py-3 safe-area-bottom">
        <a
          href={product.checkout_url}
          className="flex items-center justify-center w-full py-4 px-6 rounded-xl bg-slate-900 text-white font-semibold text-base hover:bg-slate-800 transition-colors"
        >
          Comprar Ahora — Pago Seguro
        </a>
      </div>

      {FB_PIXEL_ID && (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${FB_PIXEL_ID}');
            fbq('track', 'ViewContent');
          `}
        </Script>
      )}
    </div>
  );
}
