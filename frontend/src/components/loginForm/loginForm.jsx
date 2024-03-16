'use client';

import { login } from '@/lib/action';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useState, useTransition, useEffect } from 'react';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { toast } from 'sonner';
import { User, Unlock, EyeIcon, EyeOffIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

const FormSchema = z.object({
    username: z.string().min(2, {
        message: 'Username must be at least 2 characters.',
    }),
    password: z
        .string()
        .min(8, 'Password must be at least 8 characters long.')
        .refine((password) => /[A-Z]/.test(password), {
            message: 'Password must contain at least one uppercase letter.',
        })
        .refine((password) => /[a-z]/.test(password), {
            message: 'Password must contain at least one lowercase letter.',
        })
        .refine((password) => /\d/.test(password), {
            message: 'Password must contain at least one number.',
        })
        .refine(
            (password) =>
                /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(password),
            {
                message:
                    'Password must contain at least one special character.',
            }
        ),
});

const LoginForm = () => {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [res, setRes] = useState({
        status: undefined,
        message: undefined,
    });
    const form = useForm({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            username: '',
            password: '',
        },
    });
    // const [state, formAction] = useFormState(login, undefined);
    useEffect(() => {
        if (res.status === 200) {
            toast.success(res.message);
        } else if (res.error) {
            toast.error(res.error);
        }
    }, [res]);

    const onSubmit = form.handleSubmit((data) => {
        startTransition(async () => {
            const res = await login(data);
            // redirect to home page if login successfully
            if (res.status === 200) {
                router.push('/');
            }
            setRes(res);
        });
    });

    const [showPassword, setShowPassword] = useState(false);
    // If there is nothing in password input, disable the show password button
    const [disabled, setDisabled] = useState(true);
    useEffect(() => {
        if (form.getValues('password') !== '') {
            setDisabled(false);
        } else {
            setDisabled(true);
        }
    }, [form.getValues('password')]);

    return (
        <Form {...form}>
            <form onSubmit={onSubmit} className="flex flex-col gap-5">
                <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="flex flex-row leading-none">
                                <User className="h-[1rem] w-[1rem] mr-2" />
                                Username
                            </FormLabel>
                            <FormControl>
                                <Input placeholder="minhtran" {...field} />
                            </FormControl>
                            <FormDescription>
                                This is your public display name.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="flex flex-row leading-none">
                                <Unlock className="h-[1rem] w-[1rem] mr-2" />
                                Password
                            </FormLabel>
                            <FormControl>
                                {/* <Input
                                    placeholder="Abcd@1234"
                                    type="password"
                                    {...field}
                                /> */}
                                <div className="relative">
                                    <Input
                                        type={
                                            showPassword ? 'text' : 'password'
                                        }
                                        className="hide-password-toggle"
                                        placeholder="Abcd@1234"
                                        {...field}
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                        onClick={() =>
                                            setShowPassword((prev) => !prev)
                                        }
                                        disabled={disabled}
                                    >
                                        {showPassword && !disabled ? (
                                            <EyeIcon
                                                className="h-4 w-4"
                                                aria-hidden="true"
                                            />
                                        ) : (
                                            <EyeOffIcon
                                                className="h-4 w-4"
                                                aria-hidden="true"
                                            />
                                        )}
                                        <span className="sr-only">
                                            {showPassword
                                                ? 'Hide password'
                                                : 'Show password'}
                                        </span>
                                    </Button>

                                    {/* hides browsers password toggles */}
                                    <style>{`
					.hide-password-toggle::-ms-reveal,
					.hide-password-toggle::-ms-clear {
						visibility: hidden;
						pointer-events: none;
						display: none;
					}
				`}</style>
                                </div>
                            </FormControl>
                            <FormDescription>
                                Password must be at least 8 characters long and
                                contain at least one uppercase letter, one
                                lowercase letter, one number, and one special
                                character.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button
                    type="submit"
                    disabled={isPending}
                    className="bg-[#3280f6] hover:bg-[#2a6cc9] text-white"
                >
                    Login
                </Button>
                <Link href="/register">
                    {"Don't have an account?"} <b className="">Register</b>
                </Link>
            </form>
        </Form>
    );
};

export default LoginForm;
