import { MetaArgs } from '@remix-run/node'
import { Link, Outlet, useMatches } from '@remix-run/react'
import { PostLayout } from '~/components/PostLayout'
import { PostFrontmatter } from '~/models/post'

export const meta = (_: MetaArgs) => {
  console.warn('TODO: Dynamically add proper SEO/Meta tags for Static entries')

  // Currently manually exporting `meta` and `headers` from MDX files seems to
  // be the only simple way to achieve proper seo/meta
  // https://remix.run/docs/en/main/future/vite#map-mdx-frontmatter-to-route-exports

  return [
    // { title },
    // { name: 'description', content: description },
    // { proeprty: 'og:twitter:title', content: title },
    // { proeprty: 'og:twitter:description', content: description },
  ]
}

export default function StaticBlogPostLayout() {
  let { frontmatter } = usePostHandle()
  return (
    <div>
      <Link to="/static" style={{ display: 'block', marginBottom: 16 }}>
        Back to Static list
      </Link>
      <PostLayout frontmatter={frontmatter}>
        <Outlet />
      </PostLayout>
    </div>
  )
}

function usePostHandle() {
  let [match] = useMatches().slice(-1)
  let postHandle = match.handle as { frontmatter: PostFrontmatter } | undefined
  if (!postHandle?.frontmatter)
    throw new Error(`Missing 'handle.frontmatter' export from ${match.id}`)
  return postHandle
}
