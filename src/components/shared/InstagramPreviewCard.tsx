"use client";

import * as Popover from "@radix-ui/react-popover";
import Link from "next/link";
import { ExternalLink, X } from "lucide-react";
import { useState, type SVGProps } from "react";

const INSTAGRAM_URL = "https://www.instagram.com/marbellacosmetics1";

function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2Zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5A4.25 4.25 0 0 0 20.5 16.25v-8.5A4.25 4.25 0 0 0 16.25 3.5h-8.5Zm4.25 3.25a5.5 5.5 0 1 1 0 11 5.5 5.5 0 0 1 0-11Zm0 1.5a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm4.88-.6a1.1 1.1 0 1 1 0 2.2 1.1 1.1 0 0 1 0-2.2Z" />
    </svg>
  );
}

export function InstagramPreviewCard() {
  const [open, setOpen] = useState(false);

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium text-neutral-900 shadow-sm transition hover:bg-neutral-100 focus:ring-2 focus:ring-golden focus:outline-none"
          aria-expanded={open}
        >
          <span
            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-white shadow-md"
            style={{
              background:
                "linear-gradient(135deg, #feda75 0%, #fa7e1e 25%, #d62976 50%, #962fbf 75%, #4f5bd5 100%)",
            }}
          >
            <InstagramIcon className="h-4 w-4" />
          </span>
          <span>Instagram</span>
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          side="bottom"
          sideOffset={12}
          align="center"
          className="z-50 w-[22rem] rounded-3xl border border-white/10 bg-black/95 p-4 shadow-2xl shadow-black/40 backdrop-blur-xl"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div
                className="flex h-14 w-14 items-center justify-center rounded-full text-white shadow-lg"
                style={{
                  background:
                    "linear-gradient(135deg, #feda75 0%, #fa7e1e 25%, #d62976 50%, #962fbf 75%, #4f5bd5 100%)",
                }}
              >
                <InstagramIcon className="h-6 w-6" />
              </div>
              <div>
                <div className="text-base font-semibold">marbellacosmetics1</div>
                <div className="text-sm text-white/60">Natural tanning & beauty</div>
              </div>
            </div>
            <Popover.Close asChild>
              <button
                type="button"
                className="rounded-full p-2 text-white/70 transition hover:bg-white/10 hover:text-white focus:outline-none"
                aria-label="Close preview"
              >
                <X className="h-4 w-4" />
              </button>
            </Popover.Close>
          </div>

          <div className="mt-4 space-y-3 text-sm text-white/70">
            <p>
              تتبعنا على إنستقرام لمشاهدة أحدث الصور، الفيديوهات، والعروض الخاصة بصبغات التسمير
              والمنتجات الطبيعية.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-3xl bg-white/5 p-3 text-center">
                <div className="text-sm text-white/60">تابع</div>
                <div className="mt-1 text-lg font-semibold">4.2K</div>
              </div>
              <div className="rounded-3xl bg-white/5 p-3 text-center">
                <div className="text-sm text-white/60">منشورات</div>
                <div className="mt-1 text-lg font-semibold">182</div>
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between gap-3">
            <Link
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-neutral-900 transition hover:bg-neutral-100"
            >
              Open profile
              <ExternalLink className="h-4 w-4" />
            </Link>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-sm text-white/60 transition hover:text-white"
            >
              Close
            </button>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
