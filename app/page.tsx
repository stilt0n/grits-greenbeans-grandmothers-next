import Link from 'next/link';
import { currentUser } from '@clerk/nextjs/server';
import { hasElevatedPermissions } from '@/lib/auth';

// Has possible solution to auth issue
// https://github.com/clerk/javascript/issues/1528
const Home = async () => {
  const user = await currentUser();
  return (
    <div>
      <h1 className='text-3xl text-center mt-2'>Under Construction...</h1>
      {hasElevatedPermissions(user) ? (
        <Link href='/create-recipe'>Add a Recipe</Link>
      ) : null}
    </div>
  );
};

export default Home;
