import React, {useState} from 'react';
import {useForm} from 'react-hook-form';
import ReCAPTCHA from 'react-google-recaptcha';
import {Link} from 'react-router-dom'
import {FaGoogle, FaFacebookF, FaTwitter } from 'react-icons/fa';
import {z} from 'zod'
import {zodResolver} from "@hookform/resolvers/zod"
const schema = z.object({
    username: z.string().nonempty("Username is required"),
    password: z.string().nonempty("Password is required"),
    confirmPassword:z.string().nonempty("Please confirm your password"),
    fullname: z.string().nonempty("Full name is required"),
    address: z.string().nonempty("Address is required"),
    email: z.string().nonempty("Email is required").email("Email format is not valid")
})
.refine((data) => data.confirmPassword === data.password,{
    message: "Password do not match",
    path: ["confirmPassword"]
})
const SignUpPage = () => {
    const {register, handleSubmit,  watch, formState: { errors }} = useForm({
        resolver: zodResolver(schema),
        mode: "onBlur",
    });
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
                    <label htmlFor="username" className ="sr-only">Username</label>
                    <input
                        type="text"
                        {...register('username')}
                        placeholder="Username"
                        id="username"
                        className="w-full border-b border-gray-300 focus:outline-none py-3 placeholder-gray-400"
                    />
                    <span className="text-red-600 text-sm mt-1 block">
                        {errors.username? errors.username.message : ""}
                    </span>
                </div>

                <div>
                    <label htmlFor="password" className="sr-only">Password</label>
                    <input
                        type="password"
                        id="password"
                        {...register('password')}
                        placeholder="Password"
                        className="w-full border-b border-gray-300 focus:outline-none py-3 placeholder-gray-400"
                    />
                    <span className="text-red-600 text-sm mt-1 block">
                        {errors.password? errors.password.message : ""}
                    </span>
                </div>

                <div>
                    <label htmlFor="confirmPassword" className="sr-only">Confirm password</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        {...register('confirmPassword'
                        //     , {
                        //     validate: value =>
                        //     value === password || "Passwords do not match"
                        // }
                    )}
                        placeholder="Confirm password"
                        className="w-full border-b border-gray-300 focus:outline-none py-3 placeholder-gray-400"
                    />
                    <span className="text-red-600 text-sm mt-1 block">
                        {errors.confirmPassword? errors.confirmPassword.message: ""}
                    </span>
                    
                </div>

                <div>
                    <label htmlFor="fullname"className="sr-only">Full name</label>
                    <input
                        type="text"
                        id="fullname"
                        {...register('fullname')}
                        placeholder="Full name"
                        className="w-full border-b border-gray-300 focus:outline-none py-3 placeholder-gray-400"
                    />
                    <span className="text-red-600 text-sm mt-1 block">
                        {errors.fullname? errors.fullname.message: ""}
                    </span>
                </div>

                <div>
                    <label htmlFor="email"className="sr-only">Email</label>
                    <input
                        type="text"
                        id="email"
                        {...register('email')}
                        placeholder="Email"
                        className="w-full border-b border-gray-300 focus:outline-none py-3 placeholder-gray-400"
                    />
                    <span className="text-red-600 text-sm mt-1 block">
                        {errors.email? errors.email.message: ""}
                    </span>
                </div>

                <div>
                    <label htmlFor="address" className="sr-only">Address</label>
                    <input
                        type="text"
                        id="address"
                        {...register('address')}
                        placeholder="Address"
                        className="w-full border-b border-gray-300 focus:outline-none py-3 placeholder-gray-400"
                    />
                    <span className="text-red-600 text-sm mt-1 block">
                        {errors.address? errors.address.message: ""}
                    </span>
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
