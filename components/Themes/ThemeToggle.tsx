import React, { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { LineMdSunRisingLoop } from '@/components/Icons/Sun';
import { LineMdMoonRisingAltLoop } from '@/components/Icons/Moon';

const ThemeToggle = () => {
  const { setTheme, resolvedTheme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
  }, []);

  if (!isLoading) {
    return (
      <Button
        variant={'ghost'}
        className="size-10"
      >
        <LineMdMoonRisingAltLoop />
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="size-10"
        >
          {resolvedTheme === 'dark' ? (
            <LineMdSunRisingLoop />
          ) : (
            <LineMdMoonRisingAltLoop />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Temas</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => setTheme('light')}>
            <LineMdSunRisingLoop className="mr-2" />
            Modo Claro
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme('dark')}>
            <LineMdMoonRisingAltLoop className="mr-2" />
            Modo Oscuro
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ThemeToggle;
