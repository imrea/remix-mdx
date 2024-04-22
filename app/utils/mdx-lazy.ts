import { postModulesBySlug } from '~/constants/posts'
import { byCreatedAt, PostSummary } from '~/models/post'

export async function getPosts(): Promise<PostSummary[]> {
  let entries = Object.entries(postModulesBySlug)
  let posts = await Promise.all(
    entries.map(async ([slug, importPost]) => {
      let { frontmatter } = await importPost()
      return { slug, frontmatter }
    })
  )
  return posts.sort(byCreatedAt)
}

export async function getPost(slug: string): Promise<PostSummary | null> {
  let postModule = postModulesBySlug[slug]
  if (!postModule) return null
  let { frontmatter } = await postModule()
  return { slug, frontmatter }
}
