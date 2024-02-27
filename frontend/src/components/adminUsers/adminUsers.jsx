import styles from './adminUsers.module.css';
import { Users } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import AdminSingleUser from './adminSingleUser';
import { cookies } from 'next/headers';
import { alovaInstance } from '@/lib/alova';

const getUsers = async () => {
    // Get token from cookies
    const cookieStore = cookies();
    const accessToken = cookieStore.get('access_token')?.value;
    const res = await alovaInstance
        .Get(`/user`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            localCache: null,
        })
        .send();
    const data = await res.json();
    return data;
};

const AdminUsers = async () => {
    const users = await getUsers();
    return (
        <div className={styles.container}>
            <ScrollArea className="rounded-md h-[540px] border">
                <div className="p-4 ">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-semibold">Users</h1>
                        <Users className="h-6 w-6" />
                    </div>
                    {users.map((user, i) => (
                        <AdminSingleUser user={user} key={i} />
                    ))}
                </div>
            </ScrollArea>
        </div>
    );
};

export default AdminUsers;
