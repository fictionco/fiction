export class Document {
  pageContent: string
  metadata: Record<string, unknown>
  constructor(fields: Partial<Document>) {
    this.pageContent = fields.pageContent || ''
    this.metadata = fields.metadata || {}
  }
}

export interface TextSplitterParams {
  chunkSize: number

  chunkOverlap: number
}

export class TextSplitter {
  chunkSize = 1000

  chunkOverlap = 200
  separators: string[] = ['\n\n', '\n', ' ', '']

  constructor(fields?: Partial<TextSplitterParams>) {
    this.chunkSize = fields?.chunkSize ?? this.chunkSize
    this.chunkOverlap = fields?.chunkOverlap ?? this.chunkOverlap
    if (this.chunkOverlap >= this.chunkSize)
      throw new Error('Cannot have chunkOverlap >= chunkSize')
  }

  async splitText(text: string): Promise<string[]> {
    const finalChunks: string[] = []

    // Get appropriate separator to use
    let separator: string = this.separators.at(-1) as string
    for (const s of this.separators) {
      if (s === '') {
        separator = s
        break
      }
      if (text.includes(s)) {
        separator = s
        break
      }
    }

    // Now that we have the separator, split the text
    let splits: string[]
    if (separator)
      splits = text.split(separator)
    else
      splits = text.split(' ')

    // Now go merging things, recursively splitting longer texts.
    let goodSplits: string[] = []
    for (const s of splits) {
      if (s.length < this.chunkSize) {
        goodSplits.push(s)
      }
      else {
        if (goodSplits.length) {
          const mergedText = this.mergeSplits(goodSplits, separator)
          finalChunks.push(...mergedText)
          goodSplits = []
        }
        const otherInfo = await this.splitText(s)
        finalChunks.push(...otherInfo)
      }
    }
    if (goodSplits.length) {
      const mergedText = this.mergeSplits(goodSplits, separator)
      finalChunks.push(...mergedText)
    }
    return finalChunks
  }

  async createDocuments(
    texts: string[],
    metadatas: Record<string, any>[] = [],
  ): Promise<Document[]> {
    const _metadatas
      = metadatas.length > 0
        ? metadatas
        : (Array.from({ length: texts.length }).fill({}) as Record<
            string,
            any
          >[])
    const documents = new Array<Document>()
    for (const [i, text] of texts.entries()) {
      let lineCounterIndex = 1
      let prevChunk = null
      for (const chunk of await this.splitText(text)) {
        // we need to count the \n that are in the text before getting removed by the splitting
        let numberOfIntermediateNewLines = 0
        if (prevChunk) {
          const indexChunk = text.indexOf(chunk)
          const indexEndPrevChunk = text.indexOf(prevChunk) + prevChunk.length
          const removedNewlinesFromSplittingText = text.slice(
            indexEndPrevChunk,
            indexChunk,
          )
          numberOfIntermediateNewLines = (
            removedNewlinesFromSplittingText.match(/\n/g) || []
          ).length
        }
        lineCounterIndex += numberOfIntermediateNewLines
        const newLinesCount = (chunk.match(/\n/g) || []).length

        const loc
          = _metadatas[i].loc && typeof _metadatas[i].loc === 'object'
            ? { ..._metadatas[i].loc }
            : {}
        loc.lines = {
          from: lineCounterIndex,
          to: lineCounterIndex + newLinesCount,
        }
        const metadataWithLinesNumber = {
          ..._metadatas[i],
          loc,
        }
        documents.push(
          new Document({
            pageContent: chunk,
            metadata: metadataWithLinesNumber,
          }),
        )
        lineCounterIndex += newLinesCount
        prevChunk = chunk
      }
    }
    return documents
  }

  async splitDocuments(documents: Document[]): Promise<Document[]> {
    const selectedDocuments = documents.filter(doc => doc.pageContent !== undefined)
    const texts = selectedDocuments.map(doc => doc.pageContent)
    const metadatas = selectedDocuments.map(doc => doc.metadata)
    return this.createDocuments(texts, metadatas)
  }

  private joinDocs(docs: string[], separator: string): string | null {
    const text = docs.join(separator).trim()
    return text === '' ? null : text
  }

  mergeSplits(splits: string[], separator: string): string[] {
    const docs: string[] = []
    const currentDoc: string[] = []
    let total = 0
    for (const d of splits) {
      const _len = d.length
      if (total + _len >= this.chunkSize) {
        if (total > this.chunkSize) {
          console.warn(
            `Created a chunk of size ${total}, +
which is longer than the specified ${this.chunkSize}`,
          )
        }
        if (currentDoc.length > 0) {
          const doc = this.joinDocs(currentDoc, separator)
          if (doc !== null)
            docs.push(doc)

          // Keep on popping if:
          // - we have a larger chunk than in the chunk overlap
          // - or if we still have any chunks and the length is long
          while (
            total > this.chunkOverlap
            || (total + _len > this.chunkSize && total > 0)
          ) {
            total -= currentDoc[0].length
            currentDoc.shift()
          }
        }
      }
      currentDoc.push(d)
      total += _len
    }
    const doc = this.joinDocs(currentDoc, separator)
    if (doc !== null)
      docs.push(doc)

    return docs
  }
}
