export class MediaEmbedder {
  static getEmbedCode(url: string, options: { width?: number, height?: number, autoplay?: boolean } = {}): string {
    const { width = '100%', height = '100%', autoplay = false } = options
    let embedCode = ''
    switch (true) {
      case url.includes('youtube.com') || url.includes('youtu.be'):
        embedCode = `<iframe width="${width}" height="${height}" src="https://www.youtube.com/embed/${this.extractYoutubeId(url)}?autoplay=${autoplay ? 1 : 0}" frameborder="0" allowfullscreen></iframe>`
        break
      case url.includes('vimeo.com'):
        embedCode = `<iframe src="https://player.vimeo.com/video/${this.extractVimeoId(url)}?autoplay=${autoplay ? 1 : 0}" width="${width}" height="${height}" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>`
        break
      case url.includes('soundcloud.com'):
        embedCode = `<iframe width="${width}" height="${height}" scrolling="no" frameborder="no" src="https://w.soundcloud.com/player/?url=${url}&color=%23ff5500&auto_play=${autoplay}&hide_related=false&show_comments=true&show_user=true&show_reposts=false&visual=true"></iframe>`
        break
      case url.includes('twitch.tv'):
        embedCode = `<iframe src="https://player.twitch.tv/?channel=${this.extractTwitchId(url)}&parent=example.com&autoplay=${autoplay}" frameborder="0" allowfullscreen="true" scrolling="no" height="${height}" width="${width}"></iframe>`
        break
      case url.includes('dailymotion.com'):
        embedCode = `<iframe frameborder="0" width="${width}" height="${height}" src="https://www.dailymotion.com/embed/video/${this.extractDailymotionId(url)}?autoplay=${autoplay}" allowfullscreen allow="autoplay"></iframe>`
        break
      case url.includes('spotify.com'):
        embedCode = `<iframe src="https://open.spotify.com/embed/track/${this.extractSpotifyId(url)}" width="${width}" height="${height}" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>`
        break
      case url.includes('mixcloud.com'):
        embedCode = `<iframe width="${width}" height="${height}" src="https://www.mixcloud.com/widget/iframe/?hide_cover=1&mini=1&feed=${url}" frameborder="0"></iframe>`
        break
      case url.includes('.mp4'):
        embedCode = `<video width="${width}" height="${height}" controls><source src="${url}" type="video/mp4">Your browser does not support the video tag.</video>`
        break
      case url.includes('.mp3'):
        embedCode = `<audio controls><source src="${url}" type="audio/mpeg">Your browser does not support the audio element.</audio>`
        break
      default:
        embedCode = `<a href="${url}">Download Media</a>`
        break
    }
    return embedCode
  }

  static extractYoutubeId(url: string): string | null {
    const regExp = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^/\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([\w-]{11})/
    const match = url.match(regExp)
    return match ? match[1] : null
  }

  static extractVimeoId(url: string): string | null {
    const regExp = /vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^/]+\/)?|album\/(?:\d+\/video\/)?|video\/)?(\d+)(?:$|\/|\?)/
    const match = url.match(regExp)
    return match ? match[1] : null
  }

  static extractTwitchId(url: string): string | null {
    const regExp = /twitch\.tv\/(\w+)/
    const match = url.match(regExp)
    return match ? match[1] : null
  }

  static extractDailymotionId(url: string): string | null {
    const regExp = /dailymotion\.com\/video\/(\w+)/
    const match = url.match(regExp)
    return match ? match[1] : null
  }

  static extractSpotifyId(url: string): string | null {
    const regExp = /spotify\.com\/track\/(\w+)/
    const match = url.match(regExp)
    return match ? match[1] : null
  }
}
