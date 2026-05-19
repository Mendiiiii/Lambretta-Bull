const ALLOWED_ORIGINS = ['https://www.youtube.com', 'https://player.vimeo.com']

type BuildVideoProps = {
  src: string
}

export function BuildVideo({ src }: BuildVideoProps) {
  if (!src) return null

  let parsed: URL
  try {
    parsed = new URL(src)
  } catch {
    return null
  }

  if (!ALLOWED_ORIGINS.some((o) => parsed.origin === o)) return null

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-sm">
      <iframe
        src={src}
        title="Build process video"
        sandbox="allow-scripts allow-same-origin allow-presentation"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        loading="lazy"
        className="absolute inset-0 w-full h-full"
      />
    </div>
  )
}
