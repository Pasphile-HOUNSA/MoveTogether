import { Link, usePage } from '@inertiajs/react';
import { LayoutGrid, Menu, Search, HomeIcon, User as UserIcon } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import AppLogoIcon from '@/components/app-logo-icon';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { UserMenuContent } from '@/components/user-menu-content';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { useInitials } from '@/hooks/use-initials';
import { cn, toUrl } from '@/lib/utils';
import { dashboard } from '@/routes';
import type { BreadcrumbItem, NavItem, User } from '@/types';

type Props = {
    breadcrumbs?: BreadcrumbItem[];
};

const mainNavItems: NavItem[] = [
    {
        title: 'Acceuil',
        href: '/home',
        icon: HomeIcon,
    },
     {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
];

const rightNavItems: NavItem[] = [];

export function AppHeader({ breadcrumbs = [] }: Props) {
    const page = usePage<{
        auth: { user: User | null };
        name?: string;
    }>();
    const { auth } = page.props;
    const getInitials = useInitials();
    const { isCurrentUrl } = useCurrentUrl();

    const authUser = auth.user as (User & {
        firstName?: string;
        idUser?: number;
        photoId?: string | null;
        avatar?: string | null;
        avatar_url?: string | null;
        profile_photo_url?: string | null;
    }) | null;

    const userPhoto = authUser?.avatar || authUser?.avatar_url || authUser?.profile_photo_url;

    const getAvatarUrl = (path?: string) => {
        if (!path) return undefined;
        if (
            path.startsWith('http://') ||
            path.startsWith('https://') ||
            path.startsWith('data:')
        ) {
            return path;
        }
        return path.startsWith('/') ? path : undefined;
    };

    const avatarSrc = userPhoto
        ? getAvatarUrl(userPhoto)
        : authUser?.photoId && authUser.firstName
          ? `/users/${authUser.idUser}/avatar`
          : undefined;

    return (
        <>
            <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/80">
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                    {/* Gauche : Logo & Menu Mobile */}
                    <div className="flex items-center gap-3">
                        {/* Mobile Menu Trigger */}
                        <div className="lg:hidden">
                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-9 w-9 text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                                    >
                                        <Menu className="h-5 w-5" />
                                    </Button>
                                </SheetTrigger>
                                <SheetContent
                                    side="left"
                                    className="flex h-full w-64 flex-col justify-between border-r border-slate-200 bg-white text-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
                                >
                                    <SheetTitle className="sr-only">
                                        Navigation menu
                                    </SheetTitle>
                                    <SheetHeader className="flex justify-start text-left">
                                        <AppLogoIcon className="h-6 w-6 fill-current  text-slate-900 dark:text-white" />
                                    </SheetHeader>
                                    <div className="flex h-full flex-1 flex-col space-y-4 p-4">
                                        <div className="flex h-full flex-col justify-between text-sm">
                                            <div className="flex flex-col space-y-2">
                                                {mainNavItems.map((item) => (
                                                    <Link
                                                        key={item.title}
                                                        href={item.href}
                                                        className={cn(
                                                            'flex items-center space-x-2 rounded-xl px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-[#1D63ED] dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-[#1D63ED]',
                                                            isCurrentUrl(item.href) &&
                                                                'bg-slate-100 font-semibold text-[#1D63ED] dark:bg-slate-800 dark:text-[#1D63ED]'
                                                        )}
                                                    >
                                                        {item.icon && (
                                                            <item.icon className="h-5 w-5" />
                                                        )}
                                                        <span>{item.title}</span>
                                                    </Link>
                                                ))}
                                            </div>

                                            <div className="flex flex-col space-y-2">
                                                {rightNavItems.map((item) => (
                                                    <a
                                                        key={item.title}
                                                        href={toUrl(item.href)}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center space-x-2 rounded-xl px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-[#1D63ED] dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-[#1D63ED]"
                                                    >
                                                        {item.icon && (
                                                            <item.icon className="h-5 w-5" />
                                                        )}
                                                        <span>{item.title}</span>
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </SheetContent>
                            </Sheet>
                        </div>

                        {/* Logo */}
                        <Link
                            href={dashboard()}
                            prefetch
                            className="flex items-center gap-2"
                        >
                            <AppLogo />
                        </Link>
                    </div>

                    {/* Centre : Desktop Navigation */}
                    <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 lg:flex dark:text-slate-300">
                        {mainNavItems.map((item) => (
                            <Link
                                key={item.title}
                                href={item.href}
                                className={cn(
                                    'flex items-center gap-2 transition-colors hover:text-[#1D63ED]',
                                    isCurrentUrl(item.href) &&
                                        'font-semibold text-[#1D63ED]'
                                )}
                            >
                                {item.icon && <item.icon className="h-4 w-4" />}
                                <span>{item.title}</span>
                            </Link>
                        ))}
                    </nav>

                    {/* Droite : Actions / Profil Utilisateur */}
                    <div className="flex items-center gap-3">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 text-slate-600 hover:text-[#1D63ED] dark:text-slate-300 dark:hover:text-[#1D63ED]"
                        >
                            <Search className="h-5 w-5" />
                        </Button>

                        {rightNavItems.map((item) => (
                            <Tooltip key={item.title}>
                                <TooltipTrigger>
                                    <a
                                        href={toUrl(item.href)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-slate-600 transition-colors hover:bg-slate-100 hover:text-[#1D63ED] dark:text-slate-300 dark:hover:bg-slate-800"
                                    >
                                        <span className="sr-only">
                                            {item.title}
                                        </span>
                                        {item.icon && (
                                            <item.icon className="h-5 w-5" />
                                        )}
                                    </a>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{item.title}</p>
                                </TooltipContent>
                            </Tooltip>
                        ))}

                        {/* Dropdown Menu Utilisateur */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    className="size-10 rounded-full p-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D63ED]"
                                >
                                    <Avatar className="size-8 overflow-hidden rounded-full border border-slate-200 dark:border-slate-700">
                                        <AvatarImage
                                            src={avatarSrc}
                                            alt={auth.user?.name}
                                            className="object-cover"
                                        />
                                        <AvatarFallback className="rounded-full bg-slate-200 font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                                            {auth.user?.name ? (
                                                getInitials(auth.user.name)
                                            ) : (
                                                <UserIcon className="size-4" />
                                            )}
                                        </AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                className="w-56 rounded-lg border-border bg-popover text-popover-foreground shadow-lg"
                                align="end"
                            >
                                {auth.user && (
                                    <UserMenuContent user={auth.user} />
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </header>

            {/* Fil d'Ariane (Breadcrumbs) */}
            {breadcrumbs.length > 1 && (
                <div className="flex w-full border-b border-slate-200 bg-slate-100/50 dark:border-slate-800 dark:bg-slate-900/50">
                    <div className="mx-auto flex h-10 w-full max-w-7xl items-center justify-start px-4 text-xs text-slate-500 md:px-6 lg:px-8 dark:text-slate-400">
                        <Breadcrumbs breadcrumbs={breadcrumbs} />
                    </div>
                </div>
            )}
        </>
    );
}
