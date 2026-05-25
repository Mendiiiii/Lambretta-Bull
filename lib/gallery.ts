export type GalleryBike = {
  id: string
  name: string
  year: number
  description: string
  photo: { src: string; alt: string }
}

export const galleryBikes: GalleryBike[] = [
  {
    id: 'tv200-blue',
    name: 'TV 200',
    year: 1965,
    description: 'Two-tone build on a 1965 TV 200 chassis. Handbuilt engine, custom seat, sourced chrome.',
    photo: { src: '/bikes/gallery/tv200-blue.webp', alt: '1965 Lambretta TV 200, blue and white two-tone' },
  },
  {
    id: 'li-series-blue-white',
    name: 'Li Series',
    year: 1968,
    description: 'Classic Li Series restored to factory spec with period-correct two-tone finish and whitewall tyres.',
    photo: { src: '/bikes/gallery/li-series-blue-white.jpg', alt: 'Lambretta Li Series, blue and white' },
  },
  {
    id: 'li-series-two-tone',
    name: 'Li Series II',
    year: 1966,
    description: 'Li Series restored with handbuilt 185cc engine and fully rebuilt running gear.',
    photo: { src: '/bikes/gallery/li-series-two-tone.jpg', alt: 'Lambretta Li Series, two-tone blue' },
  },
  {
    id: 'gp-italian',
    name: 'GP 200',
    year: 1969,
    description: 'Late GP 200 built for show and road. Handmade side panels, custom exhaust, Italian accessories.',
    photo: { src: '/bikes/gallery/gp-italian.jpg', alt: 'Lambretta GP 200, white with Italian flag accessories' },
  },
]
