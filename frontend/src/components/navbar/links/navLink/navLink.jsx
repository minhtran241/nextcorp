'use client';

import Link from 'next/link';
import {
    NavigationMenuItem,
    NavigationMenuLink,
    navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { usePathname } from 'next/navigation';

// how about /blog/slugs

const NavLink = ({ item }) => {
    const pathName = usePathname();

    // Check if the current path is subpath of the item.path (e.g. /blog/slugs) but not the home page
    // const isSubPath =
    //     item.title === 'Blog' &&
    //     pathName !== item.path &&
    //     pathName.startsWith(item.path);

    return (
        // <Link
        //     href={item.path}
        //     className={`${
        //         styles.container
        //     } hover:bg-[#3280f6] hover:text-white dark:hover:bg-white dark:hover:text-black ${
        //         (pathName === item.path || isSubPath) &&
        //         'bg-[#3280f6] text-white dark:bg-white dark:text-black'
        //     }`}
        // >
        //     {item.title}
        // </Link>
        <NavigationMenuItem>
            <Link href={item.path} legacyBehavior passHref>
                {/* backgroud blur when hover */}
                <NavigationMenuLink
                    className={`${navigationMenuTriggerStyle()} bg-transparent text-white hover:bg-white/20 hover:text-white
					${pathName === item.path && 'bg-white/20'}
					`}
                >
                    {item.title}
                </NavigationMenuLink>
            </Link>
        </NavigationMenuItem>
    );
};

export default NavLink;
