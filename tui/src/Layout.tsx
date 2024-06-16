import { Link, Outlet } from 'react-router-dom';
import { Scroll, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button.tsx';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu.tsx';
import { env } from '$env';
import { Toaster } from '@/components/ui/toaster.tsx';
import { Card, CardDescription, CardHeader } from '@/components/ui/card.tsx';

export function Layout() {
  return (
    <>
      <div className="grid min-h-screen w-full">
        <div className="h-full max-h-screen w-full flex-grow flex-col">
          <header className="flex h-14 flex-shrink-0 items-center justify-between gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
            <div className="flex h-14 items-center gap-4 border-b lg:h-[60px]">
              <Link to="/" className="flex items-center gap-2 font-semibold">
                <Scroll className="h-6 w-6" />
                <span className="">{env.PUBLIC_APP_NAME}</span>
              </Link>
              <div className="flex h-full items-center">
                <Card>
                  <CardHeader className="px-3 py-1">
                    <CardDescription className="text-center">{env.PUBLIC_VERSION}</CardDescription>
                  </CardHeader>
                </Card>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" size="icon" className="rounded-full">
                  <Settings className="h-5 w-5" />
                  <span className="sr-only">Toggle settings</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem disabled={true}>Settings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem disabled={true}>Support</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </header>
          <main className="relative flex min-h-0 flex-grow overflow-hidden">
            <div className="h-full w-full overflow-y-auto p-4">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
      <Toaster />
    </>
  );
}
