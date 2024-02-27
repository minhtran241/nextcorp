// import { auth } from '@/lib/auth';
// import Links from './links/Links';
// import styles from './navbar.module.css';
// import Link from 'next/link';
// import Image from 'next/image';

// const Navbar = async () => {
//     const session = await auth();

//     return (
//         <div className={styles.container}>
//             <Link href="/" className={styles.logo}>
//                 <Image
//                     src="/logo.svg"
//                     alt="logo"
//                     width={180}
//                     height={90}
//                     // fill
//                     className="dark:invert"
//                 />
//                 {/* <p className="text-2xl font-bold uppercase font-mono">
//                     Nextcorp
//                 </p> */}
//             </Link>
//             <div>
//                 <Links session={session} />
//             </div>
//         </div>
//     );
// };

// export default Navbar;

// 'use client';
import Link from 'next/link';
import Image from 'next/image';
import Links from './links/Links';

const Navbar = async ({ isAuthenticated, isAdmin }) => {
    // const session = await auth();
    return (
        <div className="h-[80px] flex justify-between items-center px-12 bg-[#0033A0] text-white dark:bg-gray-900 dark:text-white">
            <Link href="/">
                <Image
                    src="/logo.svg"
                    alt="logo"
                    width={160}
                    height={80}
                    // invert in light mode and not in dark mode
                    className="invert"
                />
            </Link>
            <div>
                <Links isAuthenticated={isAuthenticated} isAdmin={isAdmin} />
            </div>
        </div>
    );
};
export default Navbar;
