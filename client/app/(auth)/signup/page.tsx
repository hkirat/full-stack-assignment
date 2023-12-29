"use client";
import React, { useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Link from "next/link";

const Signup = () => {
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  const onSignup = () => {
    console.log(emailRef.current?.value);
  };
  return (
    <>
      <Input placeholder="Email address" type="email" ref={emailRef} />
      <Input placeholder="Password" type="password" ref={passwordRef} />
      <Input
        placeholder="Confirm password"
        type="password"
        ref={confirmPasswordRef}
      />
      <Button onClick={onSignup}>Sign up</Button>
      <Label>
        Have an account?{" "}
        <Link href="/signin" className="text-[#FFA123]">
          Sign in
        </Link>
      </Label>
    </>
  );
};

export default Signup;
