"use client";
import { useState, useRef } from "react";
export default function useOTP() {
  const [otp, setOtp] = useState(Array(4).fill("")); // Array with 6 empty strings
  // const [currentIndex,setCurrentIndex]=useState(0);
  const inputRefs = useRef([]); // Array of refs for each input field
  const handleKeyDown = (e) => {
    if (
      !/^[0-9]{1}$/.test(e.key) &&
      e.key !== "Backspace" &&
      e.key !== "Delete" &&
      e.key !== "Tab" &&
      !e.metaKey
    ) {
      e.preventDefault();
    }

    if (e.key === "Delete" || e.key === "Backspace") {
      let index = inputRefs.current.indexOf(e.target);
      if (inputRefs.current[index].value != "") {
        if (index + 1 > 0) {
          setOtp((prevOtp) => [
            ...prevOtp.slice(0, index),
            "",
            ...prevOtp.slice(index + 1),
          ]);
          if (index - 1 >= 0) inputRefs.current[index - 1].focus();
        }
      } else {
        if (index > 0) {
          setOtp((prevOtp) => [
            ...prevOtp.slice(0, index - 1),
            "",
            ...prevOtp.slice(index),
          ]);
          inputRefs.current[index - 1].focus();
        }
      }
    }
  };

  const handleInput = (e) => {
    const { target } = e;
    const index = inputRefs.current.indexOf(target);
    if (target.value) {
      setOtp((prevOtp) => [
        ...prevOtp.slice(0, index),
        target.value,
        ...prevOtp.slice(index + 1),
      ]);
      if (index < otp.length - 1) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleFocus = (e) => {
    e.target.select();
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text");
    if (!new RegExp(`^[0-9]{${otp.length}}$`).test(text)) {
      return;
    }
    const digits = text.split("");
    setOtp(digits);
  };
  const component = (
    <section className="py-10 flex justify-center">
      <div id="otp-form" className="flex gap-2">
        {otp.map((digit, index) => (
          <input
            key={index}
            type="text"
            maxLength={1}
            value={digit}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            onPaste={handlePaste}
            ref={(el) => (inputRefs.current[index] = el)}
            className="w-16 h-16 text-center text-3xl text-gray-400 font-bold bg-white/10 rounded placeholder-white/50"
          />
        ))}
      </div>
    </section>
  );
  return [otp, component];
}
