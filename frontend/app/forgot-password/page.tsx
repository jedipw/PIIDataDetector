'use client';
import { sendPasswordResetEmail } from 'firebase/auth';
import { useState } from 'react'
import { auth } from '../firebase';
import { useRouter } from 'next/navigation';

export default function ForgotPassword() {

    const [email, setEmail] = useState('');
    const [error, setError] = useState('');

    const validateEmail = () => {
        // Return an error message if the email is invalid, otherwise return an empty string
        if (!email) {
            setError('Email is required');
            return false;
        }

        // Regular expression to validate email address
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('Invalid email address');
            return false;
        }

        return true;
    };

    const router = useRouter();

    const resetEmail = () => {
        if (validateEmail()) {
            sendPasswordResetEmail(auth, email).then(() => {
                // Ensure router is used after the email has been sent
                router.push(`/forgot-password/success?email=${email}`);
            }).catch((error) => {
                // Handle any errors that occur during email sending
                console.error("Failed to send password reset email", error);
                setError("Failed to send password reset email");
            });
        }
    };


    return (
        <>
            <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                <div className="bg-[#F4EEE0] sm:mx-auto sm:w-full sm:max-w-xl pt-20 pb-10 pl-5 pr-5 sm:pl-24 sm:pr-24 rounded-2xl shadow-md">
                    <h2 className="text-center text-2xl font-extrabold leading-9 tracking-tight text-gray-900">
                        FORGET PASSWORD
                    </h2>
                    <h3 className="text-center text-2xl leading-9 tracking-tight text-gray-900">
                        Enter the email address associate with your account.
                    </h3>

                    <form className="space-y-6 mt-10" action="#" method="POST" onSubmit={(e) => {
                        e.preventDefault();
                        resetEmail();
                    }}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
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
                                    className="pl-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                                />
                                {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
                            </div>
                        </div>

                        <div className="flex justify-center">
                            <button
                                type="submit"
                                disabled={!email}
                                className="mt-5 disabled:opacity-40 flex w-64 justify-center rounded-md bg-[#FBBA21] px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-[#E8A300] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8A300]"
                            >
                                Send Forgot Password Email
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}
