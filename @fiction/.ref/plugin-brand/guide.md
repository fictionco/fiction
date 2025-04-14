without making more complicated and maintaining a standard structure to schema, enrich this schema, add .describe clauses to each, make maximally useful to AI tools based on brand strategy, when created give example using Picasso and Dean Stoecker

const BrandItemSchema = z.object({
  value: z.string(),
  description: z.string(),
  examples: z.string(),
})

export const BrandGuideSchemaV2 = z.object({
  archetypes: z.array(BrandItemSchema), // combination of archetypes = avatar
  pillars: z.array(BrandItemSchema), // topics to write about
  communicationStyles: z.array(BrandItemSchema), // examples of writing, speaking, content
  motifs: z.array(BrandItemSchema), // things the refer to as brand e.g. a brand might use ancient history or rap lyrics
  avoid: z.array(BrandItemSchema), // general things to avoid e.g. politics
  visual: z.object({
    primaryColor: z.string(),
  }),
  aiGuidance: z.object({
    website: z.string(),
    email: z.string(),
    content: z.string(),
  }),
})

- help structure an AI personal brand guide Ai tools can use to help with content generation, and content auditing to help people further their goals. Ai will create checklists of things to create in order to achieve goals.
- often a brand guide is more useful if it uses analogues and heuristics. e.g. invite examples of people they want to be like, rather than asking for a list of values.
- look for ways to make the guide easy to answer, and provide maximum information. e.g. give example of writing you like (easy to answer), rather than asking for desired writing style (which is hard to answer)
- It should be oriented towards future state, but don't discuss the future. The answers should represent the future state. The position is the position int he future.
- The guide should be focused on helping people become who they want to be, and helping them understand how to get there. Tony robbins ideas.
- Contrarian beliefs are more interesting than beliefs. "What important truth do only you believe?" - Peter Thiel
- Don't ask idealState as its not useful for content help, better to ask favorite motifs, movies, themes, heuristics, metaphors, songs/genres, etc. all these can be used in content (e.g. ancient greek culture, Nietzsche, etc.)
- In most cases, The guide should use structured information allowing users to select from a list of styles/inputs rather than free form answers (additional context can be added), for example, select archetype from a list, select writing style (ben franklin, etc. )
- The guide should be built on NLP personal power concepts, focusong on helping people become who they want to be, and helping them understand how to get there. Tony robbins ideas.
- known things it needs are archetype, positioning,  pillars, communication style, favorite motifs/themes, weak spots / thing to avoid
- keep it as simple and elegant as possible, aiming to gain a lot of functionality from a few inputs. Minimalist, steve jobs like approach to personal branding.
- If all people want the same thing, its not interesting, e.g. don't ask if people value honesty because everyone does.
- Aim to create a persona that makes enemies as well as friends, not seeking to be liked by everyone.

- create a concise and minimal structure for the brand style guide, make it both intuitive and powerful.
- All inputs should be useable by AI and humans to guide brand activities.
- Avoid cliche, vague or overly complex inputs. Avoid jargon, and vanilla, non-distinctive inputs.

- before answering, consider what guide would be most useful to AI tools
- output the brand guide in a typescript zod schema. Minimize fields and organize elegantly.
- once created an example, explaining how it will be used by ai to generate content

- Use arrays of objects when multiple items are needed. Most fields should allow multiple, for hybrid archetypes, etc. Don't use array of strings, preferring comma separated strings.
- For objects use value (primary value e.g. sage), description (additional details), Example (exemplars, etc)
- Many answers should have a definition and exemplars field
  -  e.g. Archetype: Value: Sage, exemplars: Yoda, Ben Franklin, etc...
  - Content pillar: Value: Computers, Example: MKBHD, Linus Tech Tips, etc...
  - Communication Style: Value: Motivational, exemplars: Tony Robbins, Les Brown, etc...
- enums in camel case
- do not ask for vague open ended answers like brand story, that wont help ai and will be hard for humans to answer.
- don't ask for phrases to avoid, ask for general topics to avoid (e.g. don't discuss politics), better scope and easier to answer
- aim for minimalism, and impressive simplicity. Apple like, steve jobs, tufte, etc.
- rather than multiple properties in an object, prefer more options in a single property
- communication style mostly means style of talking or writing, not the topic. Style: select out of 20 styles, examples: tony robbins, ben franklin, etc...

the guide should be creatable based on answers from these questions:

Future Pacing
- Imagine... it's 3 years from now and you've made every right decision...
  - who are you and what is your life like?
  - A magazine has just published an article celebrating your success. What's the headline?
  - Aside from yourself, whose story does yours most resemble?

Avatar
- Which three people (alive, historical, or fictional) would you combine to create your ideal future self?
- What specifically would you take from each and why?

Style
- Who are 2 or 3 people whose communication style you admire? (writing, speaking, etc.)
- What exactly about their approach would you steal?

Pillars
- Imagine you become a world authority on 3 subjects.
  - What are those subjects?
  - Why do they excite you and serve your goals?
  - Why are you the best person to speak on them?

Audience
- Picture the person you are best suited to help.
  - What are their defining characteristics?
  - What do you find most rewarding about working with them?
  - How might they describe you to others?

# Brand Style Guide
*System guidance: Use this guide to validate content and assist content creation. Each field serves as context for AI assistance and human review.*

## Core Brand Strategy

### Brand Archetype
- Primary Archetype:
 * Input: [Select one: Sage, Hero, Creator, Explorer, Rebel, Magician, Regular Guy/Gal, Lover, Caregiver, Jester, Ruler, Innocent]
 * System guidance: Use archetype to inform tone and narrative style
- Key Characteristics:
 * Input: [3-5 descriptive traits that define your archetype]
 * Format: Comma-separated list
 * Example: "Wise, analytical, objective, truth-seeking"
- Communication Style:
 * Input: [How should this archetype shape content creation?]
 * Format: Brief paragraph
 * Example: "Focus on presenting well-researched information, using data to support claims, maintaining objectivity"

### Mission & Value Proposition
- Purpose Statement:
 * Input: [What is your core purpose?]
 * Length: 1-2 sentences
 * Example: "To empower small businesses through accessible technology solutions"
- Value Proposition:
 * Input: [Your unique offering and its value]
 * Format: Problem → Solution → Benefit
 * Example: "While enterprise software is complex and expensive, we provide simplified tools at SMB-friendly prices"
- Target Audiences:
 * Primary: [Specific description of main audience]
 * Secondary: [Additional audiences]
 * Format: Demographics + Psychographics + Needs
- Audience Pain Points:
 * Input: [List key challenges for each audience]
 * Format: Problem: Impact: Desired Outcome
 * Example: "Limited budget: Can't afford enterprise solutions: Needs affordable alternatives"

### Brand Values & Personality
- Core Values:
 * Input: [List 3-5 core values]
 * Format: Value: Definition: Application
 * Example: "Innovation: Pushing boundaries in technology: Reflected in cutting-edge features"
- Decision Guidelines:
 * Input: [How values guide content decisions]
 * Format: If/Then statements
 * Example: "If content doesn't demonstrate innovation, revise to highlight new approaches"
- Brand Personality:
 * Input: [Key personality traits]
 * Format: Trait: Expression
 * Example: "Innovative: Uses forward-thinking language and examples"

### Voice & Communication
- Tone Range:
 * Format: Slider scale 1-5
 * Formal ←→ Casual
 * Professional ←→ Friendly
 * Technical ←→ Simple
 * Reserved ←→ Enthusiastic
- Writing Approach:
 * Sentence Length: [Short/Medium/Long]
 * Paragraph Style: [Concise/Detailed]
 * Technical Level: [Basic/Intermediate/Advanced]
- Language Guidelines:
 * Preferred Terms: [List approved terminology]
 * Restricted Terms: [List terms to avoid]
 * Format: CSV list with alternatives

## Content Architecture

### Content Pillars
- Primary Themes:
 * Structure: {
     name: string,
     description: string,
     approach: string,
     subtopics: string[],
     audienceAlignment: string[],
     examples: string[]
   }
 * Required fields: name, description, approach
 * Example: {
     name: "Technology Innovation",
     description: "Latest developments in tech",
     approach: "Focus on practical applications",
     subtopics: ["AI", "Cloud", "Mobile"],
     audienceAlignment: ["Tech Leaders", "Developers"],
     examples: ["AI Implementation Guide", "Cloud Migration Case Study"]
   }

### Audience Content Matrix
- Structure: {
   audienceSegment: string,
   painPoints: string[],
   contentThemes: string[],
   preferredFormats: string[],
   engagementTriggers: string[],
   successMetrics: string[]
 }
- Example: {
   audienceSegment: "Small Business Owners",
   painPoints: ["Limited time", "Budget constraints"],
   contentThemes: ["Efficiency", "Cost-saving"],
   preferredFormats: ["Quick guides", "Video tutorials"],
   engagementTriggers: ["ROI stats", "Time-saving tips"],
   successMetrics: ["Implementation rate", "Time saved"]
 }
