import { Link } from 'react-router-dom';

function MainNav() {
  return (
    <div className="hidden w-full md:flex">
      <nav className="ml-auto mr-28 flex items-center gap-6 text-white lg:gap-8">
        <div className="hover:underline">
          <Link to="/login">Login</Link>
        </div>
        <div className="hover:underline">
          <Link to="/register">Register</Link>
        </div>
      </nav>
    </div>
  );
}

export default MainNav;
