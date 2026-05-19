import { describe, it, expect } from 'vitest'
import { BuildVideo } from '@/components/build-video'

describe('BuildVideo', () => {
  it('returns null when src is an empty string', () => {
    expect(BuildVideo({ src: '' })).toBeNull()
  })

  it('returns a JSX element when src is a non-empty URL', () => {
    const result = BuildVideo({ src: 'https://www.youtube.com/embed/abc123' })
    expect(result).not.toBeNull()
  })

  it('renders a div wrapper with aspect-video class when src is set', () => {
    const result = BuildVideo({ src: 'https://www.youtube.com/embed/abc123' }) as { type: string; props: { className?: string } }
    expect(result.type).toBe('div')
    expect(result.props.className).toContain('aspect-video')
  })

  it('renders an iframe child with the given src, lazy loading, and accessible title', () => {
    const result = BuildVideo({ src: 'https://www.youtube.com/embed/abc123' }) as {
      type: string
      props: { children: { type: string; props: { src: string; title: string; loading: string } } }
    }
    const iframe = result.props.children
    expect(iframe.type).toBe('iframe')
    expect(iframe.props.src).toBe('https://www.youtube.com/embed/abc123')
    expect(iframe.props.loading).toBe('lazy')
    expect(iframe.props.title).toBe('Build process video')
  })
})
