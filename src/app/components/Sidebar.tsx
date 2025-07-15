"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

const Sidebar = () => {
  const pathname = usePathname();
  const { data: session } = useSession();

  const navLinks = [
    { href: "/dashboard", label: "Dashboard" },
    // { href: "/attendance", label: "Attendance" },
    { href: "/students", label: "Students" },
    { href: "/sections", label: "Sections" },
    // { href: "/grades", label: "Grades" },
    // { href: "/settings", label: "Settings" },
  ];

  return (
    <aside className="w-64 bg-blue-800 text-white flex flex-col p-4 h-screen">
      <div className="flex items-center justify-center h-16 mb-8">
        <h1 className="text-2xl font-bold">Owl</h1>
      </div>
      <nav className="flex-1">
        <ul>
          {navLinks.map((link) => (
            <li key={link.href} className="mb-2">
              <Link
                href={link.href}
                className={`block p-2 rounded-md transition-colors duration-200 ${
                  pathname === link.href
                    ? "bg-white font-semibold text-blue-800"
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
  );
};

export default Sidebar;
