import Link from 'next/link';
import { Search } from './search.client';
import { UserMenu } from './user-menu.client';
import { SideNav } from './side-nav';

const Navbar = () => {
  return (
    <nav className='flex flex-row px-4 py-4 drop-shadow-xl border-b border-zinc-200'>
      <h1 className='text-lg md:text-3xl text-left'>
        <Link href='/'>Grits Greenbeans and Grandmothers</Link>
      </h1>
      <div className='flex flex-row justify-end ml-auto gap-6 items-baseline'>
        <Search className='hidden lg:flex' />
        <UserMenu className='hidden md:flex' />
        <SideNav />
      </div>
    </nav>
  );
};

export default Navbar;
