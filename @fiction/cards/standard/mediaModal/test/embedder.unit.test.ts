import { describe, expect, it } from 'vitest'
import { MediaEmbedder } from '../mediaEmbedder.js' // Adjust the import path as needed

describe('mediaEmbedder', () => {
  it('should generate correct YouTube embed code', () => {
    const url = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
    const embedCode = MediaEmbedder.getEmbedCode(url, { width: 640, height: 360, autoplay: true })
    expect(embedCode).toBe('<iframe width="640" height="360" src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1" frameborder="0" allowfullscreen></iframe>')
  })

  it('should generate correct Vimeo embed code', () => {
    const url = 'https://vimeo.com/123456789'
    const embedCode = MediaEmbedder.getEmbedCode(url, { width: 640, height: 360, autoplay: true })
    expect(embedCode).toBe('<iframe src="https://player.vimeo.com/video/123456789?autoplay=1" width="640" height="360" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>')
  })

  it('should generate correct SoundCloud embed code', () => {
    const url = 'https://soundcloud.com/artist/song'
    const embedCode = MediaEmbedder.getEmbedCode(url, { width: 640, height: 360, autoplay: true })
    expect(embedCode).toBe('<iframe width="640" height="360" scrolling="no" frameborder="no" src="https://w.soundcloud.com/player/?url=https://soundcloud.com/artist/song&color=%23ff5500&auto_play=true&hide_related=false&show_comments=true&show_user=true&show_reposts=false&visual=true"></iframe>')
  })

  it('should generate correct Twitch embed code', () => {
    const url = 'https://www.twitch.tv/streamer'
    const embedCode = MediaEmbedder.getEmbedCode(url, { width: 640, height: 360, autoplay: true })
    expect(embedCode).toBe('<iframe src="https://player.twitch.tv/?channel=streamer&parent=example.com&autoplay=true" frameborder="0" allowfullscreen="true" scrolling="no" height="360" width="640"></iframe>')
  })

  it('should generate correct Dailymotion embed code', () => {
    const url = 'https://www.dailymotion.com/video/x7xyz'
    const embedCode = MediaEmbedder.getEmbedCode(url, { width: 640, height: 360, autoplay: true })
    expect(embedCode).toBe('<iframe frameborder="0" width="640" height="360" src="https://www.dailymotion.com/embed/video/x7xyz?autoplay=true" allowfullscreen allow="autoplay"></iframe>')
  })

  it('should generate correct Spotify embed code', () => {
    const url = 'https://open.spotify.com/track/6rqhFgbbKwnb9MLmUQDhG6'
    const embedCode = MediaEmbedder.getEmbedCode(url, { width: 640, height: 360 })
    expect(embedCode).toBe('<iframe src="https://open.spotify.com/embed/track/6rqhFgbbKwnb9MLmUQDhG6" width="640" height="360" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>')
  })

  it('should generate correct Mixcloud embed code', () => {
    const url = 'https://www.mixcloud.com/dj/set'
    const embedCode = MediaEmbedder.getEmbedCode(url, { width: 640, height: 360 })
    expect(embedCode).toBe('<iframe width="640" height="360" src="https://www.mixcloud.com/widget/iframe/?hide_cover=1&mini=1&feed=https://www.mixcloud.com/dj/set" frameborder="0"></iframe>')
  })

  it('should generate correct MP4 embed code', () => {
    const url = 'https://example.com/video.mp4'
    const embedCode = MediaEmbedder.getEmbedCode(url, { width: 640, height: 360 })
    expect(embedCode).toBe('<video width="640" height="360" controls><source src="https://example.com/video.mp4" type="video/mp4">Your browser does not support the video tag.</video>')
  })

  it('should generate correct MP3 embed code', () => {
    const url = 'https://example.com/audio.mp3'
    const embedCode = MediaEmbedder.getEmbedCode(url, { width: 640, height: 360 })
    expect(embedCode).toBe('<audio controls><source src="https://example.com/audio.mp3" type="audio/mpeg">Your browser does not support the audio element.</audio>')
  })

  it('should generate correct fallback link', () => {
    const url = 'https://example.com/file.pdf'
    const embedCode = MediaEmbedder.getEmbedCode(url, { width: 640, height: 360 })
    expect(embedCode).toBe('<a href="https://example.com/file.pdf">Download Media</a>')
  })
})
