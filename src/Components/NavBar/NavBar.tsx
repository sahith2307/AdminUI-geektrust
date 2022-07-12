import React from "react";
import { CodeIcon } from "@heroicons/react/outline";

type Props = {};

const NavBar = (props: Props) => {
  return (
    <nav className="bg-gray-800 h-16">
      <div
        className="h-full w-1/3 flex content-between pl-20 pt-2 
"
      >
        <CodeIcon className="h-10 w-10  text-sm text-indigo-300" />
        <p className="text-xl p-2 font-bold text-orange-400">Admin UI</p>
      </div>
    </nav>
  );
};

export default NavBar;
