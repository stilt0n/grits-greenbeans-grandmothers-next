import RecipeGallery, {
  createSearchParamProps,
} from '@/components/recipe-gallery';
import { NextPageBaseProps } from '@/types/nextTypes';

const Home = async ({ searchParams }: NextPageBaseProps) => {
  const recipeGalleryProps = createSearchParamProps(searchParams);
  console.log('filter', recipeGalleryProps.filter);
  return (
    <div>
      <RecipeGallery {...recipeGalleryProps} />
    </div>
  );
};

export default Home;
