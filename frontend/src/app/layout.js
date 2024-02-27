import './globals.css';
import Navbar from '@/components/navbar/Navbar';
import Footer from '@/components/footer/Footer';
import { Inter as FontSans } from 'next/font/google';
import { cn } from '@/lib/utils';
import { ThemeProvider } from '@/components/themeProvider/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

export const fontSans = FontSans({
    subsets: ['latin'],
    variable: '--font-sans',
});

export const metadata = {
    title: {
        default: 'Nextcorp Homepage',
        template: '%s | Nextcorp',
    },
    description: 'Next.js starter app',
};

export default function RootLayout({ children }) {
    const cookieStore = cookies();
    const accessToken = cookieStore.get('access_token')?.value;
    const role = cookieStore.get('role')?.value;

    let isAuthenticated = false;
    let isAdmin = false;

    if (accessToken) {
        try {
            jwt.verify(accessToken, process.env.NEXT_PUBLIC_JWT_SECRET);
            isAuthenticated = true;
            isAdmin = role === 'admin';
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <html lang="en">
            <body
                className={cn(
                    'min-h-screen bg-background font-sans antialiased',
                    fontSans.variable
                )}
            >
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <div className="sticky top-0 z-50">
                        <Navbar
                            isAuthenticated={isAuthenticated}
                            isAdmin={isAdmin}
                        />
                    </div>
                    <div className="container">
                        {children}

                        <Toaster />
                    </div>
                    <div className="mt-20">
                        <Footer />
                    </div>
                </ThemeProvider>
            </body>
        </html>
    );
}
