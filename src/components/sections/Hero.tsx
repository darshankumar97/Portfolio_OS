"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import type { Profile, SiteConfig } from "@/types/content";

interface HeroProps {
  profile: Profile;
  site: SiteConfig;
}

export function Hero({ profile, site }: HeroProps) {
  return (
    <section className="section-padding container-wide pt-32 pb-20 sm:pt-40 sm:pb-28">
      <div className="max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
        >
          <div className="mb-6 flex flex-wrap items-center gap-2">
            <Badge variant="accent">{profile.title}</Badge>
            <Badge variant="muted">{profile.location}</Badge>
          </div>

          <h1 className="text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-[3.25rem] lg:leading-[1.15]">
            {profile.headline}
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">
            {profile.subheadline}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/#work">View work</Button>
            <Button href="/#contact" variant="secondary">
              Contact
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="mt-16 grid gap-6 border-t border-border pt-10 sm:grid-cols-3"
        >
          {profile.highlights.map((item) => (
            <div key={item.label}>
              <p className="text-xs font-medium tracking-wide text-muted-light uppercase">
                {item.label}
              </p>
              <p className="mt-1 text-sm font-medium text-foreground">{item.value}</p>
            </div>
          ))}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 text-xs text-muted-light"
        >
          {site.name} · {site.domain}
        </motion.p>
      </div>
    </section>
  );
}
