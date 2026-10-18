import { usePage } from '@inertiajs/react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useInitials } from '@/hooks/use-initials';
import type { User } from '@/types';

type AuthUser = User & {
    firstName?: string;
    idUser?: number;
    photoId?: string | null;
    avatar?: string | null;
    avatar_url?: string | null;
    profile_photo_url?: string | null;
};

type PageProps = {
    auth: {
        user: AuthUser;
    };
};

export function UserInfo({
    user,
    showEmail = false,
}: {
    user: User;
    showEmail?: boolean;
}) {
    const getInitials = useInitials();

    const { auth } = usePage<PageProps>().props;

    const userPhoto =
        auth.user.avatar || auth.user.avatar_url || auth.user.profile_photo_url;

    const getAvatarUrl = (path?: string | null) => {
        if (!path) return undefined;
        if (
            path.startsWith('http://') ||
            path.startsWith('https://') ||
            path.startsWith('data:')
        ) {
            return path;
        }
        return path.startsWith('/') ? path : `/storage/${path}`;
    };

    const avatarSrc = userPhoto
        ? getAvatarUrl(userPhoto)
                : auth.user.photoId && auth.user.idUser
                    ? `/users/${auth.user.idUser}/avatar`
          : undefined;

    return (
        <>
            <Avatar className="h-8 w-8 overflow-hidden rounded-full">
                <AvatarImage
                    src={avatarSrc}
                    alt={auth.user.name}
                    className="object-cover"
                />
                <AvatarFallback className="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                    {getInitials(user.name)}
                </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                {showEmail && (
                    <span className="truncate text-xs text-muted-foreground">
                        {user.email}
                    </span>
                )}
            </div>
        </>
    );
}
