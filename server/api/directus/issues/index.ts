import { readItems } from "@directus/sdk"
import type { Issue } from "@/types/issue"

interface QueryOptions {
  limit: number;
  fields: string[];
  //deep: { translations: { _filter: { languages_code: { _eq: string } } } };
  sort: string[];
  filter?: any;
}

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const lang = query.lang as string || 'fr'
  const search = query.search as string || ''

  const queryOptions: QueryOptions = {
    limit: -1,
    fields: ["*"],
    //deep: { translations: { _filter: { languages_code: { _eq: lang } } } },
    filter: { language: { _eq: lang } },
    sort: ["sort"]
  }

  if (search.trim() !== '') {
    queryOptions.filter = {
      _or: [
        { title: { _contains: search } },
        { introduction: { _contains: search } },
        { video_description: { _contains: search } },
        { content: { _contains: search } },
        { pdf_text: { _contains: search } }
      ]
    }
  }

  const res = await useDirectus().request(
    readItems("issues", queryOptions)
  )

  let issues = res.map(e => transform(e))
  issues = issues.filter(e => e.title.trim() !== "")
  return issues as Issue[]
})

const transform = (response: any): Issue => {
  return {
    id: response.id,
    title: response.title || "",
    vignette: response.vignette ? `https://eddb.unifr.ch/didanum9-admin/assets/${response.vignette}?fit=cover&width=490&height=300` : "",
    videoDescription: response.video_description || "",
    introduction: response.introduction || "",
  }
}