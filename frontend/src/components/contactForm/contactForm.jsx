'use client';

import { Send } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useForm, ValidationError } from '@formspree/react';
import { toast } from 'sonner';

const ContactForm = () => {
    const [state, handleSubmit] = useForm('xeqwaeal');

    if (state.succeeded) {
        // Clear form
        document.getElementById('contact-form').reset();
        toast.success('Message sent!');
    }
    return (
        <div className="max-w-[570px] shadow-lg p-8 rounded-lg bg-white dark:bg-gray-800">
            <p className="text-[#3280f6] text-[22px] font-bold mb-6">
                Send us a message and we will get back to you as soon as
                possible!
            </p>
            <form
                className="flex flex-col gap-4"
                onSubmit={handleSubmit}
                id="contact-form"
            >
                <Input
                    type="text"
                    placeholder="Name and Surname"
                    id="name"
                    name="name"
                    className="h-12"
                />
                <Input
                    type="email"
                    placeholder="Email Address"
                    id="email"
                    name="email"
                    className="h-12"
                />
                <ValidationError
                    prefix="Email"
                    field="email"
                    errors={state.errors}
                />
                <Textarea
                    placeholder="Type your message here."
                    className="dark:bg-black h-32"
                    id="message"
                    name="message"
                />
                <ValidationError
                    prefix="Message"
                    field="message"
                    errors={state.errors}
                />
                <Button
                    className="bg-[#3280f6] text-white hover:bg-[#2a6cc9]"
                    type="submit"
                    disabled={state.submitting}
                >
                    <Send className="mr-2 h-4 w-4" /> Send message
                </Button>
                <ValidationError
                    errors={state.errors}
                    className="text-red-500 italic"
                />
            </form>
        </div>
    );
};

export default ContactForm;
