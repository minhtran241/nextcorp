import LoginForm from '@/components/loginForm/loginForm';
import { Github, Mail } from 'lucide-react';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { redirect } from 'next/navigation';
import Image from 'next/image';

const LoginPage = async () => {
    const cookieStore = cookies();
    const accessToken = cookieStore.get('access_token')?.value;

    let isAuthenticated = false;

    if (accessToken) {
        try {
            jwt.verify(accessToken, process.env.NEXT_PUBLIC_JWT_SECRET);
            isAuthenticated = true;
        } catch (error) {
            console.error(error);
        }
    }

    if (isAuthenticated) {
        redirect('/');
    }

    return (
        <div className="flex items-center justify-center h-[70vh]">
            <div className="flex flex-col items-center justify-center gap-4 w-[500px] p-[50px] dark:border dark:border-gray-700 dark:text-white rounded-lg shadow-lg">
                {/* logo image */}
                <div className="flex items-center justify-center pb-4">
                    <Image
                        src="/logo.svg"
                        alt="logo"
                        width={150}
                        height={50}
                        className="dark:invert"
                    />
                </div>

                <LoginForm />
                {/* or */}
                <div className="flex items-center justify-center my-4 w-full">
                    <span className="border-b w-1/4"></span>
                    <span className="mx-2">or connect with</span>
                    <span className="border-b w-1/4"></span>
                </div>
                <div className="flex flex-row items-center justify-center gap-4 w-full">
                    <form>
                        <button
                            className="bg-black hover:bg-gray-900 rounded-full p-2 cursor-pointer"
                            style={{ transition: 'all 0.3s' }}
                            type="submit"
                        >
                            <Github className="h-5 w-5 text-white" />
                        </button>
                    </form>
                    <form>
                        <button
                            className="bg-red-500 hover:bg-red-600 rounded-full p-2 cursor-pointer"
                            style={{ transition: 'all 0.3s' }}
                            type="submit"
                        >
                            <Mail className="h-5 w-5 text-white" />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
