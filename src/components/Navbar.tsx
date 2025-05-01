// components/Navbar.tsx
import Link from 'next/link';
import { Button } from './ui/button';
import { ModeToggle } from '@/components/ModeToggle';

export default function Navbar() {
  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold">
          Travel Planner
        </Link>
        
        <div className="flex items-center space-x-4">
          <Link href="/recommended">
            <Button variant="ghost">Recommended</Button>
          </Link>
          <Link href="/create">
            <Button variant="ghost">Create</Button>
          </Link>
          <Link href="/itineraries">
            <Button variant="ghost">My Itineraries</Button>
          </Link>
          <ModeToggle />
        </div>
      </div>
    </nav>
  );
}