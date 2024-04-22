export interface PostMDX {
  frontmatter: PostFrontmatter
  default: () => JSX.Element
}

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

export function getPostSlug(postPath: string) {
  return postPath
    .replace('/index.mdx', '')
    .replace('.mdx', '')
    .split('/')
    .slice(-1)[0]
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
