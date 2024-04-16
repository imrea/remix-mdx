import { parse } from 'node:path'
import { glob } from 'glob'

export interface PostFrontmatter {
  title: string
  description: string
  createdAt: string
  tags: string[]
}

export interface PostSummary {
  slug: string
  frontmatter: PostFrontmatter
}

export async function getPostEntries() {
  let posts = await glob('app/posts/**/*.mdx', {
    cwd: process.cwd(),
    nodir: true,
  })
  return posts
}

export async function getPostEntry(slug: string) {
  let [post = null, isAmbigiouos] = await glob(
    [`app/posts/${slug}.mdx`, `app/posts/${slug}/index.mdx`],
    { cwd: process.cwd(), nodir: true }
  )

  if (isAmbigiouos)
    console.warn(`Possibly duplicate post: ${slug} <-> ${slug}/index.mdx`)

  return post
}

export function getPostSlug(postPath: string) {
  return parse(postPath.replace('/index.mdx', '')).name
}

export function getUniqueTags(posts: { frontmatter: PostFrontmatter }[]) {
  return [...new Set(posts.flatMap(({ frontmatter: { tags } }) => tags))].sort()
}

export function byCreatedAt(a: PostSummary, b: PostSummary) {
  return (
    new Date(b.frontmatter.createdAt).getTime() -
    new Date(a.frontmatter.createdAt).getTime()
  )
}
