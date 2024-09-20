import { Search } from './search.client';
import { SignInAvatar } from './sign-in-avatar.client';

const Navbar = () => {
  <nav className='flex flex-row'>
    <h1 className='text-3xl'>Grits Greenbeans and Grandmothers</h1>
    <Search />
    <SignInAvatar />
  </nav>;
};

export default Navbar;
