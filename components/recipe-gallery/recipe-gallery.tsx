import { Pagination } from '../ui/pagination';
import { RecipeCard, type RecipeCardProps } from './recipe-card';

export interface LoadRecipeArgs {
  startIndex?: number;
  limit?: number;
  filter?: string;
}

export type LoadRecipeAction = (
  args: LoadRecipeArgs
) => Pick<RecipeCardProps, 'title' | 'description' | 'imgUrl'>;

export interface RecipeGalleryProps {
  loadRecipeAction: LoadRecipeAction;
}

const RecipeGallery = (props: RecipeGalleryProps) => {
  return (
    <div>
      <div className='gallery'></div>
      <Pagination></Pagination>
    </div>
  );
};

export default RecipeGallery;
