import { faker } from '@faker-js/faker';
import MockPost from '~types/MockPost';
import MockUser from '~types/MockUser';

// export const generateMockPosts = (quantity: number): Post[] => {
//     const posts: Post[] = [];
//     if (quantity < 1) {
//         throw new Error('Quantity must be at least 1');
//     }
//     for (let i = 0; i < quantity; i++) {
//         posts.push({
//             id: faker.number.int({ min: 1, max: 100 }),
//             title: faker.lorem.words(3),
//             description: faker.lorem.sentence(),
//             content: faker.lorem.paragraphs(3),
//             slug: faker.lorem.slug(),
//             thumbnail: faker.image.url(),
//             word_count: faker.number.int({ min: 100, max: 1000 }),
//             read_time: faker.number.int({ min: 1, max: 30 }),
//             userId: faker.number.int({ min: 1, max: 2 }),
//             isPublished: faker.datatype.boolean(),
//         });
//     }
//     return posts;
// };

/**
 * generateMockPost function
 *
 * This function generates a mock post object
 *
 * @returns {MockPost} - A mock post object
 */
export const generateMockPost = (): MockPost => {
    return {
        title: faker.lorem.words(3),
        description: faker.lorem.sentence(),
        content: faker.lorem.paragraphs(3),
        slug: faker.lorem.slug(),
        thumbnail: faker.image.url(),
        word_count: faker.number.int({ min: 100, max: 1000 }),
        read_time: faker.number.int({ min: 1, max: 30 }),
        userId: 1,
        isPublished: faker.datatype.boolean(),
    };
};

/**
 * generateMockPostAPIPayload function
 *
 * This function generates a mock post API payload
 *
 * @returns {Object} - A mock post API payload
 */
export const generateMockPostAPIPayload = () => {
    return {
        title: faker.lorem.words(3),
        description: faker.lorem.sentence(),
        content: faker.lorem.paragraphs(3),
        thumbnail: faker.image.url(),
        userId: 1,
        isPublished: faker.datatype.boolean(),
    };
};

/**
 * generateMockUser function
 *
 * This function generates a mock user object
 *
 * @param {boolean} is_admin - A boolean value indicating if the user is an admin
 * @returns {MockUser} - A mock user object
 */
export const generateMockUser = (is_admin: boolean): MockUser => {
    return {
        username: faker.internet.userName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        avatar: faker.image.avatar(),
        is_admin,
    };
};

/**
 * generateMockAuthAPIPayload function
 *
 * This function generates a mock auth API payload
 *
 * @returns {Object} - A mock auth API payload
 */
export const generateMockAuthAPIPayload = () => {
    return {
        username: faker.internet.userName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
    };
};

/**
 * generateMockUserAPIPayload function
 *
 * This function generates a mock user API payload
 *
 * @returns {Object} - A mock user API payload
 */
export const generateMockUserAPIPayload = () => {
    return {
        username: faker.internet.userName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        avatar: faker.image.avatar(),
        isAdmin: faker.datatype.boolean(),
    };
};

// export const generateMockLoginPayload = () => {
//     return {
//         username: faker.internet.userName(),
//         password: faker.internet.password(),
//     };
// };
