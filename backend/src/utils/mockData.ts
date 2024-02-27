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

export const generateMockPost = (): MockPost => {
    return {
        title: faker.lorem.words(3),
        description: faker.lorem.sentence(),
        content: faker.lorem.paragraphs(3),
        slug: faker.lorem.slug(),
        thumbnail: faker.image.url(),
        word_count: faker.number.int({ min: 100, max: 1000 }),
        read_time: faker.number.int({ min: 1, max: 30 }),
        userId: faker.number.int({ min: 1, max: 2 }),
        isPublished: faker.datatype.boolean(),
    };
};

export const generateMockPostAPIPayload = () => {
    return {
        title: faker.lorem.words(3),
        description: faker.lorem.sentence(),
        content: faker.lorem.paragraphs(3),
        thumbnail: faker.image.url(),
        userId: faker.number.int({ min: 1, max: 2 }),
        isPublished: faker.datatype.boolean(),
    };
};

export const generateMockUser = (is_admin: boolean): MockUser => {
    return {
        username: faker.internet.userName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        avatar: faker.image.avatar(),
        is_admin,
    };
};

export const generateMockAuthAPIPayload = () => {
    return {
        username: faker.internet.userName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
    };
};

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
