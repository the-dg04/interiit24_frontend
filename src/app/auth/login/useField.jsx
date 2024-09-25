"use client"
import { useState } from "react";

export default function useField(props) {
  const [value, setValue] = useState("");
  const component = (
    <>
      <label for="username" class="block mt-6 text-white text-lg">
        {props.title}
      </label>
      <input
        type="text"
        placeholder={props.placeholder}
        onChange={(e) => {
          setValue(e.target.value);
        }}
        value={value}
        class="w-full h-12 bg-white/10 rounded mt-2 px-3 text-white placeholder-white/50"
      />
    </>
  );
  return [value, component];
}
