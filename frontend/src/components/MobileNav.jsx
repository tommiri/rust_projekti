import { Link } from 'react-router-dom';

import { AlignJustify } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

function MobileNav() {
  return (
    <div className="md:hidden">
      <Sheet>
        <SheetTrigger className="ml-2 bg-slate-100">
          <AlignJustify />
        </SheetTrigger>
        <SheetContent side="left">
          <nav className="mt-6 flex flex-col gap-3 lg:gap-4">
            <div className="hover:ring-2 hover:ring-slate-900 hover:ring-offset-4 focus:ring-2 focus:ring-slate-900 focus:ring-offset-4">
              <Link to="/login">Login</Link>
            </div>
            <div className="hover:ring-2 hover:ring-slate-900 hover:ring-offset-4 focus:ring-2 focus:ring-slate-900 focus:ring-offset-4">
              <Link to="/register">Register</Link>
            </div>
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default MobileNav;
