'use client';

import styles from './adminUsers.module.css';
import { deleteUser } from '@/lib/action';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Trash, MoreHorizontal, PenLine, CalendarDays } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from '@/components/ui/hover-card';

const AdminSingleUser = ({ user }) => {
    const createdAt = new Date(user.created_at).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
    });
    return (
        <>
            <div className={`${styles.user} p-4 cursor-pointer`}>
                <HoverCard className={styles.user}>
                    <HoverCardTrigger asChild>
                        <div className={styles.detail}>
                            <Avatar className="border border-[#3280f6]">
                                <AvatarImage
                                    src={user.avatar || '/noAvatar.png'}
                                    alt={user.username}
                                />
                                <AvatarFallback>NC</AvatarFallback>
                            </Avatar>
                            {/* <span className={styles.userTitle}>{user.username}</span> */}
                            <span className={styles.userTitle}>
                                {user.username}
                            </span>
                        </div>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-80">
                        <div className="flex justify-between space-x-4">
                            <Avatar>
                                <AvatarImage
                                    src={user.avatar || '/noAvatar.png'}
                                    alt={user.username}
                                />
                                <AvatarFallback>NC</AvatarFallback>
                            </Avatar>
                            <div className="space-y-1">
                                <h4 className="text-sm font-semibold text-[#3280f6]">
                                    {user.username}
                                </h4>
                                <p className="text-sm">
                                    The React Framework – created and maintained
                                    by @vercel.
                                </p>
                                <div className="flex items-center pt-2">
                                    <CalendarDays className="mr-2 h-4 w-4 opacity-70" />{' '}
                                    {/* show month date */}
                                    <span className="text-xs text-muted-foreground">
                                        Joined {createdAt}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </HoverCardContent>
                </HoverCard>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={async () => {
                                await deleteUser({ id: user.id });
                                toast.success('User deleted successfully');
                            }}
                        >
                            <Trash className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>

                        <DropdownMenuItem
                            onClick={async () => {
                                const res = await deleteUser({ id: user.id });
                                if (res.error) {
                                    toast.error(res.error);
                                } else {
                                    toast.success(res.result.message);
                                }
                            }}
                        >
                            <PenLine className="mr-2 h-4 w-4" /> Update
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <Separator className="my-2" />
        </>
    );
};

export default AdminSingleUser;
