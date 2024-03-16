import Image from 'next/image';
import Link from 'next/link';

const PostCard = ({ post }) => {
    const date = new Date(post.created_at).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
    });
    return (
        <>
            <div className="w-full px-4 md:w-1/2 lg:w-1/3">
                <div className="mb-10 w-full">
                    <div className="mb-8 overflow-hidden rounded">
                        <Image
                            src={post.thumbnail}
                            alt={post.title}
                            className="w-full"
                            width={500}
                            height={500}
                        />
                    </div>
                    <div>
                        {date && (
                            <span className="mb-5 inline-block rounded bg-[#3280f6] px-4 py-1 text-center text-xs font-semibold leading-loose text-white">
                                {date}
                            </span>
                        )}
                        <h3>
                            <Link
                                href={`/blog/${post.slug}`}
                                className="mb-4 inline-block text-xl font-semibold text-dark hover:text-[#3280f6] dark:text-white sm:text-2xl lg:text-xl xl:text-2xl"
                            >
                                {post.title}
                            </Link>
                        </h3>
                        <p className="text-base text-body-color dark:text-dark-6">
                            {post.description}
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PostCard;
