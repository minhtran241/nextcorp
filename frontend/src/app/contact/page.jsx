import { Home, Mail, Phone } from 'lucide-react';
import CalendlyEmbed from '@/components/calendly/CalendlyEmbed';
import ContactForm from '@/components/contactForm/contactForm';

export const metadata = {
    title: 'Contact Page',
    description: 'Contact Page',
};

const ContactPage = () => {
    return (
        <div className="flex flex-col gap-12 container">
            <div className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2 md:gap-x-6 lg:gap-x-8 xl:grid-cols-2">
                <div className="mb-12 max-w-[570px] lg:mb-0">
                    <h2 className="mb-6 text-[32px] font-bold uppercase text-[#3280f6] sm:text-[40px] lg:text-[36px] xl:text-[40px]">
                        GET IN TOUCH WITH US
                    </h2>
                    <p className="mb-9 text-base leading-relaxed text-body-color dark:text-dark-6">
                        Pleased to meet you! We are a team of passionate
                        developers, designers, and marketers who are committed
                        to providing the best services to our clients. We are
                        always ready to help you with your project. Please feel
                        free to contact us.
                    </p>
                    <div className="mb-8 flex w-full max-w-[370px]">
                        <div className="mr-6 flex h-[60px] w-full max-w-[60px] items-center justify-center overflow-hidden rounded bg-primary/5 text-[#3280f6] sm:h-[70px] sm:max-w-[70px]">
                            <Home />
                        </div>
                        <div className="w-full">
                            <h4 className="mb-1 text-xl font-bold text-dark dark:text-white">
                                Our Location
                            </h4>
                            <p className="text-base text-body-color dark:text-dark-6">
                                1234 Street Name, City Name, Country Name
                            </p>
                        </div>
                    </div>

                    <div className="mb-8 flex w-full max-w-[370px]">
                        <div className="mr-6 flex h-[60px] w-full max-w-[60px] items-center justify-center overflow-hidden rounded bg-primary/5 text-[#3280f6] sm:h-[70px] sm:max-w-[70px]">
                            <Phone />
                        </div>
                        <div className="w-full">
                            <h4 className="mb-1 text-xl font-bold text-dark dark:text-white">
                                Phone Number
                            </h4>
                            <p className="text-base text-body-color dark:text-dark-6">
                                (+62)81 414 257 9980
                            </p>
                        </div>
                    </div>

                    <div className="mb-8 flex w-full max-w-[370px]">
                        <div className="mr-6 flex h-[60px] w-full max-w-[60px] items-center justify-center overflow-hidden rounded bg-primary/5 text-[#3280f6] sm:h-[70px] sm:max-w-[70px]">
                            <Mail />
                        </div>
                        <div className="w-full">
                            <h4 className="mb-1 text-xl font-bold text-dark dark:text-white">
                                Email Address
                            </h4>
                            <p className="text-base text-body-color dark:text-dark-6">
                                info@yourdomain.com
                            </p>
                        </div>
                    </div>
                </div>
                <ContactForm />
            </div>
            <div className="flex flex-col gap-4">
                <h1 className="text-3xl sm:text-2xl font-bold text-[#3280f6]">
                    Book a Live Demo or Meeting with Us
                </h1>
                <CalendlyEmbed url={process.env.CALENDLY_URL} />
            </div>
        </div>
    );
};
export default ContactPage;
