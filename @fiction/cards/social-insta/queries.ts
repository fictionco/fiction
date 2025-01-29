// queries.ts
import type { EndpointMeta, EndpointResponse } from '@fiction/core'
import type { CardQuerySettings } from '@fiction/site/cardQuery'
import { abort } from '@fiction/core'
import { CardQuery } from '@fiction/site/cardQuery'

type InstagramPost = {
  id: string
  mediaUrl: string
  caption?: string
  mediaType: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM'
  timestamp: string
  likeCount?: number
  commentCount?: number
  permalink: string
}

type InstagramProfile = {
  username: string
  profilePictureUrl: string
  followersCount: number
  mediaCount: number
  biography?: string
}

type InstagramQueryParams = {
  handle: string
  limit?: number
}

type InstagramResponse = {
  profile: InstagramProfile
  posts: InstagramPost[]
}

class InstagramQuery extends CardQuery {
  async getInstagramToken(orgId: string): Promise<string> {
    const { fictionUser } = this.settings
    const result = await fictionUser?.requests.ManageOrganization.request({
      _action: 'retrieve',
      where: { orgId },
    })

    if (!result?.data) {
      throw abort('Instagram access token not found')
    }

    return 'IGQWRNam9pelhzNDdmalZAXWVRlbFZA4N0Qta1E1NTctQWdOWE5jMFpOT2tHNUhXWFczMDkyV0FLbVlRRERreE81TmY3R3YxMVg4SXZAaWEFLdEh3akhWYThXWVFZANUZA4dmhCbjNZANTZAhTXd2Sm1rOTdJbVlwUkhaaW8ZD'

    // return result.data.accessTokens?.instagram || ''
  }

  async fetchInstagramData(token: string, handle: string, limit: number): Promise<InstagramResponse> {
    try {
      const baseUrl = 'https://graph.instagram.com'

      // First get the user ID from the username
      const userResponse = await fetch(`${baseUrl}/me?fields=id,username,profile_picture_url,followers_count,media_count,biography&access_token=${token}`)
      const profile = await userResponse.json()

      if (profile.error) {
        throw new Error(profile.error.message)
      }

      // Then get their media
      const mediaResponse = await fetch(
        `${baseUrl}/me/media?fields=id,media_url,caption,media_type,timestamp,like_count,comments_count,permalink&limit=${limit}&access_token=${token}`,
      )
      const mediaData = await mediaResponse.json()

      if (mediaData.error) {
        throw new Error(mediaData.error.message)
      }

      return {
        profile: {
          username: profile.username,
          profilePictureUrl: profile.profile_picture_url,
          followersCount: profile.followers_count,
          mediaCount: profile.media_count,
          biography: profile.biography,
        },
        posts: mediaData.data.map((post: any) => ({
          id: post.id,
          mediaUrl: post.media_url,
          caption: post.caption,
          mediaType: post.media_type,
          timestamp: post.timestamp,
          likeCount: post.like_count,
          commentCount: post.comments_count,
          permalink: post.permalink,
        })),
      }
    }
    catch (error) {
      this.log.error('Instagram API Error', { error })
      throw abort('Failed to fetch Instagram data')
    }
  }

  async run(params: InstagramQueryParams, meta: EndpointMeta): Promise<EndpointResponse<InstagramResponse>> {
    const { handle, limit = 9 } = params

    if (!handle) {
      throw abort('Instagram handle is required')
    }

    const { site } = this.settings
    const token = await this.getInstagramToken(site.org?.orgId || '')
    const data = await this.fetchInstagramData(token, handle, limit)

    return {
      status: 'success',
      data,
    }
  }
}

export type CardRequests = {
  instagram: {
    params: InstagramQueryParams
    result: EndpointResponse<InstagramResponse>
  }
}

export function getQueries(args: CardQuerySettings) {
  return {
    instagram: new InstagramQuery(args),
  }
}
