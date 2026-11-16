import { Link } from "react-router-dom";
import AuthLayout from "../components/ui/AuthLayout";



const LoginPage = () => {
  return (
    <>
     <AuthLayout
      eyebrow="GOOD TO SEE YOU"
      title="Good to see you"
      accent="again."
      kicker="GOOD TO SEE YOU"
      heading="Welcome back"
      subtitle="Your habits are waiting."
      topText="New around here?"
      topLabel="Sign up"
      topTo="/signup"
      footer={
        <>
          New to aadat?{" "}
          <Link to="/signup" className="font-extrabold text-ink underline decoration-grape underline-offset-[3px]">Create an account</Link>
        </>
      }
    >
         <form className="grid gap-[18px]">
        <label className="grid gap-2 text-[11px] font-extrabold">
          Email address
          <input type="email" placeholder="you@example.com" className="h-12 w-full rounded-lg border border-[#deded8] bg-transparent px-3.5 text-xs outline-none placeholder:text-[#aaa] focus:border-[#bd72ec] focus:shadow-[0_0_0_3px_#c575f822]" />
        </label>
        <label className="grid gap-2 text-[11px] font-extrabold">
          Password
          <input type="password" placeholder="Enter your password" className="h-12 w-full rounded-lg border border-[#deded8] bg-transparent px-3.5 text-xs outline-none placeholder:text-[#aaa] focus:border-[#bd72ec] focus:shadow-[0_0_0_3px_#c575f822]" />
        </label>
        <div className="-mt-[5px] flex items-center justify-between text-[10px] text-[#777]">
          <label className="flex items-center gap-1.5">
            <input type="checkbox" className="accent-[#a34ed3]" /> Remember me
          </label>
          <a href="#forgot" className="text-ink underline underline-offset-[3px]">Forgot password?</a>
        </div>
        <button type="button" className="mt-[5px] inline-flex h-[49px] w-full cursor-pointer items-center justify-center gap-3 rounded-full bg-grape px-[22px] text-[13px] font-extrabold text-[#171717] shadow-[0_4px_0_#8d43bd] transition duration-200 hover:-translate-y-0.5">
          Log in <span className="text-[17px]">↗</span>
        </button>
      </form>
    </AuthLayout>
    </>
  )
}

export default LoginPage