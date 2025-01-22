# Grits, Greenbeans and Grandmothers

This repository has the source code for [gritsgreenbeansandgrandmothers.com](https://www.gritsgreenbeansandgrandmothers.com)

## About

Grits, Greenbeans and Grandmothers is a digitized version of two recipe books of the same name that my grandfather-in-law compiled in the late 90s / early 2000s.

## Why?

There were a few reason to digitize these books:

1. The original word processor documents for these recipe books no longer exist. Since they contain family recipes spanning over 150 years, they seemed worth protecting. Digitizing them accomplishes this.

2. It seemed like it would be nice if family could continue to contribute to this project. Having a website for this makes the recipe book a living document and allows family members to continue to record and share recipes.

3. I have wanted to explore several technologies I don't currently get to use at work, like server-side rendered React components, generative AI, backend, and building a project from start to finish. This is a good learning project for me and so many unnecessary features (does a family recipe site really need an AI assistant?) exist primarily for this reason.

## Site Features

The site hosts recipes and at a technical level it's basically a glorified blog.

- Users can create an account and log in
- Users who are given a "family" or "admin" role can create and edit recipes
- Anyone can view and search for recipes
- Anyone can talk to grandmother_bot about a recipe

**Recipe Creation:**

Recipes have a title, author, description (the blurb you see on the recipe cards before reading more), cook time, tags, instructions and an image.

Many of these are optional, for example most recipes right now do not have a cook time or image because I have not made them.

Images have an enforced aspect ratio and are uploaded via an image cropper component.

Instructions are entered through a What-You-See-is-What-You-Get (WYSIWYG) text editor (think MS Word or Google docs but with many fewer features).

**AI Features:**

- An AI assistant named grandmother_bot is accessible on all recipe pages
- grandmother_bot can answer questions about food or recipes
- grandmother_bot can use tools to help scale recipes up and down accurately
- Recipe descriptions can be generated using AI by clicking a button in the recipe create/edit forms. The AI uses the title and instructions to come up with a description.

## Technical details -- overview

Technologies I used to build this site:

- NextJS
- Tailwind CSS for styling
- Turso (LibSQL) as a database and database host
- Drizzle ORM
- Backblaze B2 and AWS S3 SDK for image storage
- Clerk for authentication
- shadcn UI as a component library
- TipTap for the text editor component
- react-image-crop for the image cropper component
- sharp for cropping and downsizing images
- Vercel for hosting
- Bun as a package manager (NextJS still uses node for the runtime)
- Bun test and react-testing-library for unit tests
- Playwright for E2E tests
- OpenAI, Vercel AI SDK for AI features
- nlux for a chat component

## Technical details -- Project Philosophy

My [last project](https://github.com/stilt0n/dependor) was written in Go, mostly using TDD and with only one dependency. This project is basically the opposite of that project:

- Prioritize finished work
- Use libraries when they are available
- Prefer newer techs even if they're less battle-tested
- Write tests only when there is a pain point
- Don't spend more than an hour on any technical decision
- Don't be afraid to rewrite code

I don't necessarily endorse this philosophy as a general development philosophy, but work in industry can often feel like it involves a lot of red tape. So using a "no red tape" approach can help clarify when I don't miss it and when I do.

## Roadmap

The GitHub issues are the most up to date place to look for this. But some things I plan to do in the next three months are:

**grandmother_bot:**

- Move to langchain to support more complex workflows
- ~~Support tool use so that grandmother_bot is more reliable with requests like "double this recipe"~~
- Duplicate recipe data in Pinecone to allow grandmother_bot to refer to other recipes on the site

**Site reliability:**

- perform database backups and store them on Backblaze
- use CDN to serve images

**UX:**

- Better search functionality
- ~~Better pagination~~
- Improve accessibility in areas where it is weak
