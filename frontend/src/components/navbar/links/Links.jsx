'use client';

// import styles from './links.module.css';
import NavLink from './navLink/navLink';
// import { useState } from 'react';
// import Image from 'next/image';
import { logout } from '@/lib/action';
import { Button } from '@/components/ui/button';
import { LogOut, LogIn } from 'lucide-react';
import DropdownTheme from '@/components/themeProvider/dropdownTheme';
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuList,
} from '@/components/ui/navigation-menu';
import Link from 'next/link';
import { useTransition } from 'react';
import { toast } from 'sonner';

const links = [
    {
        id: 1,
        title: 'About',
        path: '/',
    },
    // {
    //     id: 2,
    //     title: 'About',
    //     path: '/about',
    // },
    // {
    //     id: 3,
    //     title: 'Contact',
    //     path: '/contact',
    // },
    {
        id: 4,
        title: 'Projects',
        path: '/project',
    },
    {
        id: 5,
        title: 'Blogs',
        path: '/blog',
    },
];

const Links = ({ isAuthenticated, isAdmin }) => {
    // const [open, setOpen] = useState(false);
    const [isPending, startTransition] = useTransition();

    const handleLogout = async () => {
        startTransition(async () => {
            await logout();
        });
        toast.success('You have been logged out');
    };

    return (
        <NavigationMenu>
            <NavigationMenuList>
                {links.map((link, i) => (
                    <NavLink key={i} item={link} />
                ))}{' '}
                {isAuthenticated ? (
                    <>
                        {isAdmin && ( // If isAdmin is true, then render the following link
                            <NavLink
                                key={5}
                                item={{ id: 5, title: 'Admin', path: '/admin' }}
                            />
                        )}
                        <NavigationMenuItem key={6}>
                            <form action={handleLogout}>
                                {/* <button className={styles.logout}>Logout</button> */}
                                {/* <NavigationMenuItem> */}
                                <Button
                                    variant="ghost"
                                    type="submit"
                                    disabled={isPending}
                                    className="bg-transparent hover:bg-white/20 hover:text-white"
                                >
                                    <LogOut className="mr-2 h-4 w-4" /> Logout
                                </Button>
                                {/* </NavigationMenuItem> */}
                            </form>
                        </NavigationMenuItem>
                    </>
                ) : (
                    <NavigationMenuItem key={7}>
                        <Button
                            asChild
                            className="bg-transparent hover:bg-white/20 text-white"
                        >
                            <Link href="/login">
                                <LogIn className="mr-2 h-4 w-4" /> Login
                            </Link>
                        </Button>
                    </NavigationMenuItem>
                )}
                <NavigationMenuItem>
                    <DropdownTheme />
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    );

    // return (
    //     <div className={styles.container}>
    //         <div className={styles.links}>
    //             <NavigationMenu>
    //                 <NavigationMenuList>
    //                     {links.map((link, i) => (
    //                         <NavLink key={i} item={link} />
    //                     ))}{' '}
    //                 </NavigationMenuList>
    //             </NavigationMenu>
    //             {session?.user ? (
    //                 <>
    //                     {session.user?.isAdmin && ( // If isAdmin is true, then render the following link
    //                         <NavLink
    //                             item={{ id: 5, title: 'Admin', path: '/admin' }}
    //                         />
    //                     )}
    //                     <form action={handleLogout}>
    //                         {/* <button className={styles.logout}>Logout</button> */}
    //                         <Button>
    //                             Logout <LogOut className="ml-2 h-4 w-4" />
    //                         </Button>
    //                     </form>
    //                 </>
    //             ) : (
    //                 <NavLink item={{ id: 6, title: 'Login', path: '/login' }} />
    //             )}
    //             <div className="ml-10 flex gap-2">
    //                 <Button variant="ghost" size="icon">
    //                     <Github className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
    //                     <Github
    //                         color="#ffffff"
    //                         className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all"
    //                     />
    //                     <span className="sr-only">Github account</span>
    //                 </Button>
    //                 <Button variant="ghost" size="icon">
    //                     <Linkedin className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
    //                     <Linkedin
    //                         color="#ffffff"
    //                         className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all"
    //                     />
    //                     <span className="sr-only">Github account</span>
    //                 </Button>
    //                 <DropdownTheme />
    //             </div>
    //         </div>
    //         <Image
    //             className={styles.menuButton}
    //             src="/menu.png"
    //             alt=""
    //             width={30}
    //             height={30}
    //             onClick={() => setOpen(!open)}
    //         />
    //         {open && (
    //             <div className={styles.mobileLinks}>
    //                 {' '}
    //                 <div className="mb-10">
    //                     <DropdownTheme />
    //                 </div>
    //                 {links.map((link, i) => (
    //                     <NavLink key={i} item={link} />
    //                 ))}{' '}
    //             </div>
    //         )}
    //     </div>
    // );
};

export default Links;
