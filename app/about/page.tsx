import { FamilyOnly } from '@/components/auth/family-only.client';
import { FAMILY_TREE_LINK } from '@/lib/constants';
import { LinkButton } from '@/components/recipe-gallery/link-button.client';

const AboutPage = () => {
  return (
    // prose and prose-zinc apply default stying like on the recipe pages
    <div className='prose prose-zinc'>
      {/*
      
        Tailwind documentation shows what CSS the classes have:
        e.g. https://tailwindcss.com/docs/text-color
      
      */}
      <h1 className='text-zinc-900'>About Page</h1>
      <FamilyOnly>
        <p>This is an example of how to hide UI from non-family members</p>
        {/*
          you can also use an anchor tag:
          
          ```jsx
          <a href={FAMILY_TREE_LINK}>link</a>)
          ```
          
          if you prefer to have this be a regular link.

          use FAMILY_TREE_LINK instead of the actual link so that the link
          stays hidden on the server instead of being visible on github
        */}
        <LinkButton href={FAMILY_TREE_LINK}>Link to family tree</LinkButton>
      </FamilyOnly>
    </div>
  );
};

export default AboutPage;
