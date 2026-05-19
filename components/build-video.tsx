type BuildVideoProps = {
  src: string
}

export function BuildVideo({ src }: BuildVideoProps) {
  if (!src) return null

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-sm">
      <iframe
        src={src}
        title="Build process video"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        loading="lazy"
        className="absolute inset-0 w-full h-full"
      />
    </div>
  )
}
