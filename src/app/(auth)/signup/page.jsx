import SignupForm from "@/app/components/auth/signup-form";

export const metadata = {
  title: 'Sign Up for Facebook',
};

export default function SignupPage() {
  return (
    <div  className="bg-white min-h-screen">
      <SignupForm/>
    </div>
  );
}