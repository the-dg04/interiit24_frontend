export default function AuthBackgroundWrapper({ children }) {
  return (
    <div className="absolute bg-[#080710] h-screen w-screen flex items-center justify-center overflow-hidden">
      <div className="absolute w-[430px] h-[520px]">
        <div className="absolute w-[200px] h-[200px] bg-gradient-to-r from-[#1845ad] to-[#23a2f6] rounded-full top-[-80px] left-[-80px]"></div>
        <div className="absolute w-[200px] h-[200px] bg-gradient-to-r from-[#ff512f] to-[#f09819] rounded-full bottom-[-80px] right-[-30px]"></div>
      </div>
      {children}
    </div>
  );
}
