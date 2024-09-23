import Image from "next/image";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div className="flex items-center justify-center">
        <Image
          src="/logo.svg"
          alt="Logo"
          width={100}
          height={100}
          layout="fixed"
        />
      </div>
      <div className="text-center">
        <h1 className="text-4xl font-bold">Welcome to Next.js</h1>
        <p className="mt-4 text-lg">
          Get started by editing <code>pages/index.js</code>
        </p>
      </div>
      <div className="text-center">
        <p className="text-sm text-gray-500">
          © {new Date().getFullYear()} Your Company. All rights reserved.
        </p>
      </div>
    </div>
  );
}
