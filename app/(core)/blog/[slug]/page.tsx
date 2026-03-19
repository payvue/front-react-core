import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowRight, CalendarDays, Clock3 } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

import { blogPosts, formatBlogDate, getBlogPostBySlug } from '@/features/blog/data/posts'
import { BlogCodeBlock } from '@/features/blog/components/blog-code-block'
import { blogBodyFont, blogUiFont } from '@/features/blog/styles/font'

interface BlogPostPageProps {
  params: {
    slug: string
  }
}

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }))
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const post = getBlogPostBySlug(params.slug)

  if (!post) {
    notFound()
  }

  const otherPosts = blogPosts.filter((item) => item.slug !== post.slug)
  const markdownParagraphClass = `${blogBodyFont.className} text-[18px] leading-9 tracking-[0.005em] text-foreground/85`
  const markdownListClass = `${blogBodyFont.className} my-2 list-disc space-y-2.5 pl-7 text-[18px] leading-9 tracking-[0.005em] text-foreground/85 marker:text-primary/70`
  const imageClassByFit = (fit?: 'cover' | 'contain') =>
    fit === 'contain' ? 'object-contain p-2 md:p-3' : 'object-cover'

  return (
    <div className={`${blogUiFont.className} -mx-6 space-y-6 px-6 md:-mx-8 md:px-8`}>
      <header className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm">
        <div className="flex items-center justify-between border-b border-border/70 px-5 py-4 md:px-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-semibold tracking-tight text-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            PayVue Blog
          </Link>
          <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground">Article</p>
        </div>

        <div className="relative h-64 overflow-hidden md:h-96">
          <Image
            src={post.coverImage}
            alt={post.coverAlt}
            fill
            sizes="(max-width: 1024px) 100vw, 1024px"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/12 to-black/0" />
          <div className="absolute inset-x-0 bottom-0 px-5 pb-8 md:px-8">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/90">
              {post.category}
            </p>
            <h1 className="mt-2 max-w-3xl text-3xl font-semibold leading-tight tracking-tight text-white md:text-4xl">
              {post.title}
            </h1>
            <p className="mt-3 max-w-3xl text-sm text-white/85 md:text-base">{post.subtitle}</p>
          </div>
        </div>
      </header>

      <main className="rounded-2xl border border-border/70 bg-card px-5 py-8 shadow-sm md:px-8 md:py-10">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8 flex flex-col gap-4 border-b border-border/70 pb-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <div className="relative h-11 w-11 overflow-hidden rounded-full border border-border/70 bg-muted/50">
                <Image
                  src={post.authorAvatar}
                  alt={`${post.author} 프로필 이미지`}
                  fill
                  sizes="44px"
                  className="object-cover"
                />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{post.author}</p>
                <p className="text-xs text-muted-foreground">{post.authorRole}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays className="h-3.5 w-3.5" />
                {formatBlogDate(post.publishedAt)}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock3 className="h-3.5 w-3.5" />
                {post.readingTime}
              </span>
            </div>
          </div>

          <article className="space-y-10">
            {post.sections.map((section) => (
              <section
                key={section.title}
                className="space-y-4 border-b border-border/70 pb-10 last:border-b-0 last:pb-0"
              >
                <h2 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
                  {section.title}
                </h2>

                {section.image ? (
                  <figure className="mt-4 mb-6 overflow-hidden rounded-xl border border-border/70 bg-muted/20 md:mt-5 md:mb-8">
                    <div
                      className="relative w-full bg-[#f8f5ff]/70"
                      style={{ aspectRatio: section.image.aspectRatio ?? '16 / 9' }}
                    >
                      <Image
                        src={section.image.src}
                        alt={section.image.alt}
                        fill
                        sizes="(max-width: 1024px) 100vw, 960px"
                        className={imageClassByFit(section.image.fit)}
                      />
                    </div>
                    {section.image.caption ? (
                      <figcaption className="border-t border-border/70 px-4 py-3 text-sm text-muted-foreground md:px-5">
                        {section.image.caption}
                      </figcaption>
                    ) : null}
                  </figure>
                ) : null}

                <div className="space-y-3.5">
                  {section.paragraphs.map((paragraph, index) => (
                    <div key={`${section.title}-${index}`} className="space-y-3.5">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        skipHtml
                        components={{
                          p: ({ children }) => <p className={markdownParagraphClass}>{children}</p>,
                          strong: ({ children }) => (
                            <strong className="font-semibold text-foreground">{children}</strong>
                          ),
                          em: ({ children }) => (
                            <em className="italic text-foreground">{children}</em>
                          ),
                          ul: ({ children }) => <ul className={markdownListClass}>{children}</ul>,
                          ol: ({ children }) => (
                            <ol className={markdownListClass.replace('list-disc', 'list-decimal')}>
                              {children}
                            </ol>
                          ),
                          li: ({ children }) => <li className="pl-1.5">{children}</li>,
                          blockquote: ({ children }) => (
                            <blockquote
                              className={`${blogBodyFont.className} ml-4 border-l-2 border-primary/40 pl-5 text-[17px] leading-8 tracking-[0.004em] text-foreground/90 [&>p]:m-0`}
                            >
                              {children}
                            </blockquote>
                          ),
                          code: ({ children }) => (
                            <code className="rounded bg-muted/70 px-1.5 py-0.5 text-[0.92em] text-foreground">
                              {children}
                            </code>
                          ),
                          a: ({ children, href }) => (
                            <a
                              href={href}
                              className="font-medium text-primary underline underline-offset-4"
                              target="_blank"
                              rel="noreferrer noopener"
                            >
                              {children}
                            </a>
                          ),
                        }}
                      >
                        {paragraph}
                      </ReactMarkdown>

                      {section.inlineImages
                        ?.filter((image) => image.insertAfterParagraph === index)
                        .map((image) => (
                          <figure
                            key={`${section.title}-inline-${index}-${image.src}`}
                            className="mt-6 mb-6 overflow-hidden rounded-xl border border-border/70 bg-muted/20 md:mt-8 md:mb-8"
                          >
                            <div
                              className="relative w-full bg-[#f8f5ff]/70"
                              style={{ aspectRatio: image.aspectRatio ?? '16 / 9' }}
                            >
                              <Image
                                src={image.src}
                                alt={image.alt}
                                fill
                                sizes="(max-width: 1024px) 100vw, 960px"
                                className={imageClassByFit(image.fit)}
                              />
                            </div>
                            {image.caption ? (
                              <figcaption className="border-t border-border/70 px-4 py-3 text-sm text-muted-foreground md:px-5">
                                {image.caption}
                              </figcaption>
                            ) : null}
                          </figure>
                        ))}

                      {section.inlineCodeBlocks
                        ?.filter((codeBlock) => codeBlock.insertAfterParagraph === index)
                        .map((codeBlock, codeIndex) => (
                          <BlogCodeBlock
                            key={`${section.title}-inline-code-${index}-${codeBlock.label ?? codeIndex}`}
                            code={codeBlock.code}
                            language={codeBlock.language}
                            label={codeBlock.label}
                            layout={codeBlock.layout}
                          />
                        ))}

                      {section.columnHighlights &&
                      section.columnHighlights.insertAfterParagraph === index &&
                      section.columnHighlights.items.length > 0 ? (
                        <div className="my-5 md:my-6">
                          <div className="flex flex-col divide-y divide-border/70 md:flex-row md:divide-x md:divide-y-0">
                            {section.columnHighlights.items.map((item) => (
                              <div
                                key={`${section.title}-column-highlight-${item}`}
                                className="flex min-h-[92px] items-center justify-center px-1 py-3 md:flex-1 md:px-5 md:py-2"
                              >
                                <p
                                  className={`${blogUiFont.className} text-center text-[17px] leading-8 font-medium tracking-[-0.01em] text-foreground/92`}
                                >
                                  {item}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>

                {section.codeBlock && (!section.inlineCodeBlocks || section.inlineCodeBlocks.length === 0) ? (
                  <BlogCodeBlock
                    code={section.codeBlock.code}
                    language={section.codeBlock.language}
                    label={section.codeBlock.label}
                    layout={section.codeBlock.layout}
                  />
                ) : null}

                {section.takeaways ? (
                  <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
                    <h3 className="mb-2 text-sm font-semibold uppercase tracking-[0.09em] text-primary">
                      Key Points
                    </h3>
                    <ul
                      className={`${blogBodyFont.className} list-disc space-y-2 pl-5 text-[16px] leading-8 text-foreground/85`}
                    >
                      {section.takeaways.map((takeaway) => (
                        <li key={takeaway}>{takeaway}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </section>
            ))}
          </article>

          {otherPosts.length > 0 ? (
            <section className="mt-12 border-t border-border/70 pt-8">
              <h2 className="text-xl font-semibold tracking-tight text-foreground">
                More Articles
              </h2>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                {otherPosts.map((item) => (
                  <Link
                    key={item.slug}
                    href={`/blog/${item.slug}`}
                    className="group rounded-xl border border-border/70 bg-muted/20 p-4 transition-colors hover:border-primary/40 hover:bg-muted/35"
                  >
                    <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                      {item.category}
                    </p>
                    <p className="mt-2 text-base font-semibold text-foreground group-hover:text-primary">
                      {item.title}
                    </p>
                    <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                      자세히 보기
                      <ArrowRight className="h-4 w-4" />
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          ) : null}
        </div>
      </main>
    </div>
  )
}
