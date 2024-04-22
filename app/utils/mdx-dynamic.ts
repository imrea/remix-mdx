import { readFile } from 'node:fs/promises'
import { relative } from 'node:path'
import fm from 'gray-matter'
import { bundleMDX } from 'mdx-bundler'
import rehypePrettyCode from 'rehype-pretty-code'
import {
  byCreatedAt,
  getPostSlug,
  PostSummary,
  type PostFrontmatter,
} from '~/models/post'
import { getPostEntries, getPostEntry } from '~/models/post.server'

export async function getPost(slug: string) {
  let file = await getPostEntry(slug)
  if (!file) return null

  let { code, frontmatter } = await bundleMDX<PostFrontmatter>({
    cwd: process.cwd(),
    file,
    esbuildOptions(options, _frontmatter) {
      // https://github.com/kentcdodds/mdx-bundler#image-bundling
      options.loader = {
        ...options.loader,
        '.jpg': 'dataurl',
        '.png': 'dataurl',
      }
      return options
    },
    mdxOptions(options, _frontmatter) {
      // https://github.com/kentcdodds/mdx-bundler?tab=readme-ov-file#mdxoptions
      // options.remarkPlugins = [...(options.remarkPlugins ?? []), myRemarkPlugin]
      options.rehypePlugins = [
        ...(options.rehypePlugins ?? []),
        [rehypePrettyCode, { theme: 'github-light' }],
      ]
      return options
    },
  })

  return { code, frontmatter }
}

export async function getPosts(): Promise<PostSummary[]> {
  let files = await getPostEntries()
  let posts = await Promise.all(
    files.map(async (postPath) => {
      let content = await readFile(relative(process.cwd(), postPath))
      let { data } = fm(content)
      return {
        slug: getPostSlug(postPath),
        frontmatter: data as PostFrontmatter,
      }
    })
  )
  return posts.sort(byCreatedAt)
}
