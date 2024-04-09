// MockPost interface
interface MockPost {
    title: string;
    description: string;
    content: string;
    slug: string;
    thumbnail: string;
    word_count: number;
    read_time: number;
    userId: number;
    isPublished: boolean;
}

export default MockPost;
