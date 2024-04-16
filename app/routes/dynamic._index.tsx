import { json, Link, useLoaderData } from '@remix-run/react'
import { PostsList } from '~/components/PostsList'
import { TagsList } from '~/components/TagsList'
import { getUniqueTags } from '~/models/post'
import { getPosts } from '~/utils/mdx-dynamic'

export const loader = async () => {
  let posts = await getPosts()
  let tags = getUniqueTags(posts)
  return json({ posts, tags })
}

export default function DynamicBlogIndex() {
  let { posts, tags } = useLoaderData<typeof loader>()
  return (
    <article>
      <Link to="/" style={{ display: 'block', marginBottom: 16 }}>
        Home
      </Link>
      <h1>Dynamic Blog</h1>
      <TagsList tags={tags} />
      <PostsList posts={posts} />
    </article>
  )
}
