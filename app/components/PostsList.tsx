import { Link } from '@remix-run/react'
import { PostSummary } from '~/models/post'
import { PostMeta } from './PostMeta'

export function PostsList({ posts }: { posts: PostSummary[] }) {
  return (
    <ul
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        padding: 0,
      }}
    >
      {posts.map(({ slug, frontmatter: { title, tags, createdAt } }) => (
        <div key={slug}>
          <Link
            to={slug}
            // prefetch="intent"
          >
            {title}
          </Link>
          <PostMeta tags={tags} createdAt={createdAt} />
        </div>
      ))}
    </ul>
  )
}
