export type ConfigOption = {
  id: string
  label: string
  description: string
}

export type ConfiguratorOptions = {
  chassis: ConfigOption[]
  motor: ConfigOption[]
  discos: ConfigOption[]
  sourcing: ConfigOption[]
}

export type ConfigSelections = {
  chassis: string | null
  motor: string | null
  discos: string | null
  sourcing: string | null
}

export const configuratorOptions: ConfiguratorOptions = {
  chassis: [
    { id: '1966-tv200', label: '1966 TV 200', description: 'Placeholder — to be updated with Alfonso\'s data' },
    { id: '1969-li-series-3', label: '1969 Li Series 3', description: 'Placeholder — to be updated with Alfonso\'s data' },
  ],
  motor: [
    { id: 'handbuilt-200cc', label: 'Handbuilt 200cc', description: 'Placeholder — to be updated with Alfonso\'s data' },
    { id: 'handbuilt-185cc', label: 'Handbuilt 185cc', description: 'Placeholder — to be updated with Alfonso\'s data' },
  ],
  discos: [
    { id: 'front-disc-drum-rear', label: 'Front Disc, Drum Rear', description: 'Placeholder — to be updated with Alfonso\'s data' },
    { id: 'drum-both', label: 'Drum Both Ends', description: 'Placeholder — to be updated with Alfonso\'s data' },
  ],
  sourcing: [
    { id: 'handbuilt', label: 'Handbuilt', description: 'Components built by hand in Madrid' },
    { id: 'england-sourced', label: 'England-sourced', description: 'Original parts sourced from England' },
  ],
}

export function getOptionLabel(
  category: keyof ConfiguratorOptions,
  id: string,
): string {
  return configuratorOptions[category].find((o) => o.id === id)?.label ?? id
}
