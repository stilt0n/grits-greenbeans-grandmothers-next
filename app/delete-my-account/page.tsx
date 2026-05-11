import type { Metadata } from 'next';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

const DeleteMyAccount = () => (
  <div className='prose prose-zinc rendered-recipe bg-background mx-auto px-6 min-h-full -mt-4 pt-4 border-x border-border'>
    <h1>How to delete your account</h1>
    <p>
      Grits, Greenbeans and Grandmothers only uses your account for login
      purposes. But if you wish to delete your account for whatever reason
      we&apos;ve got you covered.
      <br />
      <br />
      To delete your account:
    </p>
    <ul className='mt-4'>
      <li>Make sure you are signed in</li>
      <li>Click your avatar in the upper right of the page</li>
      <li>Click &quot;manage account&quot;</li>
      <li>Click &quot;security&quot; in the popup side menu</li>
      <li>Click &quot;delete account&quot;</li>
    </ul>
  </div>
);

export default DeleteMyAccount;
