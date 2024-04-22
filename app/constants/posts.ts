import { lazy } from 'react'
import { getPostSlug, type PostMDX } from '../models/post'

export const postModules = import.meta.glob<PostMDX>('../posts/**/*.mdx')

export const postModulesBySlug = Object.fromEntries(
  Object.entries(postModules).map(([path, module]) => [
    getPostSlug(path),
    module,
  ])
)

export const postLazyModulesBySlug = Object.fromEntries(
  Object.entries(postModules).map(([path, module]) => [
    getPostSlug(path),
    lazy(module),
  ])
)
