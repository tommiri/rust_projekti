import { Link } from 'react-router';
import { useAuth } from '@/providers/authProvider';

const MainNav = () => {
  const { token } = useAuth();
  return (
    <div className="hidden w-full md:flex">
      <nav className="ml-auto mr-28 flex items-center gap-6 text-white lg:gap-8">
        {!token ? (
          <>
            <div className="hover:underline">
              <Link to="/login">Kirjaudu</Link>
            </div>
            <div className="hover:underline">
              <Link to="/register">Rekisteröidy</Link>
            </div>
          </>
        ) : (
          <div className="hover:underline">
            <Link to="/logout">Kirjaudu ulos</Link>
          </div>
        )}
      </nav>
    </div>
  );
};

export default MainNav;
