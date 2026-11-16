import React from 'react'
import AuthLayout from '../components/ui/AuthLayout'

const SignupPage = () => {
  return (
    <>
    <AuthLayout
      eyebrow="FREE, ALWAYS"
      title="Your best days"
      accent="start here."
      kicker="FREE, ALWAYS"
      heading="Join the streak"
      subtitle="Create your account in a minute."
      topText="Already have an account?"
      topLabel="Log in"
      topTo="/login"
      footer={
        <>
          By signing up, you agree to our{" "}
          <a href="#terms" className="font-extrabold text-ink underline decoration-grape underline-offset-[3px]">Terms</a> and{" "}
          <a href="#privacy" className="font-extrabold text-ink underline decoration-grape underline-offset-[3px]">Privacy Policy</a>.
        </>
      }
    >
        <form className="grid gap-[18px]">
        <label className="grid gap-2 text-[11px] font-extrabold">
          Full name
          <input type="text" placeholder="Your name" className="h-12 w-full rounded-lg border border-[#deded8] bg-transparent px-3.5 text-xs outline-none placeholder:text-[#aaa] focus:border-[#bd72ec] focus:shadow-[0_0_0_3px_#c575f822]" />
        </label>
        <label className="grid gap-2 text-[11px] font-extrabold">
          Email address
          <input type="email" placeholder="you@example.com" className="h-12 w-full rounded-lg border border-[#deded8] bg-transparent px-3.5 text-xs outline-none placeholder:text-[#aaa] focus:border-[#bd72ec] focus:shadow-[0_0_0_3px_#c575f822]" />
        </label>
        <label className="grid gap-2 text-[11px] font-extrabold">
          Password
          <input type="password" placeholder="Create a password" className="h-12 w-full rounded-lg border border-[#deded8] bg-transparent px-3.5 text-xs outline-none placeholder:text-[#aaa] focus:border-[#bd72ec] focus:shadow-[0_0_0_3px_#c575f822]" />
        </label>
        <label className="grid gap-2 text-[11px] font-extrabold">
          Confirm password
          <input type="password" placeholder="Enter it again" className="h-12 w-full rounded-lg border border-[#deded8] bg-transparent px-3.5 text-xs outline-none placeholder:text-[#aaa] focus:border-[#bd72ec] focus:shadow-[0_0_0_3px_#c575f822]" />
        </label>
        <button type="button" className="mt-[5px] inline-flex h-[49px] w-full cursor-pointer items-center justify-center gap-3 rounded-full bg-grape px-[22px] text-[13px] font-extrabold text-[#171717] shadow-[0_4px_0_#8d43bd] transition duration-200 hover:-translate-y-0.5">
          Create account <span className="text-[17px]">↗</span>
        </button>
      </form>
    </AuthLayout>
    </>
  )
}

export default SignupPage