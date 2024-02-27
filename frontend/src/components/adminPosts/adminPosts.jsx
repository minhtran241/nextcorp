// import Image from 'next/image';
import { ListCollapse } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import AdminSinglePost from './adminSinglePost';
import { alovaInstance } from '@/lib/alova';

const getPosts = async () => {
    const res = await alovaInstance
        .Get(`/post`, {
            localCache: null,
        })
        .send();
    if (!res.ok || res.status !== 200) {
        throw new Error('Something went wrong');
    }
    // convert data to json
    const data = await res.json();
    return data;
};

const AdminPosts = async () => {
    const posts = await getPosts();
    return (
        <div>
            {/* <h1>Posts</h1> */}
            <ScrollArea className="rounded-md border h-[540px] border-gray-200">
                <div className="p-4 ">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-semibold">Blogs</h1>
                        <ListCollapse className="h-6 w-6" />
                    </div>
                    {posts.map((post, i) => (
                        <AdminSinglePost post={post} key={i} />
                    ))}
                </div>
            </ScrollArea>
        </div>
    );
};

export default AdminPosts;
