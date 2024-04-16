import {
  byCreatedAt,
  getPostSlug,
  PostSummary,
  type PostFrontmatter,
} from '~/models/post'

const POSTS = import.meta.glob<{
  frontmatter: PostFrontmatter
  default: JSX.Element
}>('../posts/**/*.mdx')

export async function getPosts(): Promise<PostSummary[]> {
  let entries = Object.entries(POSTS)
  let posts = await Promise.all(
    entries.map(async ([postPath, importPost]) => {
      let { frontmatter } = await importPost()
      let slug = getPostSlug(postPath)
      return { slug, frontmatter }
    })
  )

  return posts.sort(byCreatedAt)
}
