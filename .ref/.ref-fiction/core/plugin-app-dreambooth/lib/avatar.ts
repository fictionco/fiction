// @unocss-include
import type { Prompt } from '../types'

export const prompts: Prompt[] = [
  {
    value: 'cybernetic',
    name: 'Cybernetic',
    renderConfig: {
      prompt:
        'beautiful, young [c], cybernetic, cyberpunk, detailed gorgeous face, flowing hair, vaporwave aesthetic, synthwave , digital painting, artstation, concept art, smooth, sharp focus, illustration, art by artgerm and greg rutkowski and alphonse mucha',
      negativePrompt: 'ugly, old, sad, grey',
      guidanceScale: 9,
      numInferenceSteps: 100,
    },
    category: 'art',
    type: 'avatar',
    images: [
      'https://raw.githubusercontent.com/supereon/data/main/prompts/bladeRunner.webp',
    ],
  },
  {
    value: 'f1',
    name: 'F1 Driver',
    renderConfig: {
      prompt:
        'greg manchess portrait painting of attractive [c], f1 driver as overwatch character, black clothes, medium shot, asymmetrical, profile picture, organic painting, sunny day, matte painting, bold shapes, hard edges, street art, trending on artstation, by huang guangjian and gil elvgren and sachin teng',
      negativePrompt: 'ugly, old, sad, grey',
      guidanceScale: 9,
      numInferenceSteps: 100,
    },
    category: 'art',
    type: 'avatar',
    images: [
      'https://raw.githubusercontent.com/supereon/data/main/prompts/bladeRunner.webp',
    ],
  },
  {
    value: 'gta',
    name: 'Grand Theft Auto',
    renderConfig: {
      prompt:
        'sexy [c] in gta vice city art, grand theft auto cover art,  gta 5 cover art, borderlands style, cel shading, symmetric highly detailed eyes, better call saul, 8 k, animated, aesthetic ',
      negativePrompt:
        'ugly, tiling, poorly drawn hands, out of frame, disfigured, deformed, cut off, low contrast, blurry, grainy',
      guidanceScale: 8.5,
      numInferenceSteps: 120,
    },
    category: 'art',
    type: 'avatar',
  },
  {
    value: 'wildWest',
    name: 'Wild West',
    renderConfig: {
      prompt:
        'portrait of attractive [c]! in ismail inceoglu epic painting of wild west book cover, red canyon, line art, ink, art concept for a book cover!!, red dead redemption, warm colours. oil painting, highly detailed, centered, hyperrealism, romantic, concept art, smooth, sharp focus trending on artstation, by greg manchess and by craig mullins and by kilian eng and by jake parker',
      negativePrompt:
        'ugly, tiling, poorly drawn hands, out of frame, disfigured, deformed, cut off, low contrast, blurry, grainy',
      guidanceScale: 7,
      numInferenceSteps: 100,
    },
    category: 'art',
    type: 'avatar',
    images: [
      'https://raw.githubusercontent.com/supereon/data/main/prompts/bladeRunner.webp',
    ],
  },
  {
    value: 'sorcerer',
    name: 'Medieval Wizard',
    renderConfig: {
      prompt:
        'detailed portrait of dark, attractive [c] as a medieval wizard with long hair, digital painting, fantasy, surrealist, by alphonse mucha, greg rutkowski, artstation, highly detailed, sharp focus, iridescent gold, detailed lines, 8 k',
      negativePrompt:
        'ugly, tiling, poorly drawn hands, out of frame, disfigured, deformed, cut off, low contrast, blurry, grainy',
      guidanceScale: 9,
      numInferenceSteps: 100,
    },
    category: 'art',
    type: 'avatar',
    images: [
      'https://raw.githubusercontent.com/supereon/data/main/prompts/bladeRunner.webp',
    ],
  },
  {
    value: 'superhero',
    name: 'Superhero',
    renderConfig: {
      prompt:
        'portrait of beautiful, attractive, superhero [c] in marvel universe, mcu, 4k, hdr, high detailed, stunning, marvel, is dressed as a superhero. Clean elegant painting, beautiful detailed face. By Artgerm and Greg Rutkowski and Alphonse Mucha',
      negativePrompt:
        'wrinkles, poster, bad drawn, simple, low details, low quality, bad taste, bad style, boring, comic, drawing, flat, low res, animated, ugly',
      guidanceScale: 12,
      numInferenceSteps: 100,
    },
    category: 'movie',
    type: 'avatar',
    images: [
      'https://raw.githubusercontent.com/supereon/data/main/prompts/bladeRunner.webp',
    ],
  },
  {
    value: 'brightPainting',
    name: 'Bright Painting',
    renderConfig: {
      prompt:
        'greg manchess portrait painting of beautiful young [c], harry potter as overwatch character, medium shot, asymmetrical, profile picture, organic painting, sunny day, matte painting, bold shapes, hard edges, street art, trending on artstation, by huang guangjian and gil elvgren and sachin teng',
      negativePrompt: 'ugly, old, sad, grey',
      guidanceScale: 12,
      numInferenceSteps: 130,
    },
    category: 'art',
    type: 'avatar',
    images: [
      'https://raw.githubusercontent.com/supereon/data/main/prompts/bladeRunner.webp',
    ],
  },
  {
    value: 'bladeRunner',
    name: 'Blade Runner',
    renderConfig: {
      prompt:
        'detailed portrait of Young [c] Storm Rain movie Jacket coat, Futuristic sci-fi fashion, royal attire by ismail inceoglu dragan bibin hans thoma greg rutkowski, Alexandros Pyromallis Nekro Rene Margitte illustrated Perfect face, sharp chine, fine details, realistic shaded, fine-face, pretty face cyberpunk, neotokyo, synthwave, aesthetics, futuristic, low-emission-neon, bladerunner movie scene',
      negativePrompt: 'ugly, old, antique, vintage, retro',
      guidanceScale: 12,
      numInferenceSteps: 130,
    },
    category: 'cyberpunk',
    type: 'avatar',
    images: [
      'https://raw.githubusercontent.com/supereon/data/main/prompts/bladeRunner.webp',
    ],
  },
  {
    value: 'epicWarrior',
    name: 'Epic Warrior',
    renderConfig: {
      prompt:
        'epic photo of a good looking [c] warrior, leds, intricate, elegant, highly detailed, digital painting, artstation, concept art, smooth, sharp focus, illustration, art by artgerm and greg rutkowski and alphonse mucha, 8 k',
      negativePrompt: 'ugly',
      guidanceScale: 12,
      numInferenceSteps: 130,
    },
    category: 'art',
    type: 'avatar',
    images: [
      'https://raw.githubusercontent.com/supereon/data/main/prompts/epicWarrior.png',
    ],
  },
  {
    value: 'digitalPainting',
    name: 'Digital Painting',
    renderConfig: {
      prompt:
        'photo of a beautiful [c], leds, intricate, elegant, highly detailed, digital painting, artstation, concept art, smooth, sharp focus, illustration, art by artgerm and greg rutkowski and alphonse mucha, 8 k',
      negativePrompt: 'ugly',
      guidanceScale: 12,
      numInferenceSteps: 130,
    },
    category: 'art',
    type: 'avatar',
    images: [
      'https://raw.githubusercontent.com/supereon/data/main/prompts/digitalPainting.png',
    ],
  },

  {
    value: 'alien',
    name: 'Alien (1986)',
    renderConfig: {
      prompt:
        'cinematic still of a beautiful [c] in the movie Aliens (1986), in a spaceship, handsome, zeiss lens, detailed, symmetrical, centered, fashion photoshoot, breathtaking, extremely detailed, award winning photo, hyperrealistic',
      negativePrompt:
        'wrinkles, photoshop, render, video game, 3d, painting, art, drawing, digital art, cartoon, old',
      guidanceScale: 9,
      numInferenceSteps: 130,
    },
    category: 'movie',
    type: 'avatar',
    images: [
      'https://raw.githubusercontent.com/supereon/data/main/prompts/aliens.webp',
    ],
  },

  {
    value: 'warrior',
    name: 'Tribe Warrior',
    renderConfig: {
      prompt: `detailed portrait of a beautiful [c] warrior, decorated with patterns, leds, assassin's creed, horizon zero dawn machine, intricate, elegant, highly detailed, digital painting, artstation, concept art, smooth, sharp focus, illustration, art by artgerm and greg rutkowski and alphonse mucha, 8 k `,
      negativePrompt:
        'ugly, busy, crowded, messy, dirty, old, antique, vintage, retro, 80s, 90s, 70s, 60s',
      guidanceScale: 13,
      numInferenceSteps: 80,
    },
    category: 'art',
    type: 'avatar',
    images: [
      'https://raw.githubusercontent.com/supereon/data/main/prompts/tribalWarrior.webp',
    ],
  },
  {
    value: 'barbarian',
    name: 'Conan the Barbarian',
    renderConfig: {
      prompt: `epic photo of a good looking [c] as conan the barbarian, dragons and swords, intricate, elegant, highly detailed, digital painting, artstation, concept art, smooth, sharp focus, illustration, art by artgerm and greg rutkowski and alphonse mucha, 8 k`,
      negativePrompt:
        'ugly, busy, crowded, messy, dirty, old, antique, vintage, retro, 80s, 90s, 70s, 60s',
      guidanceScale: 13,
      numInferenceSteps: 80,
    },
    category: 'art',
    type: 'avatar',
    images: [
      'https://raw.githubusercontent.com/supereon/data/main/prompts/tribalWarrior.webp',
    ],
  },
]
