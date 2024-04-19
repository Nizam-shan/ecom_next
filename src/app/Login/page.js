"use client";

import InputComponent from "@/components/FormElements/InputComponents";
import ComponentLevelLoader from "@/components/Loader/componentLevelLoader";
import Notification from "@/components/Notification";
import { GlobalContext } from "@/context";
import { login } from "@/services/login";
import { loginFormControls } from "@/utils";
import Cookies from "js-cookie";

import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

const initialFormData = {
  email: "",
  password: "",
};
export default function Login() {
  const [formData, setFormData] = useState(initialFormData);
  const router = useRouter();
  const {
    isAuthUser,
    setIsAuthUser,
    user,
    setUser,
    componentLevelLoader,
    setComponentLevelLoader,
  } = useContext(GlobalContext);

  function isFormValid() {
    return formData &&
      formData.email &&
      formData.email.trim() !== "" &&
      formData.password &&
      formData.password.trim() !== ""
      ? true
      : false;
  }

  async function handleLogin() {
    setComponentLevelLoader({ loading: true, id: "" });
    const res = await login(formData);
    if (res.success) {
      setIsAuthUser(true); // isAuth state is definned in global state to identify this is a valid user or not
      setUser(res?.finalData?.user); // the user state is set in global and in success of this login the response of this user is stored in this state
      toast.success(res?.message, {
        position: toast.POSITION.TOP_RIGHT,
      });

      setFormData(initialFormData); // if success making the login page as initial = null
      // and need to store the token in cookies or local storage so authorization
      Cookies.set("token", res?.finalData?.token);
      // and also need to store user info to local storage
      localStorage.setItem("user", JSON.stringify(res?.finalData?.user));
      setComponentLevelLoader({ loading: false, id: "" });
      router.push("/");
    } else {
      setIsAuthUser(false); // if not valid user it is rejected
      toast.error(res?.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
      setComponentLevelLoader({ loading: false, id: "" });
    }
  }

  useEffect(() => {
    if (isAuthUser) {
      router.push("/");
    }
  }, []);

  return (
    <>
      <>
        <div className="relative bg-white text-black">
          <div className="flex flex-col items-center justify-between pt-0 pr-10 pb-0 pl-10 mt-auto  xl:px-5 lg:flex-row">
            <div className="flex flex-col justify-center items-center w-full pr-10 pl-10 lg:flex-row">
              <div className="w-full mt-20 mr-0 mb-0 ml-0 relative max-w-2xl lg:mt-0 lg:w-5/12">
                <div className="flex flex-col items-center justify-start pt-10 pr-10 pb-10 pl-10 bg-white shadow-2xl rounded-xl relative z-10">
                  <p className="w-full text-4xl  font-medium text-center font-serif  ">
                    Login
                  </p>

                  <div
                    className="
                w-full mt-6 mr-0 mb-0 ml-0 relative space-y-8"
                  >
                    {loginFormControls.map((controlItems) =>
                      controlItems.componentType === "input" ? (
                        <InputComponent
                          type={controlItems.type}
                          name={controlItems.name}
                          label={controlItems.label}
                          placeholder={controlItems.placeholder}
                          onChange={(e) => {
                            setFormData({
                              ...formData,
                              [controlItems.id]: e.target.value,
                            });
                          }}
                          value={formData[controlItems.id]}
                        />
                      ) : null
                    )}
                    <button
                      className="disabled:opacity-50 inline-flex w-full items-center justify-center bg-black px-6 py-4 text-lg text-white transition-all duration-200 ease-in-out focus:shadow font-medium uppercase tracking-wide"
                      disabled={!isFormValid()}
                      onClick={handleLogin}
                    >
                      {componentLevelLoader && componentLevelLoader.loading ? (
                        <ComponentLevelLoader
                          text={"Loging in"}
                          color={"white"}
                          loading={
                            componentLevelLoader && componentLevelLoader.loading
                          }
                        />
                      ) : (
                        "Login"
                      )}
                    </button>
                    <div className="flex flex-col gap-2">
                      <p>New to website</p>
                      <button
                        className=" inline-flex w-full items-center justify-center bg-black px-6 py-4 text-lg text-white transition-all duration-200 ease-in-out focus:shadow font-medium uppercase tracking-wide"
                        onClick={() => router.push("/register")}
                      >
                        Register
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Notification />
        </div>
      </>
    </>
  );
}
