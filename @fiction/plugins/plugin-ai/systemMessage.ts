import type { AiCompletionSettings, CommandMessage } from './endpoint.js'
import { z } from 'zod'
import zodToJsonSchema from 'zod-to-json-schema'

type Objectives = Record<string, string>

type FormatGuidelines = {
  guidelines: string
  outputFormat: Record<string, unknown>
}

export class ContentCommand {
  public getMessages(args: AiCompletionSettings): CommandMessage[] {
    const { format, referenceInfo, runPrompt } = args

    let formatGuidelines: FormatGuidelines

    switch (format) {
      case 'websiteCopy':
        formatGuidelines = this.getWebsiteCopyGuidelines(args)
        break
      case 'contentAutocomplete':
        formatGuidelines = this.getAutocompleteGuidelines(args)
        break
      default:
        throw new Error(`Unsupported system message format: ${format}`)
    }

    const messages: CommandMessage[] = [
      {
        role: 'system',
        content: `<system_message>follow these orders EXACTLY and return ONLY JSON based on inputs provided: ${formatGuidelines.guidelines}</system_message>`,
      },
      {
        role: 'system',
        content: `<output_format>Generate ONLY JSON that conforms to the following schema: ${JSON.stringify(formatGuidelines.outputFormat)}. Ensure the response is structured according to this schema.</output_format>`,
      },
    ]

    if (referenceInfo)
      messages.push({ role: 'system', content: `<reference_info>applicable reference material: ${referenceInfo}</reference_info>` })

    if (runPrompt)
      messages.push({ role: 'user', content: runPrompt })

    return messages
  }

  private getWebsiteCopyGuidelines(args: AiCompletionSettings & { format: 'websiteCopy' }): FormatGuidelines {
    const { objectives, outputFormat } = args

    return {
      outputFormat,
      guidelines: `
  <role>
    You are an expert AI copywriter, marketer, and web designer tasked with creating persuasive website content. Your goal is to craft compelling, customer-centric copy using neurolinguistic programming principles to address user pain points and present effective solutions.
  </role>

  <output_format>
    Generate ONLY JSON content strictly adhering to the provided schema. Nothing besides JSON should be returned.
    For arrays, create 1 to 3 entries unless otherwise specified.
    Ensure all required fields are populated with appropriate, context-relevant content.
  </output_format>

  <content_guidelines>
    <tone_and_voice>
      <guideline>Adopt a professional yet approachable tone that builds trust and credibility.</guideline>
      <guideline>Use clear, concise language that resonates with the target audience.</guideline>
      <guideline>Balance authority with empathy to connect with readers on an emotional level.</guideline>
    </tone_and_voice>

    <structure_and_style>
      <guideline>Create elegant, concise content without redundancy or excessive exclamations.</guideline>
      <guideline>Use analogies, metaphors, and similes to enrich descriptions and engage readers.</guideline>
      <guideline>Craft headlines and subheadings that are both informative and attention-grabbing.</guideline>
    </structure_and_style>

    <persuasion_techniques>
      <guideline>Employ neurolinguistic programming to help users visualize their problems and imagine solutions.</guideline>
      <guideline>Focus on the target customer's pain points where the provider can offer solutions.</guideline>
      <guideline>Use "you" and "your" to address the reader directly; avoid "our", "I", "us", or "me".</guideline>
      <guideline>Incorporate "because" to strengthen persuasive arguments.</guideline>
    </persuasion_techniques>

    <seo_optimization>
      <guideline>Naturally incorporate relevant keywords without compromising readability.</guideline>
      <guideline>Create SEO-friendly meta descriptions and title tags when required by the schema.</guideline>
      <guideline>Use header tags (H1, H2, H3) appropriately to structure content for both users and search engines.</guideline>
    </seo_optimization>

    <constraints>
      <guideline>Avoid clichés, cheesy language, or overly sales-oriented content.</guideline>
      <guideline>Do not reuse the name of the site subject in the content unless absolutely necessary.</guideline>
      <guideline>Refrain from making unsubstantiated claims or promises.</guideline>
    </constraints>

     ${this.getObjectivesInstruction(objectives)}
  </content_guidelines>

   ${this.IMAGE_INSTRUCTION}
  `,
    }
  }

  private getAutocompleteGuidelines(args: AiCompletionSettings & { format: 'contentAutocomplete' }): FormatGuidelines {
    const { objectives } = args

    return {
      outputFormat: zodToJsonSchema(z.object({
        suggestion1: z.string().min(3).max(200),
      })),
      guidelines: `<autocomplete_assistant>
  <role>Genius creative writing assistant generating bold and engaging autocomplete suggestions</role>
  <output_format>
    <content>only JSON following the provided schema</content>
    <grammar>Use precise and advanced punctuation</grammar>
    <completeness>Provide full sentences or complete unfinished thoughts</completeness>
    <length>3-40 words, based on context</length>
    <spacing>Include trailing space if needed</spacing>
    <uniqueness>Avoid repeating nearby text</uniqueness>
    <organize>Rank the best suggestions first</organize>
  </output_format>
  <writing_guidelines>
    <style>Sprinkle inventive, with vivid and unexpected noun choices</style>
    <relevance>Align with the context</relevance>
    <integration>Ensure it fits the writing objective</integration>
    <creativity>
     <style>Avoid flowery language, be concise as possible</style>
      <angles>Suggest imaginative and playful perspectives</angles>
      <language>Favor uncommon, striking words and surprising references</language>
      <originality>Avoid cliche. Use fresh metaphors, analogies, and references—think literary, historical, or obscure pop culture</originality>
    </creativity>
    <structure>
      <nouns>Prefer interesting nouns, use active voice</nouns>
      <verbs>Don't use flowery verbs, use common ones.</verbs>
      <tone>Match the content's tone, avoid overly describe or elaborate</tone>
      <continuations>Provide varied, intelligent options, often with a twist</continuations>
    </structure>
    <depth>
      <emotive>Employ emotive and visual concepts if relevant</emotive>
      <target>Assess at target reader and direct content at their concerns</target>
      <expertise>Add insightful, expert-level input</expertise>
      <rhetoric>Weave in clever, original metaphors or analogies that surprise the reader</rhetoric>
      <evidence>Reference studies, data or research if relevant</evidence>
    </depth>
  </writing_guidelines>
  <objectives>${this.getObjectivesInstruction(objectives)}</objectives>
</autocomplete_assistant>`,
    }
  }

  private readonly IMAGE_INSTRUCTION = `
  <image_guidelines>
    <guideline>Image style should not affect text content.</guideline>
    <guideline>For image URLs, use shortcodes in the following format:
      [stock_img search="image_prompt" orientation="(portrait, landscape, or squarish)" subject="(person, object)" description="(JSON schema field description)"]
    </guideline>
    <guideline>Replace "image_prompt" with a 3-10 word image generation prompt designed to create a contextual image in the specified style.</guideline>
    <guideline>Set the description attribute to the schema description for the schema parent group and the field itself, preferring more specific descriptions.</guideline>
  </image_guidelines>`

  private getObjectivesInstruction(objectives: Objectives): string {
    const os = Object.entries(objectives)
      .map(([key, value]) => `<objective>${key}:${value}</objective>`)
      .join('\n')

    return `<topic_guidelines>${os}</topic_guidelines>`
  }
}

export const contentCommandUtil = new ContentCommand()
