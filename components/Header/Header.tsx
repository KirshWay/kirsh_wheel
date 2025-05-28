'use client';

import { LogOut, Menu, User, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { signOut,useSession } from 'next-auth/react';

import { Button } from '@/components/ui/button';

export const Header = () => {
  const { data: session, status } = useSession();

  const handleSignOut = () => {
    signOut({ callbackUrl: '/auth/login' });
  };

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 group">
        <input type="checkbox" id="mobile-menu-toggle" className="sr-only peer" />

        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-3 group/logo">
            <div className="relative w-10 h-10 transition-transform duration-200 group-hover/logo:scale-110 group-hover/logo:rotate-12">
              <Image
                src="/icons/image.png"
                alt="Kirsh Wheel"
                width={40}
                height={40}
                className="object-contain rounded-full"
                priority
              />
            </div>
            <span className="text-xl font-bold text-gray-900 transition-colors duration-200 group-hover/logo:text-[#6d559c]">
              Kirsh Wheel
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-4">
            {status === 'loading' ? (
              <div className="animate-pulse">
                <div className="h-8 w-20 bg-gray-200 rounded" />
              </div>
            ) : session ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-sm text-gray-700">
                  <User className="w-4 h-4" />
                  <span className="font-medium">{session.user.name || session.user.email}</span>
                </div>

                <Button
                  size="sm"
                  onClick={handleSignOut}
                  className="flex items-center space-x-2 transition-all duration-200 hover:bg-red-50 hover:border-red-200 hover:text-red-600"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link href="/auth/login">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="transition-all duration-200 hover:bg-blue-50 hover:text-blue-600"
                  >
                    Login
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button
                    size="sm"
                    className="transition-all duration-200 hover:shadow-md transform hover:-translate-y-0.5"
                  >
                    Register
                  </Button>
                </Link>
              </div>
            )}
          </div>

          <div className="md:hidden">
            <label
              htmlFor="mobile-menu-toggle"
              className="flex items-center justify-center w-10 h-10 cursor-pointer transition-colors duration-200 hover:bg-gray-100 rounded-md"
            >
              <Menu className="w-5 h-5 peer-checked:hidden" />
              <X className="w-5 h-5 hidden peer-checked:block" />
            </label>
          </div>
        </div>

        <div className="md:hidden border-t border-gray-200 max-h-0 overflow-hidden opacity-0 transition-all duration-300 ease-in-out peer-checked:max-h-screen peer-checked:opacity-100 peer-checked:py-4">
          {status === 'loading' ? (
            <div className="animate-pulse px-4">
              <div className="h-8 w-20 bg-gray-200 rounded" />
            </div>
          ) : session ? (
            <div className="px-4 space-y-4">
              <div className="flex items-center space-x-2 text-sm text-gray-700 py-2">
                <User className="w-4 h-4" />
                <span className="font-medium">{session.user.name || session.user.email}</span>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={handleSignOut}
                className="w-full flex items-center justify-center space-x-2 transition-all duration-200 hover:bg-red-50 hover:border-red-200 hover:text-red-600"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </Button>
            </div>
          ) : (
            <div className="px-4 space-y-3">
              <Link href="/auth/login" className="block">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full transition-all duration-200 hover:bg-blue-50 hover:text-blue-600"
                >
                  Login
                </Button>
              </Link>
              <Link href="/auth/register" className="block">
                <Button size="sm" className="w-full transition-all duration-200 hover:shadow-md">
                  Register
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
