import { useMemo } from 'react'
import { json, type LoaderFunctionArgs, type MetaArgs } from '@remix-run/node'
import { Link, useLoaderData } from '@remix-run/react'
import { getMDXComponent } from 'mdx-bundler/client'
import { PostLayout } from '~/components/PostLayout'
import { getPost } from '~/utils/mdx-dynamic'

export const meta = ({ data }: MetaArgs<typeof loader>) => {
  let frontmatter = data?.frontmatter
  let title = frontmatter?.title ?? 'Untitled Blog Entry'
  let description = frontmatter?.description ?? undefined

  return [
    { title },
    { name: 'description', content: description },
    { proeprty: 'og:twitter:title', content: title },
    { proeprty: 'og:twitter:description', content: description },
  ]
}

export const loader = async ({ params }: LoaderFunctionArgs) => {
  let slug = params['*']?.replace(/\/$/, '') || ''
  let post = await getPost(slug)
  if (!post) throw json({ message: 'Post Not Found' }, 404)
  return json(post)
}

export default function DynamicBlogPost() {
  let { code, frontmatter } = useLoaderData<typeof loader>()
  let Component = useMemo(() => getMDXComponent(code), [code])
  return (
    <div>
      <Link to="/dynamic" style={{ display: 'block', marginBottom: 16 }}>
        Back to Dynamic list
      </Link>
      <PostLayout frontmatter={frontmatter}>
        <Component />
      </PostLayout>
    </div>
  )
}
