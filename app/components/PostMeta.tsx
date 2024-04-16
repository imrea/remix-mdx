import { PostFrontmatter } from '~/models/post'

export function PostMeta({
  tags,
  createdAt,
}: Pick<PostFrontmatter, 'tags' | 'createdAt'>) {
  return (
    <div style={{ display: 'flex', gap: 10 }}>
      <div>
        <b>Tags:</b> {tags.join(' · ')}
      </div>
      <div>
        <b>Created:</b> {createdAt}
      </div>
    </div>
  )
}
