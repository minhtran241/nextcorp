'use client';

import styles from './adminPosts.module.css';
import { deletePost } from '@/lib/action';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Trash, PenLine, MoreHorizontal, CalendarDays } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import Link from 'next/link';
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from '@/components/ui/hover-card';

const AdminSinglePost = ({ post }) => {
    const createdAt = new Date(post.created_at).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
    });
    return (
        <div>
            <div
                className={`${styles.post} hover:bg-[#0033A0] hover:text-white hover:rounded-md hover:shadow-md p-4 dark:hover:bg-white dark:hover:text-black`}
            >
                <HoverCard className={styles.user}>
                    <HoverCardTrigger asChild>
                        <div className={styles.detail}>
                            <Avatar className="border border-[#0033A0] dark:border-white">
                                <AvatarImage
                                    src={post.thumbnail || '/noAvatar.png'}
                                    alt={post.slug}
                                />
                                <AvatarFallback>NC</AvatarFallback>
                            </Avatar>
                            <span className={styles.postTitle}>
                                {post.title}
                            </span>
                        </div>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-80">
                        <div className="flex justify-between space-x-4">
                            <Avatar>
                                <AvatarImage
                                    src={post.thumbnail || '/noAvatar.png'}
                                    alt={post.slug}
                                />
                                <AvatarFallback>VC</AvatarFallback>
                            </Avatar>
                            <div className="space-y-1">
                                <Link
                                    className="text-sm font-semibold text-[#0033A0] dark:text-blue-600"
                                    href={`/blog/${post.slug}`}
                                >
                                    {post.title}
                                </Link>
                                <p className="text-sm">{post.description}</p>
                                <div className="flex items-center pt-2">
                                    <CalendarDays className="mr-2 h-4 w-4 opacity-70" />{' '}
                                    {/* show month date */}
                                    <span className="text-xs text-muted-foreground">
                                        Created {createdAt}
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
                                const res = await deletePost({ id: post.id });
                                if (res.error) {
                                    toast.error(res.error);
                                } else {
                                    toast.success(res.result.message);
                                }
                            }}
                        >
                            <Trash className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>

                        <DropdownMenuItem
                            // fill all fields in the admin post form from the selected post
                            onClick={() => {
                                // fill all fields in the admin post form from the selected post
                                document.getElementById('title').value =
                                    post.title;
                                document.getElementById('desc').value =
                                    post.desc;
                                document.getElementById('img').value = post.img;
                            }}
                        >
                            <PenLine className="mr-2 h-4 w-4" /> Update
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <Separator className="my-2" />
        </div>
    );
};

export default AdminSinglePost;
