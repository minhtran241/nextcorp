import Image from 'next/image';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Suspense } from 'react';
import Loading from '@/app/loading';

const HeroComponent = () => {
    return (
        <div>
            <div className="shadow-lg transform duration-300 easy-in-out">
                <div className="h-36 overflow-hidden">
                    <Image
                        className="rounded-md w-full object-cover"
                        src="https://nextjs.org/_next/image?url=%2Fdocs%2Fdark%2Fbackground-image.png&w=3840&q=75&dpl=dpl_EYQcSzVmcwA1iK87dHgh1KCHnaqH"
                        alt="background_image"
                        width={1600}
                        height={400}
                    />
                </div>
                <div className="flex justify-center px-5 -mt-12">
                    <Avatar className="h-32 w-32 bg-white dark:bg-black p-2">
                        <AvatarImage
                            className="dark:invert"
                            src="https://static-00.iconduck.com/assets.00/next-js-icon-2048x2048-5dqjgeku.png"
                            alt="minhtran"
                        />
                        <AvatarFallback>NC</AvatarFallback>
                    </Avatar>{' '}
                </div>
                <div className="">
                    <div className="text-center px-14">
                        <h2 className="text-3xl font-semibold">
                            Nextcorp Project
                        </h2>
                        <p className="italic text-sm">Developed by Minh Tran</p>
                        <div className="flex flex-col items-center gap-1 mt-2">
                            <Link
                                href="https://gvsu.edu"
                                className="font-semibold"
                            >
                                Grand Valley State University
                            </Link>
                            <p className="text-gray-600 dark:text-gray-400">
                                B.S in Computer Science, 2025
                            </p>
                        </div>
                    </div>
                    <hr className="mt-6" />
                    <div className="flex bg-gray-50 dark:bg-gray-800">
                        <Link
                            target="_blank"
                            className="text-center w-1/2 py-2 px-4 uppercase hover:bg-black dark:hover:bg-white dark:hover:text-black hover:text-white font-medium transition"
                            href="/contact"
                        >
                            Contact
                        </Link>
                        <div className="border border-gray-200 dark:border-gray-700"></div>
                        <Link
                            target="_blank"
                            className="text-center w-1/2 py-2 px-4 uppercase hover:bg-black dark:hover:bg-white dark:hover:text-black hover:text-white font-medium transition"
                            href="/resume.pdf"
                        >
                            Resume
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Hero = () => {
    return (
        <Suspense fallback={<Loading />}>
            <HeroComponent />
        </Suspense>
    );
};

export default Hero;
