import { Button } from './ui/button';

const mainNavItems = ['A', 'B', 'C'];

const MainNav = () => {
  return (
    <div className="mr-4 hidden gap-2 md:flex">
      {mainNavItems.map((item, index) => (
        <Button key={index} variant="link">
          {item}
        </Button>
      ))}
    </div>
  );
};

export default MainNav;
