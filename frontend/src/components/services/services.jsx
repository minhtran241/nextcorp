import fs from 'fs/promises';
import { Database, RefreshCcw, Link, Lock, Shield, BarChart } from 'lucide-react';

const services = [
    {
        title: 'Efficient Data Migration',
        details: 'Seamlessly transfer data between sources with our advanced techniques, ensuring minimal downtime and maximum data integrity.',
        icon: <Database />,
    },
    {
        title: 'Data Format Flexibility',
        details: 'Effortlessly transform data into various formats to meet your specific requirements and ensure compatibility across systems.',
        icon: <RefreshCcw />,
    },
    {
        title: 'Unified Data Integration',
        details: 'Consolidate data from diverse sources into a single source, providing a unified view of your information landscape.',
        icon: <Link />,
    },
    {
        title: 'Data Integrity Assurance',
        details: 'Ensure the accuracy and consistency of your data with our advanced validation and verification techniques.',
        icon: <Shield />,
    },
    {
        title: 'Comprehensive Data Security',
        details: 'Protect your data from unauthorized access, breaches, and cyber threats with our comprehensive security measures.',
        icon: <Lock />,
    },
    {
        title: 'Insightful Data Analysis',
        details: 'Derive valuable insights from your data with our advanced analytics techniques and visualization tools.',
        icon: <BarChart />,
    },
];

const Services = async () => {
    return (
        <section className="dark:bg-dark container">
            <div className="mx-auto">
                <div className="-mx-4 flex flex-wrap">
                    <div className="w-full px-4">
                        <div className="mx-auto mb-12 max-w-[510px] text-center lg:mb-20">
                            <span className="mb-2 block text-lg font-semibold text-[#3280f6]">
                                Our Services
                            </span>
                            <h2 className="mb-3 text-3xl font-bold leading-[1.2] text-[#3280f6] sm:text-4xl md:text-[40px]">
                                What We Offer
                            </h2>
                            <p className="text-base text-body-color dark:text-dark-6">
                                There are many variations of passages of Lorem
                                Ipsum available but the majority have suffered
                                alteration in some form.
                            </p>
                        </div>
                    </div>
                </div>
                <div className="-mx-4 flex flex-wrap">
                    {services.map((s, index) => (
                        <ServiceCard
                            key={index}
                            title={s.title}
                            details={s.details}
                            icon={s.icon}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

const ServiceCard = ({ icon, title, details }) => {
    return (
        <>
            <div className="w-full px-4 md:w-1/2 lg:w-1/3">
                <div className="mb-9 rounded-[20px] p-10 hover:shadow-lg dark:bg-dark-2 md:px-7 xl:px-10 border border-gray-200 dark:border-dark-3 hover:border-[#3280f6] transition duration-300">
                    <div className="mb-8 flex h-[70px] w-[70px] items-center justify-center rounded-2xl bg-[linear-gradient(to_left_top,rgb(50,128,246)_60%,rgb(99,222,191))] text-white">
                        {icon}
                    </div>
                    <h4 className="mb-[14px] text-2xl font-semibold">
                        {title}
                    </h4>
                    <p className="">{details}</p>
                </div>
            </div>
        </>
    );
};

export default Services;
