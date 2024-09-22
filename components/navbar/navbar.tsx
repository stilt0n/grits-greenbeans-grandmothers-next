import { Search } from './search.client';
import { UserMenu } from './user-menu.client';

const Navbar = () => {
  return (
    <nav className='flex flex-row'>
      <h1 className='text-3xl'>Grits Greenbeans and Grandmothers</h1>
      <Search />
      <UserMenu />
    </nav>
  );
};

export default Navbar;
