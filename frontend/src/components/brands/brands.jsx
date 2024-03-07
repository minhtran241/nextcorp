import { alovaInstance } from '@/lib/alova';
import Image from 'next/image';
import fs from 'fs/promises';
import path from 'path';

const DATA_ATTRS_DIR = path.join(process.cwd(), 'data', 'skill');
const DATA_ATTRS_FILE = path.join(DATA_ATTRS_DIR, 'skills.json');

// * FETCH SKILLS FROM API
const getSKills = async () => {
    const res = await alovaInstance
        .Get(`/skill`, {
            localCache: null,
        })
        .send();
    if (!res.ok) {
        throw new Error('Something went wrong');
    }
    const data = await res.json();
    return data;
};

// // * FETCH SKILLS FROM LOCAL JSON
// const getSKills = async () => {
//     const skillsData = await fs.readFile(path.join(DATA_ATTRS_FILE), 'utf-8');
//     const skills = JSON.parse(skillsData);
//     return skills;
// };

const Brands = async () => {
    const skills = await getSKills();
    return (
        <div className="items-center justify-center mt-12">
            <div className="max-w-xl mx-auto">
                <div className="text-center ">
                    <div className="flex flex-col items-center ">
                        <h1 className="text-5xl font-semibold leading-tight">
                            Company Services
                        </h1>
                        <div className="flex w-24 mt-1 mb-6 overflow-hidden rounded">
                            <div className="flex-1 h-2 bg-gray-400"></div>
                            <div className="flex-1 h-2 bg-gray-600"></div>
                            <div className="flex-1 h-2 bg-black"></div>
                        </div>
                    </div>
                    <p className="mb-8 text-base text-center text-gray-600">
                        We have been on the market for over 10 years, and we are
                        usually working with the following technologies.
                    </p>
                </div>
            </div>
            <div className="flex flex-col items-center justify-center gap-10 grid-cols-2 lg:grid lg:grid-cols-2">
                {skills.map((skill, index) => (
                    <div
                        key={index}
                        className="flex flex-col items-center justify-center gap-4 shadow-lg p-4 rounded border border-gray-200 dark:border-gray-700 hover:shadow-2xl min-h-[150px]"
                    >
                        <h1 className="text-xl font-semibold">{skill.name}</h1>
                        <div className="flex flex-wrap gap-4">
                            {skill.technologies.map((badge, index) => (
                                <div key={index}>
                                    <Image
                                        src={badge}
                                        alt="skill"
                                        width={0}
                                        height={0}
                                        // sizes="100vw"
                                        style={{
                                            width: 'auto',
                                            height: 'auto',
                                        }}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Brands;
