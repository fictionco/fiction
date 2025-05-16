import { z } from 'zod'

export function getArchetypesStyles() {
  return [
    {
      value: 'hero',
      label: 'The Hero',
      subLabel: 'Bold, relentless, action-driven',
      info: 'Write bold, action-driven prose with short, vivid sentences to inspire courage and grit, Ernest Hemingway, Joan Didion, Hunter S. Thompson, David Sedaris',
    },
    {
      value: 'magician',
      label: 'The Magician',
      subLabel: 'Visionary, transformative, poetic',
      info: 'Craft visionary prose with vivid imagery and engaging narratives to shift perspectives, Neil Gaiman, Elizabeth Gilbert, Malcolm Gladwell, Ann Patchett',
    },
    {
      value: 'sovereign',
      label: 'The Sovereign',
      subLabel: 'Authoritative, commanding, polished',
      info: 'Use clear, confident sentences with a warm yet formal tone to convey leadership, James Baldwin, Ta-Nehisi Coates, Zadie Smith, Simon Sinek',
    },
    {
      value: 'lover',
      label: 'The Lover',
      subLabel: 'Passionate, sensory, connective',
      info: 'Write passionate, sensory prose with a conversational tone to forge emotional connections, Cheryl Strayed, David Sedaris, Ann Patchett, Brené Brown',
    },
    {
      value: 'rebel',
      label: 'The Rebel',
      subLabel: 'Defiant, witty, disruptive',
      info: 'Craft witty, defiant prose with sharp metaphors to challenge norms and inspire action, George Orwell, Chuck Palahniuk, Margaret Atwood, Seth Godin',
    },
    {
      value: 'sage',
      label: 'The Sage',
      subLabel: 'Wise, reflective, insightful',
      info: 'Write concise, reflective prose with clear insights to enlighten through calm wisdom, Malcolm Gladwell, Rebecca Solnit, Yuval Noah Harari, David Sedaris',
    },
  ] as const
}

export function getImageStyles() {
  return [
    {
      value: 'americana',
      label: 'Americana',
      subLabel: 'Nostalgic Charm',
      info: 'Nostalgic style with warm lighting and soft textures evoking small-town America, Norman Rockwell, Grant Wood, N.C. Wyeth',
    },
    {
      value: 'minimal',
      label: 'Minimalist',
      subLabel: 'Minimalist Charm',
      info: `Minimalist style with clean lines, simple shapes, and vibrant accent colors inspired by Apple's website design, Piet Mondrian, Kazimir Malevich, Theo van Doesburg`,
    },
    {
      value: 'watercolor',
      label: 'Watercolor',
      subLabel: 'Fluid Serenity',
      info: 'Delicate style with translucent hues and fluid edges for a serene mood, John Singer Sargent, Winslow Homer, Mary Cassatt',
    },
    {
      value: 'oilPainting',
      label: 'Oil Painting',
      subLabel: 'Dramatic Depth',
      info: 'Rich style with dramatic lighting and bold brushstrokes for intense depth, Rembrandt, John Singer Sargent, Caravaggio',
    },
    {
      value: 'sketch',
      label: 'Sketch',
      subLabel: 'Raw Expression',
      info: 'Loose style with expressive lines and minimal shading for introspective rawness, Egon Schiele, Pablo Picasso, Käthe Kollwitz',
    },
    {
      value: 'pencilDrawing',
      label: 'Pencil Drawing',
      subLabel: 'Intricate Precision',
      info: 'Detailed style with intricate cross-hatching and soft gradients for contemplation, Leonardo da Vinci, John Ruskin, Albrecht Dürer',
    },
    {
      value: 'charcoal',
      label: 'Charcoal',
      subLabel: 'Gritty Contrast',
      info: 'Bold style with smudgy textures and stark contrasts for gritty intensity, Käthe Kollwitz, Francis Bacon, John Singer Sargent',
    },
    {
      value: 'inkIllustration',
      label: 'Ink Illustration',
      subLabel: 'Elegant Precision',
      info: 'Crisp style with sharp lines and intricate patterns for elegant clarity, Aubrey Beardsley, Edward Gorey, Maurice Sendak',
    },
    {
      value: 'sciFi',
      label: 'Sci-Fi',
      subLabel: 'Vibrant Futurism',
      info: 'Digital paintings, bright, inspired by sci-fi illustrators on book covers, minimal, Joe Orlando, Bernie Krigstein, Reed Crandall',
    },
    {
      value: 'pixelArt',
      label: 'Pixel Art',
      subLabel: 'Retro Play',
      info: 'Retro style with blocky sprites and vibrant colors for nostalgic playfulness, inspired by early arcade art, Winsor McCay, Max Fleischer',
    },
    {
      value: 'vectorArt',
      label: 'Vector Art',
      subLabel: 'Bold Clarity',
      info: 'Clean style with flat colors and smooth curves for bold impact, Saul Bass, Lester Beall, A.M. Cassandre',
    },
    {
      value: 'cartoon',
      label: 'Cartoon',
      subLabel: 'Whimsical Fun',
      info: 'Playful style with exaggerated features and vibrant outlines for whimsical fun, Chuck Jones, Tex Avery, Max Fleischer',
    },
    {
      value: 'anime',
      label: 'Anime',
      subLabel: 'Emotive Wonder',
      info: 'Dynamic style with expressive characters and lush backgrounds for emotive wonder, inspired by ukiyo-e, Katsushika Hokusai, Tetsujin 28-go illustrators',
    },
    {
      value: 'comicBook',
      label: 'Comic Book',
      subLabel: 'Heroic Drama',
      info: 'Bold style with thick inks and dramatic angles for heroic intensity, Inspired by 1960s comic books. Jack Kirby.',
    },
    {
      value: 'popArt',
      label: 'Pop Art',
      subLabel: 'Ironic Vibrance',
      info: 'Vibrant style with bold outlines and commercial motifs for ironic commentary, Andy Warhol, Roy Lichtenstein, Claes Oldenburg',
    },
    {
      value: 'surrealism',
      label: 'Surrealism',
      subLabel: 'Dreamlike Chaos',
      info: 'Dreamlike style with warped forms and eerie lighting for unsettling chaos, Salvador Dalí, Max Ernst, René Magritte',
    },
    {
      value: 'impressionism',
      label: 'Impressionism',
      subLabel: 'Joyful Light',
      info: 'Fleeting style with loose brushstrokes and vibrant light for joyful moments, Claude Monet, Pierre-Auguste Renoir, Mary Cassatt',
    },
    {
      value: 'realism',
      label: 'Realism',
      subLabel: 'Lifelike Detail',
      info: 'Meticulous style with lifelike detail and natural lighting for grounded realism, John Singer Sargent, Norman Rockwell, Edward Hopper',
    },
    {
      value: 'photorealism',
      label: 'Photorealism',
      subLabel: 'Hyper-Accurate',
      info: 'Ultra-detailed style with hyper-accurate textures and crisp lighting for clinical precision, Chuck Close, Ralph Goings, Richard Estes',
    },
    {
      value: 'minimalist',
      label: 'Minimalist',
      subLabel: 'Calm Simplicity',
      info: 'Stark style with simple shapes and clean lines for calm simplicity, Kazimir Malevich, Piet Mondrian, Agnes Martin',
    },
    {
      value: 'abstract',
      label: 'Abstract',
      subLabel: 'Expressive Rhythm',
      info: 'Bold style with vibrant shapes and rhythmic patterns for expressive emotion, Wassily Kandinsky, Jackson Pollock, Mark Rothko',
    },
    {
      value: 'artNouveau',
      label: 'Art Nouveau',
      subLabel: 'Romantic Elegance',
      info: 'Ornate style with flowing lines and floral motifs for romantic elegance, Alphonse Mucha, Gustav Klimt, Louis Comfort Tiffany',
    },
    {
      value: 'artDeco',
      label: 'Art Deco',
      subLabel: 'Glamorous Geometry',
      info: 'Luxurious style with geometric forms and symmetry, Erte Tirtoff',
    },
    {
      value: 'gothic',
      label: 'Gothic',
      subLabel: 'Melancholic Shadows',
      info: 'Moody style with intricate details and shadowy lighting for melancholic depth, Edward Gorey, Aubrey Beardsley, Gustave Doré',
    },
    {
      value: 'steampunk',
      label: 'Steampunk',
      subLabel: 'Retro Adventure',
      info: 'Retro-futuristic style with industrial textures and brass tones for adventurous grit, H.G. Wells, Jules Verne, Albert Robida',
    },
    {
      value: 'cyberpunk',
      label: 'Cyberpunk',
      subLabel: 'Neon Dystopia',
      info: 'Neon-lit style with gritty textures and glowing accents for dystopian energy, inspired by sci-fi pulp art, Frank R. Paul, H.R. Giger',
    },
    {
      value: 'flatDesign',
      label: 'Flat Design',
      subLabel: 'Modern Simplicity',
      info: 'Modern style with bold colors and minimal shadows for approachable clarity, Massimo Vignelli, Dieter Rams, Bauhaus designers',
    },
    {
      value: 'lowPoly',
      label: 'Low Poly',
      subLabel: 'Geometric Futurism',
      info: 'Geometric style with faceted shapes and soft gradients for futuristic structure, inspired by cubism, Pablo Picasso, Georges Braque',
    },
    {
      value: 'graffiti',
      label: 'Graffiti',
      subLabel: 'Urban Rebellion',
      info: 'Urban style with bold stencils and dripping textures for rebellious expression, inspired by street art, Diego Rivera, José Clemente Orozco',
    },
    {
      value: 'vintagePoster',
      label: 'Vintage Poster',
      subLabel: 'Retro Nostalgia',
      info: 'Retro style with bold typography and faded textures for nostalgic charm, WPA artists, Norman Rockwell, J. Howard Miller',
    },
    {
      value: 'woodcut',
      label: 'Woodcut',
      subLabel: 'Rustic Force',
      info: 'Bold style with carved textures and stark contrasts for rustic strength, Albrecht Dürer, Emil Nolde, Rockwell Kent',
    },
  ] as const
}

const archetypeKeys = getArchetypesStyles().map(item => item.value)
const imageStyleKeys = getImageStyles().map(item => item.value)

export const ArchetypeKeySchema = z.enum([archetypeKeys[0], ...archetypeKeys.slice(1)])
export const ImageStyleKeySchema = z.enum([imageStyleKeys[0], ...imageStyleKeys.slice(1)])

export type ArchetypeKey = z.infer<typeof ArchetypeKeySchema>
export type ImageStyleKey = z.infer<typeof ImageStyleKeySchema>
