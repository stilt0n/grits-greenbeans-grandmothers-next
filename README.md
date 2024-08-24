# About

This is a rewrite of Grits Greenbeans and Grandmothers in Next js.

I'm not sure it was necessary to switch to Next but I wanted to give both Next and Remix a try and needing to rewrite the site seemed like an opportunity to try Next. Some of the other tools I was using seem like they are a little more compatible with Next which is another reason it seemed worth giving this a shot.

I learned quite a bit from building the first iteration of this site, but I think I also made many mistakes:

- Using forms to create recipes turned out to be a pretty terrible user experience.
- The database schemas I used were way more complicated than they should have been.
- Not testing turned out to be a mistake. I don't think this site needs bullet-proof tests, but doing a minimum CI check to make sure a PR didn't take the site down would have been surprisingly useful.

## Rough ideas of the site architecture

The core functionality of this site is basically the same as a blog site:

- Everyone should be able to view and search recipes on the site.
- Only authenticated admin users should be able to create or edit recipes.

Last time this functionality was implemented through forms. This worked okay and there were some potential advantages to doing it this way (being able to do math on ingredient quantities) but the editing experience really suffered as a result and I don't think it was really worthwhile.

This also vastly simplifies the database. Each ingredient should have:

- an id
- a title
- an author
- image url
- recipe text

Last time around I built methods to try to minimize rows fetched as much as possible as a performance / cost optimization. But I think this was premature. This time around I will explore this only if it appears necessary.

I will probably continue to use Turso and Drizzle for this.

Instead of using a form, recipes will be entered using a text editor. My original plan was to make a markdown editor for this (and I am still doing this as a separate project) but for this particular use, WSIWYG seems like a better option. I found one libary that does this and converts the text to html strings. I would have honestly rather stored markdown, but this seems pretty reasonable as well. The HTML would be stored directly in the database and fetched when the page for the recipe is visited.

I still need to do a little more research on how realistic this approach is. If it does not work, I can fall back to my markdown editor which I have already confirmed will work.

This also works well with the eventual goal to add a chatbot (this is a pretty pointless thing to have, but I'd like to learn those techs a little better) since the recipe text can easily be used to populate a vector database later with very little preprocessing.

## Planned techs

- NextJS
- Tailwind
- Turso
- Drizzle
- ShadcnUI for components
- TipTap or Mantine's TipTap wrapper
- possibly MdxEditor
- Bun for package management and unit tests (if possible)
- Playwright for E2E tests
- Vercel
