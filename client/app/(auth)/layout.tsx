import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import logo from "@/assets/leetcode.svg";
import Image from "next/image";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-screen flex justify-center items-center">
      <Card className="flex flex-col items-center w-96">
        <CardHeader className="flex flex-col items-center">
          <CardTitle>
            <Image src={logo} alt="logo" width={50} height={50} />
          </CardTitle>
          <CardDescription>BEATCODE</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 w-full items-center">
          {children}
        </CardContent>
        <CardFooter>
          <p className="flex justify-center">
            This site is protected by reCAPTCHA and the Google Privacy Policy
            and Terms of Service apply.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AuthLayout;
