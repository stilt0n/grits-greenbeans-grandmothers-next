import Link from 'next/link';
import { Search } from './search.client';
import { UserMenu } from './user-menu.client';
import { SideNav } from './side-nav';

const searchCategories = ['title', 'author', 'tag'];

const Navbar = () => {
  return (
    <nav className='flex flex-row px-4 py-4 drop-shadow-xl border-b border-zinc-200 items-baseline h-18'>
      <h1 className='text-lg md:text-3xl text-left flex self-start'>
        <Link href='/'>Grits, Greenbeans and Grandmothers</Link>
      </h1>
      <div className='flex flex-row justify-end ml-auto gap-6'>
        <Search className='hidden lg:flex' categories={searchCategories} />
        <UserMenu className='hidden md:flex' />
        <SideNav />
      </div>
    </nav>
  );
};

export default Navbar;
