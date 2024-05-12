'use client';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { auth } from '../firebase';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Signup() {
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [password, setPassword] = useState('');
    const [passwordAgain, setPasswordAgain] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const router = useRouter();
    const [errors, setErrors] = useState({
        email: '',
        firstName: '',
        lastName: '',
        password: '',
        passwordAgain: ''
    });

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const toggleShowConfirmPassword = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

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

    const validateFirstName = (firstName: string) => {
        // Return an error message if the first name is invalid, otherwise return an empty string
        if (!firstName) {
            return 'First name is required';
        }
        return '';
    };

    const validateLastName = (lastName: string) => {
        // Return an error message if the last name is invalid, otherwise return an empty string
        if (!lastName) {
            return 'Last name is required';
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

    const validatePasswordAgain = (passwordAgain: string) => {
        // Return an error message if the password again is invalid, otherwise return an empty string
        if (!passwordAgain) {
            return 'Please confirm your password';
        }
        if (passwordAgain !== password) {
            return 'Passwords do not match';
        }

        return '';
    };

    const validateForm = () => {
        const emailError = validateEmail(email);
        const firstNameError = validateFirstName(firstName);
        const lastNameError = validateLastName(lastName);
        const passwordError = validatePassword(password);
        const passwordAgainError = validatePasswordAgain(passwordAgain);

        setErrors({
            email: emailError,
            firstName: firstNameError,
            lastName: lastNameError,
            password: passwordError,
            passwordAgain: passwordAgainError
        });

        return !emailError && !firstNameError && !lastNameError && !passwordError && !passwordAgainError;
    };

    const signUp = () => {
        setIsSubmitted(true);
        if (validateForm()) {
            // Create a new user with the email and password
            createUserWithEmailAndPassword(auth, email, password).then((userCredential) => {
                const user = userCredential.user;
                const userId = user.uid;
                const userData = {
                    userId,
                    firstName,
                    lastName,
                    email
                };
                // Call the backend route to create the user in the database
                fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/createUser`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(userData)
                }).then(response => {
                    // Handle the response from the backend
                    if (response.ok) {
                        // User created successfully
                        console.log('User created successfully');
                        sendEmailVerification(user).then(() => {
                            // Email sent
                            console.log("Verification email sent.");
                            // Ensure router is used after the email has been sent
                            router.push(`/verify-email?email=${email}`);
                        }).catch((error) => {
                            // Handle errors here
                            console.error("Error sending verification email:", error);
                        });
                    } else {
                        setIsSubmitted(false);
                        // Error creating user
                        console.error('Error creating user');
                    }
                })
                    .catch(error => {
                        setIsSubmitted(false);
                        // Handle any errors that occurred during the request
                        console.error('Error creating user:', error);
                    });
            });
        }
    };

    useEffect(() => {
        // Clear form errors when the inputs change
        setErrors({
            email: '',
            firstName: '',
            lastName: '',
            password: '',
            passwordAgain: ''
        });
    }, [email, firstName, lastName, password, passwordAgain]);

    return (
        <>
            <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                <div className="bg-[#F4EEE0] sm:mx-auto sm:w-full sm:max-w-xl pt-20 pb-10 pl-5 pr-5 sm:pl-24 sm:pr-24 rounded-2xl shadow-md">
                    <h2 className="text-center text-2xl font-extrabold leading-9 tracking-tight text-gray-900">
                        CREATE ACCOUNT
                    </h2>
                    <h3 className="text-center text-2xl leading-9 tracking-tight text-gray-900">
                        Please sign up to continue
                    </h3>

                    <form className="space-y-6 mt-10" action="#" method="POST" onSubmit={(e) => {
                        e.preventDefault();
                        signUp();
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
                                    className={`pl-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6 ${errors.email ? 'border-red-500' : ''}`}
                                />
                                {errors.email && <p className="mt-2 text-sm text-red-500">{errors.email}</p>}
                            </div>
                        </div>

                        <div>
                            <label htmlFor="firstName" className="block text-sm font-bold leading-6 text-gray-900">
                                First name
                            </label>
                            <div className="mt-2">
                                <input
                                    id="firstName"
                                    name="firstName"
                                    type="text"
                                    autoComplete="given-name"
                                    onChange={(e) => setFirstName(e.target.value)}
                                    required
                                    className={`pl-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6 ${errors.firstName ? 'border-red-500' : ''}`}
                                />
                                {errors.firstName && <p className="mt-2 text-sm text-red-500">{errors.firstName}</p>}
                            </div>
                        </div>

                        <div>
                            <label htmlFor="lastName" className="block text-sm font-bold leading-6 text-gray-900">
                                Last name
                            </label>
                            <div className="mt-2">
                                <input
                                    id="lastName"
                                    name="lastName"
                                    type="text"
                                    autoComplete="family-name"
                                    onChange={(e) => setLastName(e.target.value)}
                                    required
                                    className={`pl-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6 ${errors.lastName ? 'border-red-500' : ''}`}
                                />
                                {errors.lastName && <p className="mt-2 text-sm text-red-500">{errors.lastName}</p>}
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="password" className="block text-sm font-bold leading-6 text-gray-900">
                                    Password
                                </label>
                                {password &&
                                    <button
                                        type="button"
                                        onClick={toggleShowPassword}
                                        className="text-sm text-gray-500 font-bold focus:outline-none"
                                    >
                                        {showPassword ? 'Hide' : 'Show'}
                                    </button>}

                            </div>
                            <div className="mt-2">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    autoComplete="current-password"
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className={`pl-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6 ${errors.password ? 'border-red-500' : ''}`}
                                />
                                {errors.password && <p className="mt-2 text-sm text-red-500">{errors.password}</p>}
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="passwordAgain" className="block text-sm font-bold leading-6 text-gray-900">
                                    Confirm Password
                                </label>
                                {passwordAgain &&
                                    <button
                                        type="button"
                                        onClick={toggleShowConfirmPassword}
                                        className="text-sm text-gray-500 font-bold focus:outline-none"
                                    >
                                        {showConfirmPassword ? 'Hide' : 'Show'}
                                    </button>}
                            </div>
                            <div className="mt-2">
                                <input
                                    id="passwordAgain"
                                    name="passwordAgain"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    autoComplete="current-password"
                                    onChange={(e) => setPasswordAgain(e.target.value)}
                                    required
                                    className={`pl-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6 ${errors.passwordAgain ? 'border-red-500' : ''}`}
                                />
                                {errors.passwordAgain && <p className="mt-2 text-sm text-red-500">{errors.passwordAgain}</p>}
                            </div>
                        </div>

                        <div className="flex justify-center">
                            <button
                                type="submit"
                                disabled={(!email || !password || !passwordAgain) || (password !== passwordAgain) || isSubmitted}
                                className="mt-5 disabled:opacity-40 flex w-48 justify-center rounded-md bg-[#FBBA21] px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-[#E8A300] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8A300]"
                            >
                                Sign Up
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}