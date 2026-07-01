"use client";

import * as Popover from "@radix-ui/react-popover";
import Link from "next/link";
import { ExternalLink, X } from "lucide-react";
import { useState, type SVGProps } from "react";

const INSTAGRAM_URL = "https://www.instagram.com/marbellacosmetics1";
const WEBSITE_URL = "https://marbellacosmetics.com";
const INSTAGRAM_PROFILE_IMAGE = "/logo-orange.png";

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
          collisionPadding={12}
          className="z-50 w-[calc(100vw-2rem)] max-w-[22rem] rounded-3xl border border-white/10 bg-black/95 p-4 shadow-2xl shadow-black/40 backdrop-blur-xl sm:w-[22rem]"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-full border-2 border-transparent bg-gradient-to-tr from-[#feda75] via-[#d62976] to-[#4f5bd5] p-[2px] shadow-lg">
                <div className="h-full w-full overflow-hidden rounded-full bg-black">
                  <img
                    src={INSTAGRAM_PROFILE_IMAGE}
                    alt="marbellacosmetics1"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
              <div className="min-w-0">
                <div className="truncate text-base font-semibold text-white">
                  marbellacosmetics1
                </div>
                <div className="truncate text-sm text-white/70">
                  Marbella = Glamour &amp; Chaos 🏝
                </div>
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

          <div className="mt-4 space-y-3 text-sm text-white/80" dir="rtl">
            <p className="leading-relaxed">
              ماربيا تان، المعروف لا يُعرف
              <br />
              ضمان الصيغه من الاستخدام الأول 🌟
              <br />
              1000+ رأي وتجربة في الـ Highlights
            </p>
            <Link
              href={WEBSITE_URL}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-block text-sm text-sky-400 hover:underline"
              dir="ltr"
            >
              marbellacosmetics.com
            </Link>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2 text-center" dir="rtl">
            <div className="rounded-2xl bg-white/5 p-2.5">
              <div className="text-base font-semibold text-white">161</div>
              <div className="text-xs text-white/60">منشورات</div>
            </div>
            <div className="rounded-2xl bg-white/5 p-2.5">
              <div className="text-base font-semibold text-white">19.4K</div>
              <div className="text-xs text-white/60">متابعين</div>
            </div>
            <div className="rounded-2xl bg-white/5 p-2.5">
              <div className="text-base font-semibold text-white">12</div>
              <div className="text-xs text-white/60">يتابع</div>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
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
