import MainNav from './MainNav';

const SiteHeader = () => {
  return (
    <header className="w-full border-b">
      <div className="flex h-8 items-center px-4"></div>
      <MainNav />
    </header>
  );
};

export default SiteHeader;
