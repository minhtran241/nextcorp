import styles from './contact.module.css';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import { Send } from 'lucide-react';

export const metadata = {
    title: 'Contact Page',
    description: 'Contact Page',
};

const ContactPage = () => {
    return (
        <div className={styles.container}>
            <div className="relative flex-1">
                {/* <Image src="/contact.png" alt="" fill className={styles.img} /> */}
                <Accordion type="single" collapsible>
                    <AccordionItem value="item-4">
                        <AccordionTrigger>
                            Is ShadcnUI compatible with TypeScript?
                        </AccordionTrigger>
                        <AccordionContent>
                            Absolutely. ShadcnUI fully supports TypeScript for
                            type-safe development.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-5">
                        <AccordionTrigger>
                            Does ShadcnUI offer server-side rendering (SSR)
                            support?
                        </AccordionTrigger>
                        <AccordionContent>
                            Yes, Next.js 14 and ShadcnUI seamlessly support
                            server-side rendering, enhancing SEO and
                            performance.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-6">
                        <AccordionTrigger>
                            Can I customize themes in ShadcnUI easily?
                        </AccordionTrigger>
                        <AccordionContent>
                            Certainly. ShadcnUI provides flexible theming
                            capabilities, allowing easy customization to match
                            your project's design.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-7">
                        <AccordionTrigger>
                            Is internationalization (i18n) supported in
                            ShadcnUI?
                        </AccordionTrigger>
                        <AccordionContent>
                            Yes, Next.js 14 and ShadcnUI offer robust i18n
                            support for building multilingual applications.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-8">
                        <AccordionTrigger>
                            Are there built-in accessibility features in
                            ShadcnUI?
                        </AccordionTrigger>
                        <AccordionContent>
                            Absolutely. ShadcnUI follows best practices for
                            accessibility, ensuring compliance with WAI-ARIA
                            standards.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-9">
                        <AccordionTrigger>
                            Does ShadcnUI come with built-in animations?
                        </AccordionTrigger>
                        <AccordionContent>
                            Yes, ShadcnUI includes default animations that
                            enhance the user experience, with options to
                            customize or disable as needed.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-10">
                        <AccordionTrigger>
                            Is ShadcnUI compatible with modern CSS frameworks?
                        </AccordionTrigger>
                        <AccordionContent>
                            Yes, ShadcnUI seamlessly integrates with modern CSS
                            frameworks like Tailwind CSS or Styled Components,
                            providing flexibility in styling options.
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
            <div className={styles.formContainer}>
                <form className={styles.form} action="">
                    {/* <input type="text" placeholder="Name and Surname" /> */}
                    <Input type="text" placeholder="Name and Surname" />
                    <Input type="email" placeholder="Email Address" />
                    <Input type="text" placeholder="Phone Number (Optional)" />
                    {/* <input type="text" placeholder="Phone Number (Optional)" /> */}
                    <Textarea placeholder="Type your message here." />
                    {/* <textarea
                        name=""
                        id=""
                        cols="30"
                        rows="10"
                        placeholder="Message"
                    ></textarea> */}
                    <Button>
                        <Send className="mr-2 h-4 w-4" /> Send message
                    </Button>
                </form>
            </div>
        </div>
    );
};
export default ContactPage;
