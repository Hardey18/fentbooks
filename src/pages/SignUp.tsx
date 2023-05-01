import { Spin } from "antd";
import jwtDecode from "jwt-decode";
import { useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import { useMutation } from "react-query";
import { Link, useNavigate } from "react-router-dom";
import { AuthService } from "../services/api/auth";

export default function SignUp() {
  const [signUpData, setSignUpData]: any = useState({});
  const navigate = useNavigate();

  const updateSignUpData = (e: any) => {
    setSignUpData({
      ...signUpData,
      [e.target.name]: e.target.value,
    });
  };

  const { mutateAsync: createSignUp, isLoading } = useMutation((payload) =>
    AuthService.signUp(payload)
  );

  const handleSignUp = (event: any) => {
    event.preventDefault();
    if (signUpData.email && signUpData.password) {
      createSignUp(signUpData).then((res: any) => {
        if (res?.data?.status === "success") {
          toast.success(res?.response?.data?.message);
          navigate("/login");
        } else {
          toast.error(res?.response?.data?.message);
        }
      });
    }
  };
  return (
    <>
      <div>
        <Toaster position="top-right" reverseOrder={false} />
      </div>
      <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <img
            className="mx-auto h-32 w-auto"
            src="logo-main.png"
            alt="Your Company"
          />
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Sign Up
          </h2>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form className="space-y-6" onSubmit={handleSignUp}>
              <div>
                <label
                  htmlFor="firstname"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Firstname
                </label>
                <div className="mt-2">
                  <input
                    id="firstname"
                    name="firstname"
                    type="firstname"
                    onChange={updateSignUpData}
                    value={signUpData.firstname}
                    autoComplete="firstname"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6 px-2"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="lastname"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Lastname
                </label>
                <div className="mt-2">
                  <input
                    id="lastname"
                    name="lastname"
                    type="lastname"
                    onChange={updateSignUpData}
                    value={signUpData.lastname}
                    autoComplete="lastname"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6 px-2"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Email address
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    // type="email"
                    onChange={updateSignUpData}
                    value={signUpData.email}
                    autoComplete="email"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6 px-2"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Password
                </label>
                <div className="mt-2">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    onChange={updateSignUpData}
                    value={signUpData.password}
                    autoComplete="current-password"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div>
                {isLoading ? (
                  <div className="flex justify-center items-center w-full">
                    <Spin />
                  </div>
                ) : (
                  <button
                    type="submit"
                    className="flex w-full justify-center rounded-md bg-green-600 py-2 px-3 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
                    disabled={
                      !signUpData.firstname ||
                      !signUpData.lastname ||
                      !signUpData.email ||
                      !signUpData.password
                    }
                  >
                    Sign up
                  </button>
                )}
              </div>
              <div className="text-center">
                <div className="text-sm">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="font-medium text-green-600 hover:text-green-500"
                  >
                    Login
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
