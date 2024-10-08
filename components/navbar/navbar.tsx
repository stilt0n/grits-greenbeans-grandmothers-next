import Link from 'next/link';
import { Search } from './search.client';
import { UserMenu } from './user-menu.client';

const Navbar = () => {
  return (
    <nav className='flex flex-row px-4 py-4 drop-shadow-xl'>
      <h1 className='text-3xl text-left'>
        <Link href='/'>Grits Greenbeans and Grandmothers</Link>
      </h1>
      <div className='flex flex-row justify-end ml-auto'>
        <Search className='pr-6' />
        <UserMenu />
      </div>
    </nav>
  );
};

export default Navbar;
