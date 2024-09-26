"use client"
import useField from "./useField"
export default function Page() {
  const [username,usernameComponent]=useField({"title":"Username*","placeholder":"username"});
  const [password,passwordComponent]=useField({"title":"Password*","placeholder":"password"});
  return (
    <>
      <div className="wrapper bg-[#080710] h-screen flex items-center justify-center">
        <div className="absolute w-[430px] h-[520px]">
          <div className="absolute w-[200px] h-[200px] bg-gradient-to-r from-[#1845ad] to-[#23a2f6] rounded-full top-[-80px] left-[-80px]"></div>
          <div className="absolute w-[200px] h-[200px] bg-gradient-to-r from-[#ff512f] to-[#f09819] rounded-full bottom-[-80px] right-[-30px]"></div>
        </div>

        <form className="relative bg-white/10 backdrop-blur-md border border-white/10 shadow-[0_0_40px_rgba(8,7,16,0.6)] rounded-lg p-10 w-[400px]">
          <h3 className="text-center text-white text-2xl font-medium">
            Signup
          </h3>

          {usernameComponent}
          {passwordComponent}

          <div className="flex mt-5 flex-col">
            <div className="w-full mt-3 text-center bg-white/30 py-3 rounded-lg text-white hover:bg-white/50 cursor-pointer">
              <i className="fab fa-google mr-2"></i>Link Gmail*
            </div>
            <div className="w-full mt-3 text-center bg-white/30 py-3 rounded-lg text-white hover:bg-white/50 cursor-pointer">
              <i className="fab fa-facebook mr-2"></i>Link Github
            </div>

          </div>
          <button className="w-full mt-8 bg-white text-[#080710] py-3 rounded font-semibold text-lg hover:bg-gray-100">
            Create account
          </button>
        </form>
      </div>
    </>
  );
}
