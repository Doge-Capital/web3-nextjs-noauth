import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Hamburger from "./ui/Hamburger";
import ConnectWallet from "./ConnectWallet";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";

import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from ".//ui/dropdown-menu";

const Navbar = () => {
  const { setTheme } = useTheme();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="mb-4 flex w-full items-center justify-between px-2.5 pt-3 md:px-6 md:pt-10">
      <div
        onClick={() => {
          setIsSidebarOpen(!isSidebarOpen);
        }}
        className="z-40 flex md:hidden"
      >
        <Hamburger />
      </div>
      <div className="mr-2 flex justify-start text-5xl">
        <a href="/">Title</a>{" "}
        <div className="ml-2 flex justify-start font-koulen  text-xs">beta</div>
      </div>

      {/* sidebar  */}
      <div
        className={`sidebar absolute top-0 z-30 h-full w-[18rem] px-5 pt-20 ${
          isSidebarOpen ? "left-0" : "-left-[18rem]"
        } overflow-y-auto bg-background text-center transition-all md:hidden`}
      >
        <div className="flex w-full flex-col gap-6">
          {isSidebarOpen && <ConnectWallet />}
          <a
            target="_blank"
            className="transform rounded-[5px] border-[2px] px-8 py-2 text-xs text-white transition duration-200"
            href="https://fomosolana.com"
            rel="noopener noreferrer"
          >
            $FOMO
          </a>
        </div>
      </div>

      <div className="hidden w-fit gap-4 md:flex">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTheme("light")}>
              Light
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")}>
              Dark
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")}>
              System
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <ConnectWallet />
      </div>
    </div>
  );
};

export default Navbar;
