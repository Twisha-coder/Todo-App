import React, { useState } from "react";
import { Input } from "../components/index.js";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../features/login/authSlice.js";
import { login } from "../APIs/backend.api.js";
import { setAuth } from "../persist/authPersist.js";
import { setLoading } from "../features/loadingSlice.js";
import { setError, setSuccess } from "../features/messageSlice.js";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

function Signin() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    trigger,
    control,
  } = useForm();

  const hanleRememberMeClick = () => {
    console.log("Remember me clicked");
  }

  const submitHandler = async (data) => {
    console.log(data);
    dispatch(setLoading({ isLoading: true }));
    // validate all details
    try {
      const res = await login(data, "POST");

      const userData = await res.json();

      if (res.ok) {
        dispatch(setLoading({ isLoading: false }));
        dispatch(
          setSuccess({
            isMessage: true,
            message: userData.message,
            type: "success",
          })
        );
        dispatch(setUser({ user: userData.data, isAuthenticated: true }));
        setAuth(userData.data);
        navigate("/");
      } else {
        dispatch(setLoading({ isLoading: false }));
        dispatch(
          setError({
            isMessage: true,
            message: userData.message,
            type: "error",
          })
        );
      }
    } catch (error) {
      dispatch(
        setError({
          isMessage: true,
          message: "Something went wrong!",
          type: "error",
        })
      );
    }
  };

  return (
    <div className="h-screen max-w-[450px] flex items-center justify-center flex-col gap-8 text-white m-auto">
      <Helmet>
        <title>Sign In | TODO</title>
      </Helmet>
      <div className="form bg-neutral-800 border border-neutral-600 lg:p-10 md:p-5 p-5 rounded-2xl w-full flex flex-col items-center justify-center gap-6 mx-5">
        <h1 className="text-3xl font-bold">Login</h1>
        <form
          className="flex flex-col gap-6 w-full"
          onSubmit={handleSubmit(submitHandler)}
        >
          <Input
            title="Email"
            name="email"
            type="email"
            register={register}
            errors={errors}
            validation={{
              required: true,
              pattern: /^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$/,
            }}
            watch={watch}
            control={control}
            trigger={trigger}
          />
          <Input
            title={"Password"}
            name="password"
            type="password"
            register={register}
            watch={watch}
            trigger={trigger}
            errors={errors}
            validation={{ required: true, pattern: /^[a-zA-Z0-9]+$/ }}
          />
          <div className="smallScreen flex justify-between items-center">
            <div className="flex gap-2">
              <input
                type="checkbox"
                name="remember"
                id="remember"
                onClick={hanleRememberMeClick}
              />
              <label htmlFor="remember">Remember me</label>
            </div>
            <Link to='/forget-password'><p>Forget Password</p></Link>
          </div>
          <button
            type="submit"
            className="bg-zinc-100 rounded-lg px-3 py-2 bg-opacity-30 text-black hover:bg-zinc-50 transition-all font-bold"
          >
            Login
          </button>
        </form>
      </div>
          Not a member? signup
    </div>
  );
}

export default Signin;
