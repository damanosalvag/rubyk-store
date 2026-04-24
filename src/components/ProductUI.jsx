"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { ShieldCheck, Truck, BadgeCheck, Star, Flame, Lock } from "lucide-react";

const DISCOUNT_OPTIONS = [0.15, 0.18, 0.19, 0.20];

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function fmt(n) {
  return n.toLocaleString("es-CO", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

function pad(n) {
  return String(n).padStart(2, "0");
}

export default function ProductUI({ product, imageUrl }) {
  const [discount, setDiscount] = useState(null);
  const [secs, setSecs]         = useState(null);
  const intervalRef             = useRef(null);

  // Single initialisation effect — runs once on mount
  useEffect(() => {
    const disc  = pickRandom(DISCOUNT_OPTIONS);
    const hours = Math.floor(Math.random() * 15) + 10; // 10–24 h
    const extra = Math.floor(Math.random() * 59) * 60; // random minutes
    const total = hours * 3600 + extra;

    setDiscount(disc);
    setSecs(total);

    intervalRef.current = setInterval(() => {
      setSecs((s) => (s > 0 ? s - 1 : 0));
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, []);

  const basePrice     = Number(product.price);
  const originalPrice = discount !== null
    ? Math.round(basePrice / (1 - discount))
    : null;

  const timerParts = secs === null
    ? { h: "--", m: "--", s: "--" }
    : {
        h: pad(Math.floor(secs / 3600)),
        m: pad(Math.floor((secs % 3600) / 60)),
        s: pad(secs % 60),
      };

  return (
    /* ─── TWO-COLUMN GRID (desktop) / single stack (mobile) ─── */
    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">

      {/* ── LEFT COLUMN: image + badges ── */}
      <div className="flex flex-col gap-4">

        {/* Main image */}
        <div className="relative group aspect-square overflow-hidden rounded-2xl bg-slate-100 shadow-sm">
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <a
            href={product.checkout_url}
            className="absolute bottom-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-sm text-white text-xs font-medium hover:bg-black/80 transition-colors"
          >
            + Ver galería completa
          </a>
        </div>

        {/* Trust badges */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { icon: Lock,       label: "Pago 100%",  sub: "Seguro"      },
            { icon: Truck,      label: "Envío",       sub: "Garantizado" },
            { icon: BadgeCheck, label: "Soporte",     sub: "Prioritario" },
          ].map(({ icon: Icon, label, sub }) => (
            <div
              key={label}
              className="flex flex-col items-center gap-1 py-3 rounded-xl bg-slate-50 border border-slate-200"
            >
              <Icon className="w-5 h-5 text-emerald-600" strokeWidth={1.75} />
              <span className="text-xs font-semibold text-slate-800 leading-tight text-center">{label}</span>
              <span className="text-xs text-slate-500 leading-tight">{sub}</span>
            </div>
          ))}
        </div>

        {/* Video — desktop only, left column */}
        {product.video_id && (
          <div className="hidden md:flex w-full rounded-2xl bg-slate-50 border border-slate-200 items-center justify-center py-6">
            <div className="relative w-full max-w-sm aspect-[9/16] rounded-xl overflow-hidden shadow-sm">
              <iframe
                src={`https://www.youtube.com/embed/${product.video_id}?rel=0&autoplay=1&mute=1&loop=1&playlist=${product.video_id}`}
                title="Video del producto"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            </div>
          </div>
        )}
      </div>

      {/* ── RIGHT COLUMN: all product info ── */}
      <div className="flex flex-col gap-5">

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
          {product.name}
        </h1>

        {/* Stars + sold count */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
            ))}
            <span className="ml-1.5 text-sm font-semibold text-slate-700">4.9/5</span>
          </div>
          <span className="text-slate-300 select-none">|</span>
          <span className="text-sm text-slate-500">Más de 1,200 vendidos</span>
        </div>

        {/* Scarcity bar */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-xs font-medium">
            <span className="flex items-center gap-1 text-rose-600">
              <Flame className="w-3.5 h-3.5" />
              Últimas 4 unidades disponibles
            </span>
            <span className="text-slate-400">Stock crítico</span>
          </div>
          <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-orange-500 to-rose-500"
              style={{ width: "8%" }}
            />
          </div>
        </div>

        {/* Price block */}
        <div className="flex flex-col gap-2">
          {originalPrice !== null && discount !== null && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="line-through text-slate-400 text-lg">
                ${fmt(originalPrice)} COP
              </span>
              <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-700 text-xs font-bold uppercase tracking-wide">
                -{Math.round(discount * 100)}% hoy
              </span>
            </div>
          )}
          <p className="text-4xl font-extrabold text-slate-900">
            ${fmt(basePrice)}
            <span className="text-lg font-semibold text-slate-500 ml-1">COP</span>
          </p>

          {/* Countdown pill */}
          <div className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-rose-600 w-fit shadow-sm">
            <Flame className="w-4 h-4 text-white shrink-0" />
            <span className="text-white text-sm font-bold tracking-wide whitespace-nowrap">
              Oferta termina en:&nbsp;
            </span>
            <span className="flex items-center gap-1 font-mono text-white text-sm font-bold">
              <span>{timerParts.h}</span>
              <span className="text-rose-200 text-xs font-normal">h</span>
              <span className="text-rose-300">:</span>
              <span>{timerParts.m}</span>
              <span className="text-rose-200 text-xs font-normal">m</span>
              <span className="text-rose-300">:</span>
              <span>{timerParts.s}</span>
              <span className="text-rose-200 text-xs font-normal">s</span>
            </span>
          </div>
        </div>

        {/* Description */}
        <div
          className="prose prose-slate prose-sm md:prose-base max-w-none"
          dangerouslySetInnerHTML={{ __html: product.description_html }}
        />

        {/* Video — mobile only, right column */}
        {product.video_id && (
          <div className="md:hidden relative w-full aspect-[9/16] max-w-xs mx-auto rounded-2xl overflow-hidden shadow-md">
            <iframe
              src={`https://www.youtube.com/embed/${product.video_id}?rel=0&autoplay=1&mute=1&loop=1&playlist=${product.video_id}`}
              title="Video del producto"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          </div>
        )}

        {/* CTA — visible only on desktop (mobile uses sticky bar in page.js) */}
        <a
          href={product.checkout_url}
          className="hidden md:inline-flex items-center justify-center gap-2 w-full py-4 px-6 rounded-2xl bg-slate-900 text-white font-bold text-lg shadow-lg hover:bg-slate-800 active:scale-[0.98] transition-all duration-150 animate-pulse-cta"
        >
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          Asegurar Oferta y Ver Detalles
        </a>
      </div>
    </div>
  );
}
