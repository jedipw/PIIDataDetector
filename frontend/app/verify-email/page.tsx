'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react'
import { useEffect } from 'react';

export default function ForgotPasswordSuccess() {
    const [email, setEmail] = useState('');
    const searchParams = useSearchParams();
    const router = useRouter();

    useEffect(() => {
        const emailParam = searchParams!.get('email');
        if (emailParam) {
            setEmail(emailParam);
        }
    }, [searchParams]);

    return (
        <>
            <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                <div className="bg-[#F4EEE0] sm:mx-auto sm:w-full sm:max-w-xl pt-20 pb-10 pl-5 pr-5 sm:pl-24 sm:pr-24 rounded-2xl shadow-md">
                    <h2 className="text-center text-2xl font-extrabold leading-9 tracking-tight text-gray-900">
                        VERIFY YOUR EMAIL ADDRESS
                    </h2>
                    <p className="mt-10 text-center text-xl leading-9 tracking-tight text-gray-900">
                        We will send a verification email to <b>{email}</b> Please check your email to verify.
                    </p>
                    <div className="mt-2 flex justify-center">
                        <button
                            type="button"
                            onClick={() => router.push('/signin')}
                            className="mt-5 disabled:opacity-40 flex w-64 justify-center rounded-md bg-[#FBBA21] px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-[#E8A300] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8A300]"
                        >
                            Back to login
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}
