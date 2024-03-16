import PostCard from '@/components/postCard/postCard';
import { alovaInstance } from '@/lib/alova';

// * Fetch data from API
const getPosts = async () => {
    const res = await alovaInstance
        .Get('/post', {
            localCache: null,
        })
        .send();
    if (!res.ok) {
        throw new Error('Something went wrong');
    }
    // const data = await res.json();
    // Convert body to an array of JSON objects
    const data = await res.json();
    return data;
};

// * Fetch data from local JSON
// const DATA_ATTRS_DIR = path.join(process.cwd(), 'data', 'blog');
// const DATA_ATTRS_FILE = path.join(DATA_ATTRS_DIR, 'blogs.json');
// // * Fetch projects from file system
// const getPosts = async (limit) => {
//     try {
//         // Read project data from JSON file
//         const projectsData = await fs.readFile(
//             path.join(DATA_ATTRS_FILE),
//             'utf-8'
//         );
//         const projects = JSON.parse(projectsData);
//         return projects.slice(0, limit);
//     } catch (error) {
//         console.error('Error fetching projects:', error);
//         throw new Error('Failed to fetch projects');
//     }
// };

const BlogPage = async () => {
    const posts = await getPosts();
    return (
        <div className="container">
            <div className="-mx-4 flex flex-wrap">
                {posts.map((post, i) => (
                    <div className="w-full" key={i}>
                        <PostCard post={post} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BlogPage;
