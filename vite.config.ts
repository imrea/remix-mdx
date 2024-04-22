import { relative } from 'node:path'
import mdx from '@mdx-js/rollup'
import { vitePlugin as remix } from '@remix-run/dev'
import { installGlobals } from '@remix-run/node'
import rehypePrettyCode from 'rehype-pretty-code'
import remarkFrontmatter from 'remark-frontmatter'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import { getPostSlug } from './app/models/post'
import { getPostEntries } from './app/models/post.server'

installGlobals()

export default defineConfig({
  plugins: [
    mdx({
      remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter],
      rehypePlugins: [[rehypePrettyCode, { theme: 'github-light' }]],
    }),
    remix({
      // Required for "The Static Way"
      // We must know the files up front so the slug paths can be assigned
      // individually and the MDX components can be bundled
      routes: async (defineRoutes) => {
        let posts = await getPostEntries()
        return defineRoutes((route) => {
          route('static', 'routes/static.tsx', () => {
            for (let postPath of posts) {
              // Register posts as "/static/$postSlug"
              route(getPostSlug(postPath), relative('app', postPath))
            }
          })
        })
      },
    }),
    tsconfigPaths(),
  ],
})
