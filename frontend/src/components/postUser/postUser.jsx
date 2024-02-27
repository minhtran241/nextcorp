import styles from './postUser.module.css';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { alovaInstance } from '@/lib/alova';

const getUser = async (userId) => {
    const res = await alovaInstance
        .Get(`/user/${userId}`, {
            localCache: null,
        })
        .send();
    if (!res.ok || res.status !== 200) {
        throw new Error('Something went wrong');
    }
    const data = await res.json();
    return data;
};

const PostUser = async ({ userId }) => {
    const user = await getUser(userId);
    return (
        <div className={styles.container}>
            {/* <Image
                className={styles.avatar}
                src={user.img || '/noavatar.png'}
                alt=""
                width={50}
                height={50}
            /> */}
            <Avatar>
                <AvatarImage
                    src={user.avatar || '/noavatar.png'}
                    alt="@shadcn"
                />
                <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className={styles.texts}>
                <span className={styles.title}>Author</span>
                <span className={styles.username}>{user.username}</span>
            </div>
        </div>
    );
};

export default PostUser;
