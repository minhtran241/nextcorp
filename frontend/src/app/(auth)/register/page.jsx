import RegisterForm from '@/components/registerForm/registerForm';
import Image from 'next/image';

const RegisterPage = () => {
    return (
        <div className="flex items-center justify-center h-[90vh]">
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
                <RegisterForm />
            </div>
        </div>
    );
};

export default RegisterPage;
