import Link from 'next/link';

const Home = () => {
  return (
    <div>
      <h1 className='text-3xl text-center mt-2'>Under Construction...</h1>
      <Link href='/create-recipe'>Add a Recipe</Link>
    </div>
  );
};

export default Home;
