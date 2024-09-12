import { GalleryPagination } from './gallery-pagination';
import { RecipeCard, type RecipeCardProps } from './recipe-card';

export interface LoadRecipeArgs {
  startIndex?: number;
  filter?: string;
}

export type LoadRecipeAction = (
  args: LoadRecipeArgs
) => Pick<RecipeCardProps, 'title' | 'description' | 'imgUrl'>;

export type LoadPageCountAction = (
  args: Pick<LoadRecipeArgs, 'filter'>
) => number;

export interface RecipeGalleryProps {
  loadRecipeAction: LoadRecipeAction;
  loadPageCountAction: LoadPageCountAction;
}

/**
 * The reason recipe loaders are not hardcoded is for dependency injection purposes.
 * `createRecipeLoaders` takes the work out of creating recipe loaders for recipe gallery
 * it operates similarly to setup hooks, but is not a hook.
 */
export const createRecipeLoaders = () => {
  const loadRecipeAction = ({ startIndex, limit, filter }) => {};
};

const RecipeGallery = async (props: RecipeGalleryProps) => {
  const pageCount = 10;
  return (
    <div>
      <div className='gallery'></div>
      <GalleryPagination pageCount={pageCount} />
    </div>
  );
};

export default RecipeGallery;
