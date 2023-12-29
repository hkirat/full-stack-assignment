"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import React, { useRef } from "react";

const page = () => {
  const passwordRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  const onSignin = () => {
    console.log(emailRef.current?.value);
  };
  return (
    <>
      <Input placeholder="E-mail" type="email" ref={emailRef} />
      <Input placeholder="Password" type="password" ref={passwordRef} />
      <Button onClick={onSignin}>Sign in</Button>
      <Label>
        Do not have an account?{" "}
        <Link className="text-[#FFA123]" href="/signup">
          Sign up
        </Link>
      </Label>
    </>
  );
};

export default page;
