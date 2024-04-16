import { PropsWithChildren } from 'react'
import { PostMeta } from '~/components/PostMeta'
import { PostFrontmatter } from '~/models/post'

export function PostLayout({
  frontmatter: { title, tags, createdAt },
  children,
}: PropsWithChildren<{ frontmatter: PostFrontmatter }>) {
  return (
    <article>
      <PostMeta tags={tags} createdAt={createdAt} />
      <h1 style={{ fontSize: '3em' }}>{title}</h1>
      {children}
    </article>
  )
}
