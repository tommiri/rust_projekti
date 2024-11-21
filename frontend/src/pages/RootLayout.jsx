import SiteHeader from '@/components/SiteHeader';
import { Outlet } from 'react-router-dom';

const RootLayout = () => {
  return (
    <>
      <SiteHeader />
      <Outlet />
    </>
  );
};

export default RootLayout;
