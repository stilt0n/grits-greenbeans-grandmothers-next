import Image from 'next/image';
import { FamilyOnly } from '@/components/auth/family-only';
import {
  FAMILY_TREE_LINK,
  EMAIL_ADDRESS,
  GITHUB_REPO_LINK,
} from '@/lib/constants';
import { LinkButton } from '@/components/recipe-gallery/link-button.client';
import { EmailIcon } from '@/components/icons';

const AboutPage = () => {
  return (
    <div className='prose prose-zinc -mt-4 w-screen min-h-screen about-page'>
      <section className='max-w-[65rem] m-auto px-8 py-16 bg-white min-h-screen'>
        <h1>Introduction from the Original Book</h1>
        <p>
          In this cookbook, you probably won&apos;t see many terms such as au
          gratin, escalope, paté, sauté or étouffée. You will see fry, brown,
          sweet milk, stir with a big spoon, add a pinch of this, a teacup of
          that, or maybe what to cook on wash day while the sheets boil.
          That&apos;s because some of the recipes date back over 150 years. Our
          ancestors in the 19th and early part of the 20th century were almost
          self-sufficient. They raised livestock, grew their own vegetables and
          fruits, and all their jellies, preserves and pickles were homemade.
          Canning and &quot;putting up&quot; jars of food was an important part
          of their rural lifestyles.
        </p>
        <p>
          When a farm family was forced to buy the few items they couldn&apos;t
          raise, grow, or pick wild, they bought in bulk. Apples came by the
          bushel, cane syrup in 24 gallon kegs, flour in 192 lb. lots and sugar
          came in 120 lb. barrels. At that time, one also easily could have the
          makin’s for rabbit stew, fried squirrel, or possum and taters. Famine
          turned to feast as the creative cook gathered her family around the
          supper table.
        </p>
        <blockquote>
          &quot;We may live without poetry, music, and art;
          <br />
          We may live without conscience and live without heart;
          <br /> We may live without friends and live without books;
          <br /> But civilized man cannot live without cooks.&quot;
          <br />
          <br />
          Copied [Toasts for All Occasions (1903)]
        </blockquote>
        <p>
          The hard years of the depression produced, through necessity, some of
          our most wonderful food (with or without recipes). Who needed a recipe
          for left-over mashed potatoes, mixed with a little flour and seasoning
          to make fried potato patties? Who needed a recipe to tell you how to
          tenderize a piece of meat by pounding it with the side of a saucer?
          You could tell by the &quot;thud&quot; if the meat was ready for the
          flour and hot grease. Frying a piece of ham, frying potatoes, making a
          bowl of gravy, or cooking a pot of red beans came just as natural as
          breathing. The cook cooked with judgement.
        </p>
        <p>
          An old story goes that a couple of generations ago, a young woman went
          to her grandmother to ask how to make a dish for which the old woman
          was famous. The first part went well enough, then the girl was told to
          add an ingredient &quot;according to her judgement.&quot; Troubled,
          the girl asked what to do if one had no judgement and she received the
          curt reply, &quot;If you have no judgement, you shouldn&apos;t
          cook.&quot; By judgement, one could tell –
        </p>
        <blockquote>
          Bread was done when it smelled right.
          <br /> A cake was done when it felt right.
          <br /> Gravy was done when it looked right.
        </blockquote>
        <p>
          Oh, there were times for the cook to shine and sometimes use recipes.
          Even through the depression, there was a time for feasting. During the
          holiday season from Thanksgiving to New Year&apos;s, the cook would
          produce the very best food she could as she drew her family around the
          table. Birthdays, and golden anniversaries were and still are special
          celebrations and times to get the family together again. The family
          gains strength (not to mention weight) each time it meets and comes
          together around the table. In the early part of the century our
          ancestors traveled by horse and buggy and then by Model T Ford to the
          rural church. They arrived with fried chicken, butter beans from the
          garden and banana pudding to spread on the makeshift tables on the
          church grounds. We still go, but travel on the super highways and
          maybe slip into an air conditioned building after we get there.
        </p>
        <p>
          Everything may have changed around us but we still have the desire to
          return to our roots to share fellowship and food around the table. We
          cooks try to bring our &quot;specials&quot; to the church suppers,
          birthdays or family reunions. Our food tables are still much like they
          were 50-100 years ago. They are homey. Even though we have been
          exposed to sophisticated cuisine, we prefer and use the recipes that
          date back to our rural communities.
        </p>
        <p>
          In the past, the recipes began with shelling the peas, shucking the
          corn, snapping the beans, bringing in the stove wood or plucking the
          chicken. Sunday was roast. Monday was hash and a pot of red beans
          cooking while the wash was on the line. Everything was made from
          &quot;scratch.&quot; Food like my mother&apos;s famous banana nut cake
          or &quot;cook the custard&quot; banana pudding has changed through the
          years. When health, age, or just the passing of time makes its demands
          on us, we switch to convenience foods, meanwhile, trying our best to
          maintain our reputation as a good cook.
        </p>
        <p>
          Sunday is still roast. No need for stove wood; just pop the meat into
          the oven and set the timer. The hash is the same except be sure and
          scrape off that excess grease from the gravy before mixing and putting
          into the microwave. The red beans can cook in the crock pot while we
          punch the buttons on the washer and dryer. Bread pudding may be made
          from the left-over bread which was made in the bread machine. One can
          make a cake starting with a cake mix, or make that delicious banana
          pudding using instant pudding mix and Cool Whip. We can turn out a
          tasty meal again and maintain our reputation as a good cook even
          though we make a few slight-of-hand changes.
        </p>
        <p>
          One of the biggest changes in cooking brought about in our generation
          has been made by men. Men are cooking! They may be cooking in the
          kitchen or outside on the grill. It makes no difference. We welcome
          them with open arms.
        </p>
        <blockquote>
          &quot;She that is ignorant in cooking, may love and obey, but she
          cannot cherish and keep her Husband.&quot;
          <br />
          <br />
          From &quot;The English Housewife&quot;, 1615.
        </blockquote>
        <blockquote>
          That may have been true in 1615, but today we say, &quot;Men who do
          some cooking are cherished and loved and will be held on to.&quot;
          <br />
          <br />
          From &quot;The Tired Housewife&quot;, 1994.
        </blockquote>
        <p>
          To the best of my knowledge, my mother never had a recipe box. She had
          recipe books and a collection of recipes. This &quot;collection&quot;
          was written on pieces of this and on the backs of that, and carried in
          her head. She rarely followed a recipe exactly. She cooked from the
          heart. In doing so, she shared her good food and her heart with
          everyone that came in contact with her.
        </p>
        <p>
          The family recipes here are represented by cooks who cook with their
          hearts. They have practiced the art of turning common day ingredients
          into delicious nourishing meals. This practice has been handed down
          from generation to generation. With great pride, we boast about these
          good cooks. We think they are the best.
        </p>
        <p>
          We are fortunate that Barbara and Jerry have collected these recipes
          for us to enjoy. Their time and effort is indeed appreciated as they
          have preserved part of our heritage.
        </p>
        <p>
          The recipes in this cookbook are about love, happiness, generosity,
          faith, hope, friends and our families. I know they will bring back to
          you pleasant memories of times past.
        </p>
        <p>
          I hope you have a warm, cozy and happy feeling as you read these
          recipes, share them, and enjoy the good food and fellowship around the
          table.
        </p>
        <blockquote>
          Please join us. The food is ready Now, would someone say the
          blessing....
          <br />
          <br />
          <br />
          Ada Wesson Jones Spring, 1994
        </blockquote>
        <h1 className='mt-10'>About this site</h1>
        <p>
          This website was made with the goal of digitizing the original recipe
          book and making it easier for members of the family to extend it.
          Certain features of this site like creating and editing recipes are
          only available to family members. To be added as a family member you
          need to create an account. Then, contact Mattias or Ali to get added
          as a family member. After you&apos;re added, there will be a few extra
          links below this.
        </p>
        <FamilyOnly>
          <h2>Family Tree</h2>
          <p>
            There are many generations of recipes on this site and you may not
            recognize all the names. Ali has been putting together a family tree
            and that can be a useful visual aide for the curious.{' '}
            <a href={FAMILY_TREE_LINK}>You can view the family tree here.</a>
          </p>
          <LinkButton href={FAMILY_TREE_LINK}>Link to family tree</LinkButton>
          <h2>Problems and Suggestions</h2>
          <p>
            If you run into problems while on the site and have time to report
            them, problem reports help me improve the site and are always
            appreciated. Suggestions are also always appreciated. There are two
            ways to report a problem or make a suggestion. You can report them
            by opening an issue on GitHub or you can send me an email.
          </p>
          <div>
            <a className='flex flex-row items-center' href={GITHUB_REPO_LINK}>
              <Image src='github-mark.svg' alt='' width={30} height={30} />
              <span className='ml-3 underline'>Report on Github</span>
            </a>
            <a
              className='flex flex-row items-center'
              href={`mailto:${EMAIL_ADDRESS}`}
            >
              <EmailIcon />
              <span className='ml-3 underline'>Email Me</span>
            </a>
          </div>
        </FamilyOnly>
      </section>
    </div>
  );
};

export default AboutPage;
