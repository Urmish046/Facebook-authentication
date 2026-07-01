import LoginForm from "@/app/components/auth/login-form";

export const metadata = {
  title: "Log in to Facebook",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-white flex">
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-12 border-r border-gray-200 min-h-screen">
        <div className="flex-1 flex items-center justify-center overflow-hidden">
          <img
            src="/image.png"
            alt="Explore"
            className="object-contain w-full max-h-[55vh]"
          />
        </div>

        <div className="pb-8">
          <h1 className="text-[3.5rem] font-bold text-black leading-[1.1] tracking-tight">
            Explore <br />
            the things <br />
            <span className="text-[#1877F2]">you love.</span>
          </h1>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <LoginForm />
      </div>
    </div>
  );
}
