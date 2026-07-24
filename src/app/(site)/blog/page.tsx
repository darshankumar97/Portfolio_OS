import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { FadeIn } from "@/components/motion/FadeIn";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Badge } from "@/components/ui/Badge";
import { createMetadata } from "@/lib/seo";
import { getBlogPosts } from "@/lib/content";

export async function generateMetadata(): Promise<Metadata> {
  return createMetadata({ title: "Writing" });
}

export default async function BlogIndexPage() {
  const posts = await getBlogPosts();

  return (
    <div className="section-padding container-wide pt-28 pb-20 sm:pt-36 sm:pb-28">
      <FadeIn>
        <SectionHeading label="Writing" title="Posts & notes" />
      </FadeIn>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post, i) => {
          const href = post.externalUrl ?? `/blog/${post.slug}`;
          const external = Boolean(post.externalUrl);
          return (
            <FadeIn key={post.id} delay={i * 0.06}>
              <Link
                href={href}
                target={external ? "_blank" : undefined}
                rel={external ? "noopener noreferrer" : undefined}
                className="flex h-full flex-col overflow-hidden rounded-xl border border-border bg-surface-elevated transition-all duration-200 hover:border-muted-light/40 hover:shadow-sm"
              >
                {post.coverImage && (
                  <div className="relative aspect-[16/9] w-full">
                    <Image src={post.coverImage} alt="" fill className="object-cover" sizes="(min-width: 1024px) 33vw, 50vw" />
                  </div>
                )}
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="text-base font-semibold text-foreground">{post.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{post.excerpt}</p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {post.tags.map((tag) => (
                      <Badge key={tag}>{tag}</Badge>
                    ))}
                  </div>
                </div>
              </Link>
            </FadeIn>
          );
        })}
      </div>
    </div>
  );
}
