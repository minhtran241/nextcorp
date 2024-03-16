import { alovaInstance } from '@/lib/alova';
import fs from 'fs/promises';
import { Calendar } from 'lucide-react';
import path from 'path';

// * FETCH MILESTONES FROM API
// const getMilestones = async () => {
//     const res = await alovaInstance
//         .Get(`/milestone`, {
//             localCache: null,
//         })
//         .send();
//     if (!res.ok) {
//         throw new Error('Something went wrong');
//     }
//     const data = await res.json();
//     return data;
// };

// * FETCH MILESTONES FROM LOCAL JSON
const DATA_ATTRS_DIR = path.join(process.cwd(), 'data', 'milestone');
const DATA_ATTRS_FILE = path.join(DATA_ATTRS_DIR, 'milestones.json');
const getMilestones = async () => {
    const milestonesData = await fs.readFile(
        path.join(DATA_ATTRS_FILE),
        'utf-8'
    );
    const milestones = JSON.parse(milestonesData);
    const sortedMilestones = milestones.sort((a, b) => {
        return new Date(a.date) - new Date(b.date);
    });
    return sortedMilestones;
};

const Timeline = async () => {
    const milestones = await getMilestones();
    return (
        <div className="bg-[linear-gradient(to_left_top,rgb(50,128,246)_60%,rgb(99,222,191))] py-28">
            <div className="max-w-xl mx-auto">
                <div className="text-center">
                    <h1 className="text-white text-4xl font-semibold leading-tight mb-4">
                        Experiences solidified in time
                    </h1>
                    <p className="mb-16 text-base text-center text-white">
                        We have been on the market for over 10 years, and we
                        have achieved a lot. Here are some of our milestones.
                    </p>
                </div>
            </div>

            <ol className="items-center sm:flex px-52">
                {milestones.map((milestone, index) => (
                    <li className="relative mb-6 sm:mb-0" key={index}>
                        <div className="flex items-center">
                            <div className="z-10 flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full ring-0 ring-white sm:ring-8 shrink-0">
                                <Calendar
                                    size={16}
                                    className="text-[#3280f6]"
                                />
                            </div>
                            <div className="hidden sm:flex w-full bg-gray-200 h-0.5"></div>
                        </div>
                        <div className="mt-3 sm:pe-8">
                            <h3 className="text-lg font-semibold text-white">
                                {milestone.title}
                            </h3>
                            <time className="block mb-2 text-sm font-normal leading-none text-white">
                                {new Date(milestone.date).toLocaleDateString(
                                    'en-US',
                                    {
                                        month: 'short',
                                        year: 'numeric',
                                    }
                                )}
                            </time>
                            <p className="text-base font-normal text-white">
                                {milestone.description}
                            </p>
                        </div>
                    </li>
                ))}
            </ol>
        </div>
    );
};

export default Timeline;
