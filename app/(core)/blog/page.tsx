import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, CalendarDays, Clock3 } from 'lucide-react'

import { blogPosts, formatBlogDate } from '@/features/blog/data/posts'
import { blogBodyFont, blogUiFont } from '@/features/blog/styles/font'

export default function BlogPage() {
  return (
    <div className={`${blogUiFont.className} -mx-6 space-y-6 px-6 md:-mx-8 md:px-8`}>
      <section className="rounded-2xl border border-border/70 bg-gradient-to-r from-primary/10 via-card to-secondary/10 px-6 py-8 shadow-sm md:px-10 md:py-10">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary/90">
          PayVue Engineering
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
          블로그
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground md:text-base">
          개발자를 위한 탁월한 지식과 경험을 공유하며 함께 성장합니다.
        </p>
      </section>

      <section className="rounded-2xl border border-border/70 bg-card shadow-sm">
        <div className="px-6 py-5 md:px-8">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">Latest Articles</h2>
        </div>

        <div className="divide-y divide-border/70 px-6 pb-2 md:px-8">
          {blogPosts.map((post) => (
            <article key={post.slug} className="grid gap-5 py-8 md:grid-cols-[300px_minmax(0,1fr)]">
              <Link
                href={`/blog/${post.slug}`}
                className="group relative block h-52 overflow-hidden rounded-xl border border-border/70 bg-muted/30 md:h-full"
              >
                <Image
                  src={post.coverImage}
                  alt={post.coverAlt}
                  fill
                  sizes="(max-width: 768px) 100vw, 300px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-black/0 to-transparent" />
                <span className="absolute left-4 top-4 rounded-full border border-white/40 bg-black/20 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-white backdrop-blur-sm">
                  {post.category}
                </span>
              </Link>

              <div className="space-y-3.5">
                <h3 className="text-2xl font-semibold leading-tight tracking-tight text-foreground">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="transition-colors hover:text-primary"
                  >
                    {post.title}
                  </Link>
                </h3>

                <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarDays className="h-3.5 w-3.5" />
                    {formatBlogDate(post.publishedAt)}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock3 className="h-3.5 w-3.5" />
                    {post.readingTime}
                  </span>
                </div>

                <p className={`${blogBodyFont.className} text-[17px] leading-8 text-foreground/80`}>
                  {post.summary}
                </p>

                <div className="flex items-center justify-between gap-4 border-t border-border/70 pt-5">
                  <div className="flex items-center gap-3">
                    <div className="relative h-9 w-9 overflow-hidden rounded-full border border-border/70 bg-muted/50">
                      <Image
                        src={post.authorAvatar}
                        alt={`${post.author} 프로필 이미지`}
                        fill
                        sizes="36px"
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{post.author}</p>
                      <p className="text-xs text-muted-foreground">{post.authorRole}</p>
                    </div>
                  </div>

                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-foreground/85 transition-colors hover:text-primary"
                  >
                    자세히 보기
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
