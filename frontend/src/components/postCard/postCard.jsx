import Image from 'next/image';
import Link from 'next/link';

const PostCard = ({ post }) => {
    const createdAt = new Date(post.created_at);
    const month = createdAt.toLocaleString('default', { month: 'long' });
    const date = new Date(post.created_at).getDate();
    console.log(post);
    return (
        <div
            className="wow fadeInUp relative overflow-hidden"
            data-wow-delay=".1s"
        >
            <div className="overflow-hidden">
                <Link href={`/blog/${post.slug}`}>
                    <div className="relative h-[218px] w-full">
                        <Image
                            className="rounded-md"
                            src={post.thumbnail}
                            alt={post.title}
                            fill
                        />
                        <div className="absolute right-0 top-0 mr-3 mt-3 flex h-[75px] w-[75px] flex-col items-center justify-center rounded-full px-4 text-sm transition duration-500 ease-in-out dark:text-white dark:bg-black border border-black dark:border-white bg-white">
                            <span className="font-bold">{date}</span>
                            <small>{month}</small>
                        </div>
                    </div>
                </Link>
                <div className="py-4">
                    <Link
                        href={`/blog/${post.slug}`}
                        className="inline-block text-xl font-semibold uppercase transition ease-in-out duration-300"
                    >
                        {post.title}
                    </Link>
                    <p className="text-md text-justify font-light italic text-gray-600">
                        {post.description?.length > 150
                            ? `${post.description?.substring(0, 150)}...`
                            : post.description}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PostCard;
