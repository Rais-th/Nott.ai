import Link from 'next/link';
import { UserButton } from '@clerk/nextjs';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-sm">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-8">
        <Link href="/" className="flex items-center">
          <span className="bg-gradient-to-r from-[#006400] to-[#008000] bg-clip-text text-2xl font-black tracking-tight text-transparent md:text-3xl">
            Nott AI
          </span>
        </Link>

        <div className="flex items-center gap-6 md:gap-8">
          <div className="hidden items-center gap-6 text-sm font-medium text-gray-600 md:flex md:text-base">
            <Link 
              href="/dashboard" 
              className="transition hover:text-[#006400]"
            >
              Enregistrements
            </Link>
            <Link 
              href="/dashboard/action-items"
              className="transition hover:text-[#006400]"
            >
              Tâches
            </Link>
          </div>
          
          <UserButton
            afterSignOutUrl="/"
            appearance={{
              elements: {
                avatarBox: 'h-8 w-8 md:h-9 md:w-9',
                userButtonPopoverCard: 'border border-gray-200 shadow-lg',
                userButtonTrigger: 'ring-[#006400] hover:ring-2',
              },
              baseTheme: {
                colors: {
                  primary: '#006400',
                },
              },
            }}
          />
        </div>
      </nav>
    </header>
  );
}
