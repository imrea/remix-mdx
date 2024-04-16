export function TagsList({ tags }: { tags: string[] }) {
  return (
    <div>
      <b>All Tags:</b> {tags.join(' · ')}
    </div>
  )
}
