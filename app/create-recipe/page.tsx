'use client';
import { useTransition } from 'react';
import { RecipeForm } from '@/components/recipe-edit-form.client';
import { recipeCreateAction } from '@/app/actions/form-submit';
import { useRouter } from 'next/navigation';

const getImageFile = (fileList: FileList | null) => {
  if (fileList) {
    return fileList[0];
  }
  return null;
};

const mockUploadImage = (file: File | null) => {
  if (!file) {
    return null;
  }
  console.log(`mock uploading ${file.name}`);
  return 'mockurl';
};

const CreateRecipe = () => {
  const [, startTransition] = useTransition();
  const router = useRouter();
  return (
    <div>
      <h1 className='text-3xl text-center mt-2'>Add a Recipe</h1>
      <RecipeForm
        onSubmitSuccess={(data) => {
          const { imageFileList, ...recipeDetails } = data;
          const imageFile = getImageFile(imageFileList);
          const imageUrl = mockUploadImage(imageFile);
          startTransition(async () => {
            const result = await recipeCreateAction({
              ...recipeDetails,
              imageUrl,
            });
            // if (result?.[0]?.recipeId) {
            //   router.push(`/recipes/${result[0].recipeId}`);
            // }
          });
        }}
        onSubmitError={(error) => {
          console.log('there was an error');
          console.error(error);
        }}
      />
    </div>
  );
};

export default CreateRecipe;
