# Remix + MDX Experiment

A POC app to showcase **static** and **dynamic** MDX capabilities in Remix.

There is a single source of MDX files (`app/posts`) for both representations.

## The Static Way

### Importing statically

Since we want all posts to be bundled and made static, but at the same time avoid manually keeping track of the right imports in the right place, we can utilize [Vite's Glob Import](https://vitejs.dev/guide/features#glob-import) feature.

### Index Page

The `routes/static_._index`file implements a listing page for all blog entries.

Since we want to use `routes/static` as a layout for individual post entries, for the index page we have to [skip the default layouting](https://remix.run/docs/en/main/file-conventions/routes#nested-urls-without-layout-nesting) by suffixing it with `_`.

### Post Page

The `routes/static.tsx` file implements the layout. In the case of static pages, each MDX file represents it's own route and content.

This avoids double work by maintaining a dedicated `routes/static.$slug.tsx` file in which otherwise we had to manually import the likewise named MDX content.

By importing MDX files statically, we receive the `JSX` content already which is put inside the `<Outlet />`.

The drawback is that this way we can not provide meta dynamically, as in the parent/layout component, on the server side, we do not know which child has been rendered, nor having access to it's frontmatter.

## The Dynamic Way

### Index Page

The `routes/dynamic._index` file implements a listing page for all blog entries

### Post Page

The `routes/dynamic.$slug` file implements the generic post show page.

It then tries to find the matching post by this slug (either as `posts/$slug.mdx` or `posts/$slug/index.mdx` to allow for complex articles and asset colocation)

The post MDX is getting individually [bundled](https://github.com/kentcdodds/mdx-bundler) and returned as an [evaluable code string](https://github.com/kentcdodds/mdx-bundler?tab=readme-ov-file#known-issues) from the `loader`.

The [MDX Bundler's FE binding](https://github.com/kentcdodds/mdx-bundler?tab=readme-ov-file#known-issues) takes care of the evaluation in the browser and turns the code into a safely renderable React component.

## The Lazy Way

If you do not want to add content unrelated exports and meta code to the posts (like those otherwise "statically" neccessary `export const handle = { frontmatter }` lines), we can take the middle road by using [Suspense](https://react.dev/reference/react/Suspense) and [lazy](https://react.dev/reference/react/lazy).
We still rely on Vite's `import.meta.glob`, but instead of eagerly loading modules, we can wrap the imports with `lazy`:

```ts
export const postModules = import.meta.glob<{
  frontmatter: PostFrontmatter
  default: () => JSX.Element
}>('../posts/**/*.mdx')

export const postLazyModulesBySlug = Object.fromEntries(
  Object.entries(postModules).map(([path, module]) => [
    getPostSlug(path),
    lazy(module),
  ])
)
```

This leaves us with a handy mapping of `postSlug -> lazy imported React component` which we can utilize on our Post page.

We can also restrict imports to only contain the actual React Post component, attached to the `default` export by defaut by the MDX Vite plugin:

```ts
export const postComponentModules = import.meta.glob<{
  frontmatter: PostFrontmatter
  default: () => JSX.Element
}>('../posts/**/*.mdx', { import: 'default' })
```

We can also rely on Vite's MDX import to grab the neccessary `frontmatter` to be returned from the Post page's `loader`, which in turn makes these available to the `meta` function as well to cover SEO/meta tags.

### Index Page

We can use the same concept as for the Static way.

### Post Page

In the `loader` we use a conceptually similar way as in the Index page, but only importing the frontmatter of the Post in question.

In the component, we use dynamic import map with the `lazy` wrappers already in place, to look up the right dynamic `import` based on the slug (which is already being verified to be correct in the loader).
`Suspense` is now able to render our lazy MDX component.
During SSR, though, there are no extra roundtrip as the import is resolved right at render time.

## Resources

- [How to configure Remix and mdx-bundler](https://blacksheepcode.com/posts/adding_msw_bundler_to_remix_app)
- [pcattori/remix-blog-mdx](https://github.com/pcattori/remix-blog-mdx)
- [Lazy-load React components in Remix](https://sergiodxa.com/tutorials/lazy-load-react-components-in-remix)
