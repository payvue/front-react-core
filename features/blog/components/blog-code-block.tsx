import Prism from 'prismjs'
import { Highlight, type Language, type PrismTheme } from 'prism-react-renderer'

import 'prismjs/components/prism-java'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-kotlin'
import 'prismjs/components/prism-json'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-tsx'

interface BlogCodeBlockProps {
  code: string
  language: string
  label?: string
  layout?: 'wrap' | 'scroll'
}

const languageAliases: Record<string, Language> = {
  ts: 'typescript',
  tsx: 'tsx',
  js: 'javascript',
  jsx: 'jsx',
  yml: 'yaml',
  sh: 'bash',
}

function resolveLanguage(language: string): Language {
  const normalized = language.trim().toLowerCase()
  if (!normalized) {
    return 'text'
  }

  return languageAliases[normalized] ?? normalized
}

const payvueCodeTheme: PrismTheme = {
  plain: {
    color: '#1f2937',
    backgroundColor: 'transparent',
  },
  styles: [
    {
      types: ['comment', 'prolog', 'doctype', 'cdata'],
      style: { color: '#7b849b', fontStyle: 'italic' },
    },
    {
      types: ['keyword', 'boolean', 'operator'],
      style: { color: '#5f3dc4', fontWeight: '600' },
    },
    {
      types: ['builtin', 'class-name'],
      style: { color: '#1d4ed8' },
    },
    {
      types: ['function'],
      style: { color: '#2563eb' },
    },
    {
      types: ['string', 'char', 'symbol'],
      style: { color: '#0f766e' },
    },
    {
      types: ['number', 'constant'],
      style: { color: '#b45309' },
    },
    {
      types: ['property', 'attr-name', 'parameter'],
      style: { color: '#334155' },
    },
    {
      types: ['punctuation'],
      style: { color: '#64748b' },
    },
    {
      types: ['annotation'],
      style: { color: '#7c3aed' },
    },
    {
      types: ['tag', 'attr-value'],
      style: { color: '#c026d3' },
    },
  ],
}

export function BlogCodeBlock({ code, language, label, layout = 'wrap' }: BlogCodeBlockProps) {
  const resolvedLanguage = resolveLanguage(language)
  const normalizedCode = code.replace(/\s+$/, '')
  const isScrollLayout = layout === 'scroll'

  return (
    <div className="overflow-hidden rounded-xl border border-[#ddd6fe] bg-white">
      <div className="flex items-center justify-between gap-2 border-b border-[#ddd6fe] bg-[#f6f2ff] px-4 py-2 text-xs">
        <span className="font-medium text-foreground/80">{label ?? 'snippet'}</span>
        <span className="rounded-md border border-[#cfc2ff] bg-[#ede7ff] px-2 py-0.5 font-medium uppercase tracking-[0.06em] text-[#5f3dc4]">
          {resolvedLanguage}
        </span>
      </div>

      <Highlight
        prism={Prism}
        theme={payvueCodeTheme}
        code={normalizedCode}
        language={resolvedLanguage}
      >
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre
            className={`${className} px-4 py-3 text-sm leading-6 ${
              isScrollLayout ? 'overflow-x-auto overflow-y-hidden' : ''
            }`}
            style={{ ...style, margin: 0 }}
          >
            <code className={isScrollLayout ? 'inline-block min-w-full' : 'block w-full'}>
              {tokens.map((line, lineIndex) => {
                const lineProps = getLineProps({ line })
                return (
                  <span
                    key={`${resolvedLanguage}-line-${lineIndex + 1}`}
                    {...lineProps}
                    className={`${isScrollLayout ? 'flex w-max items-start' : 'flex items-start'} ${
                      lineProps.className ?? ''
                    }`}
                  >
                    <span className="w-10 shrink-0 select-none pr-3 text-right text-xs leading-6 text-[#98a0b8]">
                      {lineIndex + 1}
                    </span>
                    <span
                      className={
                        isScrollLayout
                          ? 'whitespace-pre pr-2 text-foreground/95'
                          : 'min-w-0 flex-1 whitespace-pre-wrap break-words [overflow-wrap:anywhere] text-foreground/95'
                      }
                    >
                      {line.map((token, tokenIndex) => (
                        <span
                          key={`${resolvedLanguage}-line-${lineIndex + 1}-token-${tokenIndex + 1}`}
                          {...getTokenProps({ token })}
                        />
                      ))}
                      {line.length === 0 ? ' ' : null}
                    </span>
                  </span>
                )
              })}
            </code>
          </pre>
        )}
      </Highlight>
    </div>
  )
}
