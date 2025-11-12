import React from 'react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { FaEye, FaEyeSlash, FaGoogle, FaFacebookF, FaTwitter } from 'react-icons/fa';

const LogInPage = () => {
    const { register, handleSubmit } = useForm();
    const [showPass, setShowPass] = useState(false);

    const onSubmit = (data) => {
        console.log('login data', data);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-white px-6 pb-6">
            <div className="max-w-xl w-full">
                <div className="flex justify-center">
                    <div className="w-32 h-20 border border-gray-300 rounded-md" />
                </div>

                <hr className="my-8 border-gray-200" />

                <h2 className="text-center font-playfair text-3xl font-semibold text-gray-800 mb-8">Log in to your account</h2>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div>
                        <label className="sr-only">Username/ Email</label>
                        <input
                            type="text"
                            {...register('identifier')}
                            placeholder="Username/ Email"
                            className="w-full border-b border-gray-300 focus:outline-none py-3 placeholder-gray-400"
                        />
                    </div>

                    <div className="relative">
                        <label className="sr-only">Password</label>
                        <input
                            type={showPass ? 'text' : 'password'}
                            {...register('password')}
                            placeholder="Password"
                            className="w-full border-b border-gray-300 focus:outline-none py-3 placeholder-gray-400 pr-10"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPass((s) => !s)}
                            className="absolute right-0 top-1/2 -translate-y-1/2 mr-2 text-gray-500"
                            aria-label={showPass ? 'Hide password' : 'Show password'}
                        >
                            {showPass ? <FaEye /> : <FaEyeSlash />}
                        </button>
                    </div>

                    <div>
                        <button className="w-full bg-black text-white py-3 rounded-md hover:opacity-60">Log In</button>
                    </div>
                </form>

                <div className="mt-4">
                    <Link to="#" className="text-sm text-gray-700 underline">Forgot password?</Link>
                </div>

                <div className="mt-8 space-y-4">
                    <button className="w-full border border-gray-300 py-3 rounded-md flex items-center justify-center gap-3">
                        <FaGoogle className="text-red-500" />
                        <span>Log in with Google</span>
                    </button>

                    <button className="w-full border border-gray-300 py-3 rounded-md flex items-center justify-center gap-3">
                        <FaFacebookF className="text-blue-600" />
                        <span>Log in with Facebook</span>
                    </button>

                    <button className="w-full border border-gray-300 py-3 rounded-md flex items-center justify-center gap-3">
                        <FaTwitter className="text-sky-500" />
                        <span>Log in with Twitter</span>
                    </button>
                </div>

                <p className="text-center text-sm text-gray-600 mt-6">Don't have an account? <Link to="/signup" className="underline">Sign up</Link></p>
            </div>
        </div>
    );
};

export default LogInPage;
