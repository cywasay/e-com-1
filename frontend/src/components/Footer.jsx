"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { resolvePublicSettings } from "@/lib/fetchPublicSettings";

const SOCIAL_LABELS = {
  facebook_url: "FB",
  instagram_url: "IG",
  linkedin_url: "IN",
  twitter_url: "X",
};

export default function Footer({ settings = {} }) {
  const store = resolvePublicSettings(settings);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const socialLinks = Object.entries(SOCIAL_LABELS)
    .map(([key, label]) => ({ key, label, href: store[key] }))
    .filter((item) => item.href);

  const handleNewsletter = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail("");
  };

  return (
    <footer className="border-t border-[#ffffff]/10 bg-[#1a1a2e]">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-widest text-white">{store.store_name}</h3>
            <p className="text-sm leading-relaxed text-white/60">
              Premium corporate uniforms and workwear for organizations across the UAE and GCC.
            </p>
            {socialLinks.length > 0 && (
              <div className="flex gap-3 pt-2">
                {socialLinks.map(({ key, label, href }) => (
                  <a
                    key={key}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-[10px] font-bold text-white/60 transition-colors hover:border-accent hover:text-accent"
                    aria-label={key.replace("_url", "")}
                  >
                    {label}
                  </a>
                ))}
              </div>
            )}
          </div>

          <div>
            <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-white/80">Explore</h4>
            <ul className="space-y-2 text-sm text-white/60">
              <li><Link href="/products" className="hover:text-accent">Catalog</Link></li>
              <li><Link href="/catalogs" className="hover:text-accent">PDF Catalogs</Link></li>
              <li><Link href="/blog" className="hover:text-accent">Blog</Link></li>
              <li><Link href="/case-studies" className="hover:text-accent">Case Studies</Link></li>
              <li><Link href="/wholesale" className="hover:text-accent">Wholesale</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-white/80">Contact</h4>
            <ul className="space-y-2 text-sm text-white/60">
              {store.store_phone && <li>{store.store_phone}</li>}
              {store.store_email && (
                <li>
                  <a href={`mailto:${store.store_email}`} className="inline-flex items-center gap-2 hover:text-accent">
                    <Mail size={14} />
                    {store.store_email}
                  </a>
                </li>
              )}
              <li><Link href="/contact" className="hover:text-accent">Request a quote</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-white/80">Newsletter</h4>
            <p className="mb-4 text-sm text-white/60">Industry insights and product updates.</p>
            {subscribed ? (
              <p className="text-sm font-medium text-accent">Thanks — you&apos;re on the list.</p>
            ) : (
              <form onSubmit={handleNewsletter} className="flex gap-2">
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                  className="border-white/10 bg-white/5 text-white placeholder:text-white/40"
                  required
                />
                <Button type="submit" variant="accent" size="sm" className="shrink-0">
                  Join
                </Button>
              </form>
            )}
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-sm text-white/60 md:flex-row">
          <p>© {new Date().getFullYear()} {store.store_name}. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/contact" className="transition-colors hover:text-accent">Contact</Link>
            <Link href="/privacy" className="transition-colors hover:text-accent">Privacy Policy</Link>
            <Link href="/terms" className="transition-colors hover:text-accent">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
