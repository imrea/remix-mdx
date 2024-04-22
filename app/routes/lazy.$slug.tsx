import { Suspense } from 'react'
import { json, LoaderFunctionArgs, MetaFunction } from '@remix-run/node'
import { Link, useLoaderData } from '@remix-run/react'
import { PostLayout } from '~/components/PostLayout'
import { postLazyModulesBySlug } from '~/constants/posts'
import { getPost } from '~/utils/mdx-lazy'

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  let frontmatter = data?.frontmatter
  let title = frontmatter?.title ?? 'Untitled Blog Entry'
  let description = frontmatter?.description ?? undefined

  return [
    { title },
    { name: 'description', content: description },
    { property: 'og:twitter:title', content: title },
    { property: 'og:twitter:description', content: description },
  ]
}

export const loader = async ({ params }: LoaderFunctionArgs) => {
  let slug = params.slug || ''
  let post = await getPost(slug)
  if (!post) throw json({ message: 'Post Not Found' }, 404)
  return json(post)
}

export default function LazyBlogPost() {
  let { slug, frontmatter } = useLoaderData<typeof loader>()
  let Post = postLazyModulesBySlug[slug]

  return (
    <div>
      <Link to="/lazy" style={{ display: 'block', marginBottom: 16 }}>
        Back to Lazy list
      </Link>
      <PostLayout frontmatter={frontmatter}>
        <Suspense fallback={<div>Loading ...</div>}>
          <Post />
        </Suspense>
      </PostLayout>
    </div>
  )
}
