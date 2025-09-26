import { readItem } from "@directus/sdk"
import { transformYoutubeUrl } from "@/server/utils/youtube"
import { directusAssetUrl } from "~/server/utils/directus"
import type { Issue } from "@/types/issue"

interface DirectusIssue {
  id: string
  vignette?: string
  title: string
  introduction?: string
  video_url?: string
  video_description?: string
  content?: string
  solutions?: Array<{
    title?: string
    video_url?: string
  }>
  testimonies?: Array<{
    title?: string
    video_url?: string
  }>
  appendix: Array<{
    directus_files_id: {
      id: string
      title?: string
    }
  }>
  links?: Array<{
    title?: string
    url?: string
  }>
  pdf_text?: string
}

interface VideoItem {
  title: string
  url: string
}

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id') || '1'
  const query = getQuery(event)
  const lang = (query.lang as string) || 'fr'

  try {
    const res = await useDirectus().request(
      readItem("issues", id, {
        fields: ["*", "appendix.directus_files_id.*"]
      })
    ) as DirectusIssue

    return transform(res)
  } catch (error) {
    console.error(`Erreur lors de la récupération de l'issue ${id}:`, error)
    throw createError({
      statusCode: 500,
      message: `Impossible de récupérer les données pour l'issue ${id}`
    })
  }
})

const transformVideoItems = (items?: Array<{ title?: string, video_url?: string }> | null): VideoItem[] => {
  return (items || []).map(item => ({
    title: item.title || "",
    url: transformYoutubeUrl(item.video_url)
  }))
}

/**
 * Transform API response into Issue object
 */
const transform = (response: DirectusIssue): Issue => {
  
  return {
    id: Number(response.id),
    title: response.title || "",
    introduction: response.introduction || "",
    videoDescription: response.video_description || "",
    videoUrl: transformYoutubeUrl(response.video_url),
    content: response.content || "",
    solutions: transformVideoItems(response.solutions),
    testimonies: transformVideoItems(response.testimonies),
    appendix: (response.appendix || []).map((appendix) => ({
      title: appendix?.directus_files_id?.title || "",
      url: directusAssetUrl(appendix?.directus_files_id?.id || "")
    })),
    links: (response.links || []).map(link => ({
      title: link.title || "",
      url: link.url || ""
    }))
  }
}