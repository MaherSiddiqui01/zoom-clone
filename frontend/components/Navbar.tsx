"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <header className="w-full border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-[#2D8CFF] text-white font-bold">
            Z
          </div>
          <span className="text-lg font-semibold text-gray-800">Zoom</span>
        </Link>

        <nav className="hidden gap-6 text-sm font-medium text-gray-600 md:flex">
          <Link href="/" className="hover:text-[#2D8CFF]">
            Home
          </Link>
          <Link href="/join" className="hover:text-[#2D8CFF]">
            Join
          </Link>
          <Link href="/schedule" className="hover:text-[#2D8CFF]">
            Schedule
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <button className="rounded-full p-1 text-gray-500 hover:bg-gray-100" title="Settings">
            {/* simple gear icon, no external icon lib needed */}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
              <path
                fillRule="evenodd"
                d="M11.078 2.25c-.917 0-1.699.663-1.85 1.567L9.05 4.889c-.02.12-.115.26-.297.348a7.493 7.493 0 0 0-.986.57c-.166.115-.334.126-.45.083l-1.166-.429a1.875 1.875 0 0 0-2.282.837l-.922 1.597a1.875 1.875 0 0 0 .432 2.385l.84.692c.095.078.17.229.154.43a7.598 7.598 0 0 0 0 1.139c.015.2-.059.352-.153.43l-.841.692a1.875 1.875 0 0 0-.432 2.385l.922 1.597a1.875 1.875 0 0 0 2.282.837l1.165-.43c.117-.043.285-.032.451.084.313.214.648.4.986.57.182.087.277.226.297.346l.178 1.072c.151.904.933 1.567 1.85 1.567h1.844c.916 0 1.699-.663 1.85-1.567l.178-1.072c.02-.12.114-.26.297-.346.338-.17.673-.356.985-.57.167-.116.335-.127.452-.084l1.165.43a1.875 1.875 0 0 0 2.282-.837l.923-1.597a1.875 1.875 0 0 0-.432-2.385l-.84-.692c-.095-.078-.17-.23-.154-.43a7.614 7.614 0 0 0 0-1.139c-.016-.2.059-.352.153-.43l.84-.692c.708-.582.891-1.59.433-2.385l-.922-1.597a1.875 1.875 0 0 0-2.282-.837l-1.166.429c-.116.043-.284.032-.45-.083a7.49 7.49 0 0 0-.986-.57c-.183-.087-.277-.227-.297-.348l-.179-1.072a1.875 1.875 0 0 0-1.85-1.567h-1.843ZM12 15.75a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5Z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-300 text-sm font-semibold text-gray-700">
            DU
          </div>
        </div>
      </div>
    </header>
  );
}
