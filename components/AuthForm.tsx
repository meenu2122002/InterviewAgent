"use client"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import {
  Form

} from "@/components/ui/form"


import Image from "next/image"
import Link from "next/link"
import { toast } from "sonner"
import FormField from "./FormField"
import { useRouter } from "next/navigation"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth"
// import { auth } from "@/firebase/client"
import { signIn, signUp } from "@/lib/actions/auth.action"
import { auth } from "@/firebase/client"


const authFormSchema = (type: FormType) => {
  return z.object({
    name: type === 'sign-up' ? z.string().min(3) : z.string().optional(),
    email: z.string().email(),
    password: z.string().min(3),
  })
}


const AuthForm = ({ type }: { type: FormType }) => {

  const router = useRouter();
  const formSchema = authFormSchema(type);
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: ""
    },
  })

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {

      if (type === 'sign-up') {

        const { name, email, password } = values;
        // sign up using client sdk  in firebase Authentication section
        const userCredentials = await createUserWithEmailAndPassword(auth, email, password);
        // create user record in firestore database using admin sdk
        console.log("User Credentials from Firebase Authentication",userCredentials)
        const result = await signUp({
          uid: userCredentials.user.uid,
          name: name!,
          email: email,
          password: password
        });
        console.log("Error is there")
        if (!result?.success) {
          toast.error(result?.message);
          return;
        }
        toast.success('Account created successfully. Please Sign In.');
        router.push('/sign-in')
      }
      else {

        const { email, password } = values;
        const userCredentials = await signInWithEmailAndPassword(auth, email, password);
        const idToken = await userCredentials.user.getIdToken();
        if (!idToken) {
          toast.error('Sign In failed');
          return;
        }
        await signIn({
          email, idToken
        });









        toast.success("Sign In successfully")
        router.push('/')
      }

    } catch (error) {
      console.log(error)
      toast.error(`There was an error ${error}`)
    }
  }

  const IsSignIn = type === 'sign-in';
  return (
    <div className="card-border lg:min-w-[566px]">
      <div className="flex flex-col gap-6 card py-14 px-10">
        <div className="flex flex-row gap-2 justify-center">
          <Image src="/logo.svg" alt="logo" height={32} width={38} />
          <h2 className="text-primary-100"> WiseMock</h2>

        </div>
        <h3>Practice job interview with AI </h3>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6 mt-4 form">
            {!IsSignIn &&
              <FormField
                control={form.control}
                name="name"
                label="Name"
                placeholder="Your Name"
                type="text"
              />}
            <FormField
              control={form.control}
              name="email"
              label="Email"
              placeholder="Your Email Address"
              type="email"
            />
            <FormField
              control={form.control}
              name="password"
              label="Password"
              placeholder="Enter Your Password"
              type="password"
            />

            <Button type="submit" className="btn">{IsSignIn ? 'Sign In' : 'Create an Account'}</Button>
          </form>
        </Form>
        <p className="text-center">
          {IsSignIn ? 'No Account yet?' : 'Have an Account Already?'}
          <Link href={IsSignIn ? '/sign-up' : '/sign-in'} className="font-bold text-user-primary ml-1">
            {IsSignIn ? 'Sign Up' : 'Sign In'}
          </Link>
        </p>
      </div>
    </div>
  )
}

export default AuthForm