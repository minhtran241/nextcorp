import { Suspense } from 'react';
import styles from './admin.module.css';
import AdminPosts from '@/components/adminPosts/adminPosts';
import AdminPostForm from '@/components/adminPostForm/adminPostForm';
import AdminUsers from '@/components/adminUsers/adminUsers';
import AdminUserForm from '@/components/adminUserForm/adminUserForm';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { redirect } from 'next/navigation';

const AdminPage = async () => {
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
    if (!isAuthenticated || !isAdmin) {
        redirect('/login');
    }
    const userId = 1;

    return (
        <div className="container">
            <div className={styles.row}>
                <div className={styles.col}>
                    <Suspense fallback={<div>Loading...</div>}>
                        <AdminPosts />
                    </Suspense>
                </div>
                <div className={styles.col}>
                    <AdminPostForm userId={userId} />
                </div>
            </div>
            <div className={styles.row}>
                <div className={styles.col}>
                    <Suspense fallback={<div>Loading...</div>}>
                        <AdminUsers />
                    </Suspense>
                </div>
                <div className={styles.col}>
                    <AdminUserForm />
                </div>
            </div>
        </div>
    );
};

export default AdminPage;
