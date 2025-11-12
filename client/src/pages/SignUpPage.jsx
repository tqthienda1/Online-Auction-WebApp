import React, {useState} from 'react';
import {useForm} from 'react-hook-form';
import ReCAPTCHA from 'react-google-recaptcha';
import {Link} from 'react-router-dom'
import {FaGoogle, FaFacebookF, FaTwitter } from 'react-icons/fa';
const SignUpPage = () => {
    const {register, handleSubmit,  watch, formState: { errors }} = useForm();
    const password = watch("Password");
    const [recaptchaToken, setRecaptchaToken] = useState(null);
    const onSubmit = (data) => {
        if (!recaptchaToken) {
        alert("Please verify you are not a robot!");
        return;
        }
        console.log('sign up data', data);
    };
    return (

    
    <div className="min-h-screen flex items-center justify-center bg-white px-6 pb-6">
        <div className="max-w-xl w-full">
            <div className="flex justify-center">
                <div className="w-32 h-20 border border-gray-300 rounded-md" />
            </div>

            <hr className="my-8 border-gray-200" />

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                    <label className ="sr-only">Username</label>
                    <input
                        type="text"
                        {...register('Username')}
                        placeholder="Username"
                        className="w-full border-b border-gray-300 focus:outline-none py-3 placeholder-gray-400"
                    />
                </div>

                <div>
                    <label className="sr-only">Password</label>
                    <input
                        type="password"
                        {...register('Password')}
                        placeholder="Password"
                        className="w-full border-b border-gray-300 focus:outline-none py-3 placeholder-gray-400"
                    />
                </div>

                <div>
                    <label className="sr-only">Confirm password</label>
                    <input
                        type="password"
                        {...register('Confirm', {
                            validate: value =>
                            value === password || "Passwords do not match"
                        })}
                        placeholder="Confirm password"
                        className="w-full border-b border-gray-300 focus:outline-none py-3 placeholder-gray-400"
                    />

                    {errors.Confirm && (
                            <p className="text-red-500 text-sm mt-1">{errors.Confirm.message}</p>
                            )}
                </div>

                <div>
                    <label className="sr-only">Full name</label>
                    <input
                        type="text"
                        {...register('name')}
                        placeholder="Full name"
                        className="w-full border-b border-gray-300 focus:outline-none py-3 placeholder-gray-400"
                    />
                </div>

                <div>
                    <label className="sr-only">Email</label>
                    <input
                        type="text"
                        {...register('Email')}
                        placeholder="Email"
                        className="w-full border-b border-gray-300 focus:outline-none py-3 placeholder-gray-400"
                    />
                </div>

                <div>
                    <label className="sr-only">Address</label>
                    <input
                        type="text"
                        {...register('Address')}
                        placeholder="Address"
                        className="w-full border-b border-gray-300 focus:outline-none py-3 placeholder-gray-400"
                    />
                </div>

                 <div className="my-4">
                    <ReCAPTCHA
                    sitekey="6LeOcgosAAAAAJ2VsOk4pIajYhDRpr7eIxSqBpxG"
                    onChange={(token) => setRecaptchaToken(token)}
                    />
                </div>

                <div>
                    <button className="w-full bg-black text-white py-3 rounded-md hover:opacity-60">Sign Up</button>
                </div>
            </form>
            <div className="mt-8 space-y-4">
                    <button className="w-full border border-gray-300 py-3 rounded-md flex items-center justify-center gap-3">
                        <FaGoogle className="text-red-500" />
                        <span>Sign up with Google</span>
                    </button>
        
                    <button className="w-full border border-gray-300 py-3 rounded-md flex items-center justify-center gap-3">
                        <FaFacebookF className="text-blue-600" />
                        <span>Sign up with Facebook</span>
                    </button>
        
                    <button className="w-full border border-gray-300 py-3 rounded-md flex items-center justify-center gap-3">
                        <FaTwitter className="text-sky-500" />
                        <span>Sign up with Twitter</span>
                    </button>
                </div>
        
                <p className="text-center text-sm text-gray-600 mt-6">Already have an account? <Link to="/login" className="underline">Log in</Link></p>
            </div>
    
    </div>
    );

};

export default SignUpPage;
