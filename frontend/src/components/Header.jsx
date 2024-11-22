import MainNav from '@components/MainNav';
import MobileNav from '@components/MobileNav';

export default function Header() {
  return (
    <header className="sticky top-0 w-full border-b bg-slate-900">
      <div className="flex h-16 items-center justify-between">
        {/* Desktop */}
        <MainNav />
        {/* Mobile */}
        <MobileNav />
      </div>
    </header>
  );
}
