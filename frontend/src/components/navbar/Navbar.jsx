import Link from 'next/link';
import Image from 'next/image';
import Links from './links/Links';

const Navbar = async ({ isAuthenticated, isAdmin }) => {
    // const session = await auth();
    return (
        <div className="h-[80px] flex justify-between items-center px-12 bg-[#3280f6] text-white dark:bg-gray-900">
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
