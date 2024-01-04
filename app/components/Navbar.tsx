import React from "react";
import ThemeToggle from "./ThemeToggle";
import Link from "next/link";

const Navbar = () => {
  return (
    <div className="navbar bg-base-300 mb-7 sticky top-0 z-50 shadow-md">
      <Link className="flex-1" href="/">
        <button className="btn btn-ghost text-xl" >Trivia App</button>
      </Link>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          <li>
            <ThemeToggle />
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
