'use client';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation';

export default function Signin() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [errors, setErrors] = useState({
        email: '',
        password: '',
        signInCredential: ''
    });

    const searchParams = useSearchParams();

    useEffect(() => {
        const errorParam = searchParams!.get('error'); // Access 'error' parameter using get()
        if (errorParam) {
            setErrors({
                email: '',
                password: '',
                signInCredential: 'Invalid email or password. Or the email is not verified. Please try again.'
            });
        }
    }, [searchParams]);

    const validateEmail = (email: string) => {
        // Return an error message if the email is invalid, otherwise return an empty string
        if (!email) {
            return 'Email is required';
        }

        // Regular expression to validate email address
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return 'Invalid email address';
        }

        return '';
    };

    const validatePassword = (password: string) => {
        // Return an error message if the password is invalid, otherwise return an empty string
        if (!password) {
            return 'Password is required';
        }

        return '';
    };

    const validateForm = () => {
        const emailError = validateEmail(email);
        const passwordError = validatePassword(password);

        setErrors({
            email: emailError,
            password: passwordError,
            signInCredential: ''
        });

        return !emailError && !passwordError;
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitted(true);
        if (validateForm()) {
            signIn('credentials', { email, password, redirect: true, callbackUrl: '/' });
        } else {
            setIsSubmitted(false);
        }
    }

    return (
        <>
            <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                <div className="bg-[#F4EEE0] sm:mx-auto sm:w-full sm:max-w-xl pt-20 pb-10 pl-5 pr-5 sm:pl-24 sm:pr-24 rounded-2xl shadow-md">
                    <h2 className="text-center text-2xl font-extrabold leading-9 tracking-tight text-gray-900">
                        LOG IN
                    </h2>
                    <h3 className="text-center text-2xl leading-9 tracking-tight text-gray-900">
                        Please sign in to continue
                    </h3>

                    <form className="space-y-6 mt-10" action="#" method="POST" onSubmit={(e) => {
                        handleSubmit(e);
                    }}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-bold leading-6 text-gray-900">
                                Email address
                            </label>
                            <div className="mt-2">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="pl-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                                {errors.email && <p className="mt-2 text-sm text-red-500">{errors.email}</p>}
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="password" className="block text-sm font-bold leading-6 text-gray-900">
                                    Password
                                </label>
                                <div className="text-sm">
                                    <button
                                        type="button"
                                        onClick={() => router.push('/forgot-password')}
                                        className="text-sm text-gray-500 font-bold focus:outline-none"
                                    >
                                        Forget password?
                                    </button>
                                </div>
                            </div>
                            <div className="mt-2">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="pl-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                                />
                                {errors.password && <p className="mt-2 text-sm text-red-500">{errors.password}</p>}
                            </div>
                        </div>

                        {errors.signInCredential && <p className="mt-2 text-sm text-red-500">{errors.signInCredential}</p>}

                        <div className="flex justify-center">
                            <button
                                type="submit"
                                disabled={!email || !password || isSubmitted}
                                className="mt-5 disabled:opacity-40 flex w-48 justify-center rounded-md bg-[#FBBA21] px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-[#E8A300] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8A300]"
                            >
                                Sign in
                            </button>
                        </div>
                    </form>

                    <p className="mt-3 text-center text-sm text-gray-500">
                        Not a member?{' '}
                        <button onClick={() => router.push('signup')} className="text-sm text-[#E8A300] font-bold ">
                            Sign Up
                        </button>
                    </p>
                </div>
            </div>
        </>
    )
}