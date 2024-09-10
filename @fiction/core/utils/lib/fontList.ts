export type FontEntry = {
  family: string
  category: 'sans-serif' | 'serif' | 'display' | 'handwriting' | 'monospace'
  variants: string[]
}

export const fonts: FontEntry[] = [
  {
    family: 'Poppins',
    category: 'sans-serif',
    variants: ['100', '100italic', '200', '200italic', '300', '300italic', 'regular', 'italic', '500', '500italic', '600', '600italic', '700', '700italic', '800', '800italic', '900', '900italic'],
  },
  {
    family: 'DM Mono',
    category: 'monospace',
    variants: ['300', '300italic', 'regular', 'italic', '500', '500italic'],
  },
  {
    family: 'Plus Jakarta Sans',
    category: 'sans-serif',
    variants: ['200', '300', 'regular', '500', '600', '700', '800', '200italic', '300italic', 'italic', '500italic', '600italic', '700italic', '800italic'],
  },
  {
    family: 'Inter',
    category: 'sans-serif',
    variants: ['100', '200', '300', 'regular', '500', '600', '700', '800', '900'],
  },
  {
    family: 'Oswald',
    category: 'sans-serif',
    variants: ['200', '300', 'regular', '500', '600', '700'],
  },
  {
    family: 'Raleway',
    category: 'sans-serif',
    variants: ['100', '200', '300', 'regular', '500', '600', '700', '800', '900', '100italic', '200italic', '300italic', 'italic', '500italic', '600italic', '700italic', '800italic', '900italic'],
  },
  {
    family: 'Playfair Display',
    category: 'serif',
    variants: ['regular', '500', '600', '700', '800', '900', 'italic', '500italic', '600italic', '700italic', '800italic', '900italic'],
  },
  {
    family: 'Ubuntu',
    category: 'sans-serif',
    variants: ['300', '300italic', 'regular', 'italic', '500', '500italic', '700', '700italic'],
  },
  {
    family: 'Roboto',
    category: 'sans-serif',
    variants: ['100', '100italic', '300', '300italic', 'regular', 'italic', '500', '500italic', '700', '700italic', '900', '900italic'],
  },
  {
    family: 'Open Sans',
    category: 'sans-serif',
    variants: ['300', '400', '500', '600', '700', '800', '300italic', '400italic', '500italic', '600italic', '700italic', '800italic'],
  },
  {
    family: 'Caveat',
    category: 'handwriting',
    variants: ['regular', '500', '600', '700'],
  },
  {
    family: 'Merriweather',
    category: 'serif',
    variants: ['300', '300italic', 'regular', 'italic', '700', '700italic', '900', '900italic'],
  },
  {
    family: 'Montserrat',
    category: 'sans-serif',
    variants: ['100', '100italic', '200', '200italic', '300', '300italic', 'regular', 'italic', '500', '500italic', '600', '600italic', '700', '700italic', '800', '800italic', '900', '900italic'],
  },
  {
    family: 'Lora',
    category: 'serif',
    variants: ['regular', 'italic', '500', '500italic', '600', '600italic', '700', '700italic'],
  },
  {
    family: 'Fira Code',
    category: 'monospace',
    variants: ['300', 'regular', '500', '600', '700'],
  },
  {
    family: 'Nunito',
    category: 'sans-serif',
    variants: ['200', '300', 'regular', '500', '600', '700', '800', '900', '200italic', '300italic', 'italic', '500italic', '600italic', '700italic', '800italic', '900italic'],
  },
  {
    family: 'Bebas Neue',
    category: 'display',
    variants: ['regular'],
  },
  {
    family: 'Josefin Sans',
    category: 'sans-serif',
    variants: ['100', '200', '300', 'regular', '500', '600', '700', '100italic', '200italic', '300italic', 'italic', '500italic', '600italic', '700italic'],
  },
  {
    family: 'Bitter',
    category: 'serif',
    variants: ['100', '200', '300', 'regular', '500', '600', '700', '800', '900', '100italic', '200italic', '300italic', 'italic', '500italic', '600italic', '700italic', '800italic', '900italic'],
  },
  {
    family: 'Architects Daughter',
    category: 'handwriting',
    variants: ['regular'],
  },
  {
    family: 'Quicksand',
    category: 'sans-serif',
    variants: ['300', 'regular', '500', '600', '700'],
  },
  {
    family: 'Work Sans',
    category: 'sans-serif',
    variants: ['100', '200', '300', 'regular', '500', '600', '700', '800', '900', '100italic', '200italic', '300italic', 'italic', '500italic', '600italic', '700italic', '800italic', '900italic'],
  },
]
