import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { FadeIn } from "@/components/motion/FadeIn";
import { Badge } from "@/components/ui/Badge";
import { createMetadata } from "@/lib/seo";
import { getBlogPosts, getBlogPostBySlug } from "@/lib/content";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return posts.filter((p) => !p.externalUrl).map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) return createMetadata();

  return createMetadata({
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
    },
  });
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) notFound();
  if (post.externalUrl) redirect(post.externalUrl);

  return (
    <article className="section-padding container-narrow pt-28 pb-20 sm:pt-36 sm:pb-28">
      <FadeIn>
        <Link
          href="/blog"
          className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-foreground"
        >
          ← Back to writing
        </Link>

        <div className="flex flex-wrap gap-1.5">
          {post.tags.map((tag) => (
            <Badge key={tag}>{tag}</Badge>
          ))}
        </div>

        <h1 className="mt-4 text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          {post.title}
        </h1>
        {post.publishedAt && (
          <p className="mt-3 text-sm text-muted-light">
            {new Date(post.publishedAt).toLocaleDateString(undefined, {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        )}
      </FadeIn>

      {post.coverImage && (
        <FadeIn delay={0.05} className="relative mt-10 aspect-[16/9] w-full overflow-hidden rounded-xl border border-border">
          <Image src={post.coverImage} alt="" fill className="object-cover" sizes="720px" />
        </FadeIn>
      )}

      <FadeIn
        delay={0.1}
        className="mt-10 space-y-5 text-base leading-relaxed text-muted [&_a]:text-accent [&_a]:underline [&_code]:rounded [&_code]:bg-border-subtle [&_code]:px-1 [&_code]:py-0.5 [&_h2]:mt-8 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-foreground [&_h3]:mt-6 [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-foreground [&_li]:ml-5 [&_ol]:list-decimal [&_ul]:list-disc"
      >
        <ReactMarkdown>{post.content ?? post.excerpt}</ReactMarkdown>
      </FadeIn>
    </article>
  );
}
