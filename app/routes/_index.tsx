import type { MetaFunction } from '@remix-run/node'
import { Link } from '@remix-run/react'

export const meta: MetaFunction = () => {
  return [
    { title: 'New Remix & MDX App' },
    { name: 'description', content: 'Welcome to Remix & MDX!' },
  ]
}

export default function Index() {
  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', lineHeight: '1.8' }}>
      <h1>Welcome to Remix + MDX</h1>
      <ul>
        <li>
          <Link to="dynamic">Dynamic Blog</Link>
        </li>
        <li>
          <Link to="static">Static Blog</Link>
        </li>
      </ul>
    </div>
  )
}
