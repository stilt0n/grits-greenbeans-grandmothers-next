import RecipeGallery, {
  createSearchParamProps,
} from '@/components/recipe-gallery';
import { NextPageBaseProps } from '@/types/nextTypes';

const Home = async (props: NextPageBaseProps) => {
  const searchParams = await props.searchParams;
  const recipeGalleryProps = createSearchParamProps(searchParams);
  return (
    <div>
      <RecipeGallery {...recipeGalleryProps} />
    </div>
  );
};

export default Home;
