import RecipeGallery, { createRecipeProps } from '@/components/recipe-gallery';
import { NextPageBaseProps } from '@/types/nextTypes';

const Home = async ({ searchParams }: NextPageBaseProps) => {
  const recipeProps = createRecipeProps(searchParams);
  return (
    <div>
      <RecipeGallery {...recipeProps} />
    </div>
  );
};

export default Home;
