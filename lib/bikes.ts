export type BikeSpec = {
  chassis: { year: number; model: string }
  engine: string
  discs: string
  partsSourcing: 'handbuilt' | 'england-sourced' | 'mixed'
  handmadeComponents: string[]
}

export type Bike = {
  id: string
  name: string
  tagline: string
  priceAUD: number
  spec: BikeSpec
  photos: { src: string; alt: string }[]
  available: boolean
}

export const bikes: Bike[] = [
  {
    id: 'placeholder-1966-tv200',
    name: '1966 TV 200',
    tagline: 'Placeholder entry. Photos and price to be replaced before launch.',
    priceAUD: 0,
    spec: {
      chassis: { year: 1966, model: 'TV 200' },
      engine: 'Handbuilt 200cc',
      discs: 'Front disc, drum rear',
      partsSourcing: 'handbuilt',
      handmadeComponents: ['Seat', 'Side panels', 'Exhaust'],
    },
    photos: [
      { src: '/bikes/placeholder/hero.jpg', alt: '1966 TV 200, left side profile (placeholder)' },
    ],
    available: true,
  },
]

export function getAvailableBikes(): Bike[] {
  return bikes.filter((b) => b.available)
}

export function getBike(id: string): Bike | undefined {
  return bikes.find((b) => b.id === id)
}
