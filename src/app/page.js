import Image from "next/image";
import Script from "next/script";
import { redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { ShieldCheck } from "lucide-react";
import ProductUI from "@/components/ProductUI";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

const STORAGE_URL = process.env.NEXT_PUBLIC_STORAGE_URL;
const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FB_PIXEL_ID;

const STORE_URL = "https://rubyk.cercia.co/productos";

export default async function Page({ searchParams }) {
  const params = await searchParams;
  const sku = params?.sku;

  if (!sku) redirect(STORE_URL);

  const { data: product, error } = await supabase
    .from("products_data")
    .select("name, price, description_html, video_id, checkout_url, ml_url")
    .eq("sku", sku)
    .single();

  if (error || !product) redirect(STORE_URL);

  const imageUrl = STORAGE_URL + sku + ".webp";

  return (
    <div className="min-h-screen bg-white">
      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center">
          <a href={STORE_URL}>
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
          </a>
        </div>
      </header>

      {/* MAIN */}
      <main className="max-w-5xl mx-auto px-4 pt-6 pb-32 md:pb-16">
        <ProductUI product={product} imageUrl={imageUrl} />
      </main>

      {/* MOBILE STICKY CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white/95 backdrop-blur-md border-t border-slate-200 px-4 pt-2 pb-3 flex flex-col gap-2">
        <p className="text-center text-xs font-semibold text-slate-500 tracking-wide uppercase">
          Compra ahora — elige tu plataforma
        </p>
        <div className="flex gap-2">
        <a
          href={product.checkout_url}
          className="flex-1 flex items-center justify-center gap-2 py-3 px-3 rounded-2xl bg-slate-900 text-white font-bold text-sm shadow-xl active:scale-[0.98] transition-all duration-150"
        >
          <Image
            src={STORAGE_URL + "imagotipo-rubyk.webp"}
            alt="Rubyk"
            width={28}
            height={28}
            className="w-7 h-7 object-contain"
          />
          Tienda Rubyk
        </a>
        {product.ml_url && (
          <a
            href={product.ml_url}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-3 rounded-2xl bg-[#FFE600] text-slate-900 font-bold text-sm shadow-xl active:scale-[0.98] transition-all duration-150"
          >
            <Image
              src={STORAGE_URL + "mercadolibre-logo-h.webp"}
              alt="Mercado Libre"
              width={80}
              height={24}
              className="h-6 w-auto object-contain"
            />
          </a>
        )}
        </div>
      </div>

      {/* META PIXEL */}
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
