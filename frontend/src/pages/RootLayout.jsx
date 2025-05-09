import SiteHeader from '@components/Header';
import { Outlet } from 'react-router';

const RootLayout = () => {
  return (
    <>
      <div className="mb-8">
        {' '}
        {/* Add 2rem margin bottom */}
        <SiteHeader />
      </div>
      <Outlet />
    </>
  );
};

export default RootLayout;
