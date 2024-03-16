'use client';

import { register } from '@/lib/action';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTransition } from 'react';
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
import { User, Lock, Mail, EyeIcon, EyeOffIcon } from 'lucide-react';

const FormSchema = z
    .object({
        username: z.string().min(2, {
            message: 'Username must be at least 2 characters.',
        }),
        email: z.string().email('Invalid email address.'),
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
        passwordConfirm: z
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
    })
    .refine((data) => data.password === data.passwordConfirm, {
        message: 'Passwords do not match.',
        path: ['passwordConfirm'],
    });

const RegisterForm = () => {
    // const [state, formAction] = useFormState(register, undefined);
    const [isPending, startTransition] = useTransition();
    const [res, setRes] = useState({
        status: undefined,
        message: undefined,
    });
    const router = useRouter();

    const form = useForm({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            username: '',
            email: '',
            password: '',
            passwordConfirm: '',
        },
    });

    useEffect(() => {
        if (res.status === 201) {
            toast.success(res.message);
        } else if (res.error) {
            toast.error(res.error);
        }
    }, [res, router]);

    const onSubmit = form.handleSubmit((data) => {
        startTransition(async () => {
            const res = await register(data);
            // redirect to home page if register successfully
            if (res.status === 201) {
                router.push('/');
            }
            setRes(res);
        });
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
    // If there is nothing in password input, disable the show password button
    const [disabled, setDisabled] = useState(true);
    const [disabledConfirm, setDisabledConfirm] = useState(true);
    useEffect(() => {
        if (form.getValues('password') !== '') {
            setDisabled(false);
        } else {
            setDisabled(true);
        }
    }, [form.getValues('password')]);

    useEffect(() => {
        if (form.getValues('passwordConfirm') !== '') {
            setDisabledConfirm(false);
        } else {
            setDisabledConfirm(true);
        }
    }, [form.getValues('passwordConfirm')]);

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
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="flex flex-row leading-none">
                                <Mail className="h-[1rem] w-[1rem] mr-2" />
                                Email
                            </FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="minhtran@gmail.com"
                                    type="email"
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription>
                                We will never share your email with anyone else.
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
                                <Lock className="h-[1rem] w-[1rem] mr-2" />
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
                <FormField
                    control={form.control}
                    name="passwordConfirm"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="flex flex-row leading-none">
                                <Lock className="h-[1rem] w-[1rem] mr-2" />
                                Confirm Password
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
                                            showPasswordConfirm
                                                ? 'text'
                                                : 'password'
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
                                            setShowPasswordConfirm(
                                                (prev) => !prev
                                            )
                                        }
                                        disabled={disabledConfirm}
                                    >
                                        {showPasswordConfirm &&
                                        !disabledConfirm ? (
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
                                            {showPasswordConfirm
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
                                Please confirm your password.
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
                    Register
                </Button>
                <Link href="/login">
                    {'Already have an account?'} <b className="">Login</b>
                </Link>
            </form>
        </Form>
    );
    //     <form className={styles.form} action={formAction}>
    //         {/* <input
    //             type="text"
    //             placeholder="Username"
    //             name="username"
    //             required
    //         />
    //         <input type="text" placeholder="Email" name="email" required />
    //         <input
    //             type="password"
    //             placeholder="Password"
    //             name="password"
    //             required
    //         />
    //         <input
    //             type="password"
    //             placeholder="Confirm Password"
    //             name="passwordConfirm"
    //             required
    //         />
    //         <button>Register</button> */}
    //         <Input
    //             type="text"
    //             placeholder="Username"
    //             name="username"
    //             required
    //         />
    //         <Input type="text" placeholder="Email" name="email" required />
    //         <Input
    //             type="password"
    //             placeholder="Password"
    //             name="password"
    //             required
    //         />
    //         <Input
    //             type="password"
    //             placeholder="Confirm Password"
    //             name="passwordConfirm"
    //             required
    //         />
    //         <Button>Register</Button>
    //         {state?.error}
    //         <Link href="/login">
    //             Already have an account? <b>Login</b>
    //         </Link>
    //     </form>
    // );
};

export default RegisterForm;
