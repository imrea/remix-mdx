import { glob } from 'glob'

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
