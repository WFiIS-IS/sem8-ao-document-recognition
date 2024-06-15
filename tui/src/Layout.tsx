import { useAuth } from 'oidc-react';
import { cloneElement, useEffect, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Calendar, CircleUser } from 'lucide-react';
import { Card, CardDescription, CardHeader } from '@/components/ui/card.tsx';
import { Button } from '@/components/ui/button.tsx';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu.tsx';
import { env } from '$env';
import { pathToTitleArray, pathToTitleMap } from '@/routes.tsx';
import { cn } from '@/lib/utils.ts';
import { Toaster } from '@/components/ui/toaster.tsx';
import { ActivityPlayButton } from '@/shared/components/ActivityPlayButton.tsx';
import { useUser } from '@/api/apollo/hooks/useUser.ts';

export function Layout() {
  const [authenticated, setIsAuthenticated] = useState(false);
  const auth = useAuth();
  const location = useLocation();

  const { data: user } = useUser();

  useEffect(() => {
    if (auth.userData?.access_token && user) setIsAuthenticated(true);
  }, [auth.userData?.access_token, user]);

  if (!authenticated) return <div className="relative flex h-screen flex-col"></div>;

  return (
    <>
      <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
        <div className="hidden border-r bg-muted/40 md:block">
          <div className="flex h-full max-h-screen flex-col gap-2">
            <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
              <Link to="/" className="flex items-center gap-2 font-semibold">
                <Calendar className="h-6 w-6" />
                <span className="">Chrono Dash</span>
              </Link>
            </div>
            <div className="flex-1">
              <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                {pathToTitleArray.map(({ path, title, icon }) => (
                  <Link
                    key={path}
                    to={path}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary',
                      location.pathname === path
                        ? 'bg-muted text-foreground'
                        : 'text-muted-foreground'
                    )}>
                    {cloneElement(icon, {
                      className: cn(icon.props.className, 'h-4 w-4')
                    })}
                    {title}
                  </Link>
                ))}
              </nav>
            </div>
            <div className="mt-auto p-4">
              <Card x-chunk="dashboard-02-chunk-0">
                <CardHeader className="p-2 pt-0 md:p-4">
                  <CardDescription className="text-center">
                    Chrono Dash. Version: {env.PUBLIC_VERSION}
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </div>
        <div className="flex h-full max-h-screen flex-col">
          <header className="flex h-14 flex-shrink-0 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
            <div className="w-full flex-1">
              <div className="flex items-center">
                <h1 className="font-semibold md:text-xl">
                  {pathToTitleMap.get(location.pathname) || location.pathname}
                </h1>
              </div>
            </div>
            <ActivityPlayButton />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" size="icon" className="rounded-full">
                  <CircleUser className="h-5 w-5" />
                  <span className="sr-only">Toggle user menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{auth.userData?.profile?.nickname}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem disabled={true}>Settings</DropdownMenuItem>
                <DropdownMenuItem disabled={true}>Support</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link to="/logout">Logout</Link>
                </DropdownMenuItem>
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