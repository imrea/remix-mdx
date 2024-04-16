# Remix + MDX Experiment

A POC app to showcase **static** and **dynamic** MDX capabilities in Remix.

There is a single source of MDX files (`app/posts`) for both representations.

## The Static Way

### Importing statically

Since we want all posts to be bundled and made static, but at the same time avoid manually keeping track of the right imports in the right place, we can utilize [Vite's Glob Import](https://vitejs.dev/guide/features#glob-import) feature.

In `utils/mdx-static.ts` we define the imports at the top level. This construct is Vite-specific, and get's compiled at build time, leaving us with an object of path strings and callable native dynamic `import`s. Note that we could pass `{ eager: true }` to `import.meta.glob` - in this case instead of callable imports we would have the contents eagerly evaluated, requiring no `Promise.all`.

Given the raising number of posts we might either refactor the `Promise.all` to [batched processing](https://dev.to/woovi/processing-promises-in-batch-2le6) or transition to _The Dynamic Way_.

### Index Page

The `routes/static_._index`file implements a listing page for all blog entries.

Since we want to use `routes/static` as a layout for individual post entries, for the index page we have to [skip the default layouting](https://remix.run/docs/en/main/file-conventions/routes#nested-urls-without-layout-nesting) by suffixing it with `_`.

### Post Page

The `routes/static`file implements a post layout, as in the case of static pages, each MDX file represents it's own route. This avoids double work by maintaining a dedicated `routes/static/$slug.tsx` file in which we had to manually import the likewise named MDX content.

By importing MDX files statically, we receive the rendered `JSX.Element` - this we have to render inside the `/static` page a layout, and have to use `<Outlet />` in it to let MDX content slip through.

The drawback is that this way we can not provide meta dynamically, as in the parent/layout component, on the server side, we do not know which child has been rendered, nor having access to it's frontmatter.

## The Dynamic Way

### Index Page

The `routes/dynamic._index` file implements a listing page for all blog entries

### Post Page

The `routes/dynamic.$` file implements the generic post show page.
This file acts as a "catch-all" route, grabbing every request under `/dynamic/`, considering `$` literally the id / slug of a post.

It then tries to find the matching post by this slug (either as `posts/$slug.mdx` or `posts/$slug/index.mdx` to allow for complex articles and asset colocation)

The post MDX is getting individually [bundled](https://github.com/kentcdodds/mdx-bundler) and returned as an [evaluable code string](https://github.com/kentcdodds/mdx-bundler?tab=readme-ov-file#known-issues) from the `loader`.

The [MDX Bundler's FE binding](https://github.com/kentcdodds/mdx-bundler?tab=readme-ov-file#known-issues) takes care of the evaluation in the browser and turns the code into a safely renderable React component.
