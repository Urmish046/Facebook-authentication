export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#F0F2F5] flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-md px-10 py-12 flex flex-col items-center gap-4 max-w-md w-full">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg"
          alt="Meta"
          className="h-5"
        />
        <h1 className="text-3xl font-bold text-[#1877F2]">Welcome to Facebook</h1>
        <p className="text-gray-500 text-center">
          You are now logged in. Connect with friends, family and the world.
        </p>
      </div>
    </div>
  );
}