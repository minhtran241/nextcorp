import Link from 'next/link';
import { Suspense } from 'react';
import Loading from '@/app/loading';
import { Button } from '@/components/ui/button';

const HeroComponent = () => {
    return (
        <div>
            <section className="">
                <div className="mx-auto max-w-screen-xl px-4 py-24 lg:flex lg:h-[45vh] lg:items-center">
                    <div className="mx-auto max-w-3xl text-center">
                        <h1 className="bg-[linear-gradient(to_left_top,rgb(50,128,246)_60%,rgb(99,222,191))] bg-clip-text text-3xl font-bold text-transparent sm:text-5xl">
                            The Automated Data
                            <span className="sm:block">
                                {' '}
                                Movement Platform.{' '}
                            </span>
                        </h1>

                        <p className="mx-auto mt-4 max-w-xl sm:text-xl/relaxed">
                            From small & medium business to big corporation -
                            Nextcorp is the trusted platform to connect data
                            from multiple sources into your data platform
                        </p>

                        <div className="mt-8 flex flex-wrap justify-center gap-4">
                            <Button
                                className="block w-full rounded border border-[#3280f6] bg-[#3280f6] hover:bg-transparent text-white focus:outline-none focus:ring active:text-opacity-75 sm:w-auto"
                                href="#"
                            >
                                Contact or Book a Live Demo
                            </Button>
                        </div>
                    </div>
                </div>
            </section>
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
