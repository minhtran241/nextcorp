// Type definition for Post
interface Post {
    id: number;
    title: string;
    description: string;
    content: string;
    thumbnail: string;
    slug: string;
    word_count: number;
    read_time: number;
    view_count: number;
    user_id: number;
    is_published: boolean;
    created_at: Date;
    updated_at: Date;
}

export default Post;
