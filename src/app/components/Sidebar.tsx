"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

const Sidebar = () => {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = React.useState(false);

  const navLinks = [
    { href: "/dashboard", label: "Dashboard" },
    // { href: "/attendance", label: "Attendance" },
    { href: "/students", label: "Students" },
    { href: "/sections", label: "Sections" },
    // { href: "/grades", label: "Grades" },
    // { href: "/settings", label: "Settings" },
  ];

  return (
    <>
      <div className="flex justify-between p-6 bg-blue-800 sm:hidden">
        <div className="flex items-center h-full text-yellow-300">
          <h1 className="text-2xl font-bold text-yellow-300">Owl</h1>
        </div>
        <div className="flex items-center">
          <button
            type="button"
            className="rounded-lg sm:hidden text-white dark:text-white cursor-pointer"
            onClick={() => setIsOpen(!isOpen)}
          >
            <Image
              src="/static/menu.svg"
              alt="Menu"
              width={24}
              height={24}
              className="block dark:invert"
            />
          </button>
        </div>
      </div>
      {/* Mobile Sidebar */}
      <aside
        className={`fixed top-0 left-0 w-64 bg-blue-800 text-white flex flex-col p-4 min-h-screen z-40 transition-transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } sm:hidden shadow-lg duration-300`}
      >
        <div className="flex justify-end">
          <button
            type="button"
            aria-label="Close sidebar"
            className="text-white hover:text-yellow-400 p-2 rounded-md focus:outline-none cursor-pointer"
            onClick={() => setIsOpen(false)}
          >
            <Image
              src="/static/close.svg"
              alt="Close"
              width={24}
              height={24}
              className="dark:invert"
            />
          </button>
        </div>
        <div className="flex items-center justify-center h-16 mb-8">
          <h1 className="text-2xl font-bold text-yellow-300">Owl</h1>
        </div>
        <nav className="flex-1">
          <ul>
            {navLinks.map((link) => (
              <li key={link.href} className="mb-2">
                <Link
                  href={link.href}
                  className={`block p-2 rounded-md transition-colors duration-200 ${
                    pathname === link.href
                      ? "bg-yellow-300 font-semibold text-blue-800"
                      : "hover:bg-yellow-300 "
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {session && (
          <div className="mt-auto pt-4 border-t border-white text-center">
            <div className="text-sm text-yellow-300">
              <p className="font-semibold">{session.user?.name || "Teacher"}</p>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="w-full mt-4 bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors duration-200"
            >
              Sign Out
            </button>
          </div>
        )}
      </aside>

      {/* SIDEBAR */}
      <aside className="hidden sm:flex w-64 bg-blue-800 text-white flex-col p-4 min-h-screen z-40 transition-transform -translate-x-full sm:translate-x-0 duration-300">
        <div className="flex items-center justify-center h-16 mb-8">
          <h1 className="text-2xl font-bold text-yellow-300">Owl</h1>
        </div>
        <nav className="flex-1">
          <ul>
            {navLinks.map((link) => (
              <li key={link.href} className="mb-2">
                <Link
                  href={link.href}
                  className={`block p-2 rounded-md transition-colors duration-200 ${
                    pathname === link.href
                      ? "bg-yellow-300 font-semibold text-blue-800"
                      : "hover:bg-yellow-400 "
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {session && (
          <div className="mt-auto pt-4 border-t border-white text-center">
            <div className="text-sm text-yellow-300">
              <p className="font-semibold">{session.user?.name || "Teacher"}</p>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="w-full mt-4 bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors duration-200"
            >
              Sign Out
            </button>
          </div>
        )}
      </aside>
    </>
  );
};

export default Sidebar;
