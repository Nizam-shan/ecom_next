"use client";

import InputComponent from "@/components/FormElements/InputComponents";
import ComponentLevelLoader from "@/components/Loader/componentLevelLoader";
import Notification from "@/components/Notification";
import { GlobalContext } from "@/context";
import {
  addNewAddress,
  deleteAddress,
  getAllAddress,
  updateAddress,
} from "@/services/address";
import { addNewAddressFormControls } from "@/utils";
import { useRouter } from "next/navigation";

import { useContext, useEffect, useState } from "react";
import { PulseLoader } from "react-spinners";

import { toast } from "react-toastify";

export default function Account() {
  const {
    user,
    addresses,
    setAddresses,
    addressFormData,
    setAddressFormData,
    componentLevelLoader,
    setComponentLevelLoader,
    pageLevelLoader,
    setPageLevelLoader,
  } = useContext(GlobalContext);

  const [showAddressFormData, setShowAddressFormData] = useState(false);
  const [currentEditedAddressId, setCurrentEditedAddressId] = useState(null);
  const router = useRouter();
  async function extractAllAddress() {
    setPageLevelLoader(true);
    const res = await getAllAddress(user?.id);
    if (res.success) {
      setPageLevelLoader(false);
      setAddresses(res.data);
    }
  }

  async function handleUpdateAddress(currentData) {
    setShowAddressFormData(true);
    setAddressFormData({
      fullName: currentData.fullName,
      city: currentData.city,
      country: currentData.country,
      postalCode: currentData.postalCode,
      address: currentData.address,
    });
    setCurrentEditedAddressId(currentData._id);
  }

  async function handleAddOrUpdateAddress(e) {
    setComponentLevelLoader({ loading: true, id: "" });
    const res =
      currentEditedAddressId !== null
        ? await updateAddress({
            ...addressFormData,
            _id: currentEditedAddressId,
          })
        : await addNewAddress({ ...addressFormData, userID: user.id });
    if (res.success) {
      setComponentLevelLoader({ loading: false, id: "" });
      toast.success(res.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
      setAddressFormData({
        fullName: "",
        city: "",
        country: "",
        postalCode: "",
        address: "",
      });

      extractAllAddress();
      setCurrentEditedAddressId(null);
    } else {
      setComponentLevelLoader({ loading: false, id: "" });
      toast.error(res.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
      setAddressFormData({
        fullName: "",
        city: "",
        country: "",
        postalCode: "",
        address: "",
      });
      setCurrentEditedAddressId(null);
    }
  }

  async function handleDeleteAddress(getCurrentAddress) {
    setComponentLevelLoader({ loading: true, id: getCurrentAddress });
    const res = await deleteAddress(getCurrentAddress);
    if (res.success) {
      setComponentLevelLoader({ loading: false, id: "" });
      toast.success(res.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
      extractAllAddress();
    } else {
      setComponentLevelLoader({ loading: false, id: "" });
      toast.error(res.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  }

  useEffect(() => {
    if (user !== null) extractAllAddress();
  }, [user]);

  return (
    <section className="">
      <div className="mx-auto bg-gray-100 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow">
          <div className="p-6 sm:p-12">
            <div className="flex flex-col space-y-4 md:space-y-0 md:space-x-6 md:flex-row">
              {/* render image */}
            </div>
            <div className="flex flex-col flex-1 text-black">
              <h4 className="text-lg font-semibold text-center md:text-left">
                {user?.name}
              </h4>
              <p className="">{user?.email}</p>
              <p className="">{user?.role}</p>
            </div>
            <button
              type="button"
              className="text-white mt-5 inline-block bg-black px-5 py-3 text-xs font-medium uppercase tracking-wide "
            >
              View your order
            </button>
            <div className="mt-6">
              <h1 className="font-bold text-lg text-black">Your Address : </h1>
              {pageLevelLoader ? (
                <PulseLoader
                  color={"#000000"}
                  loading={pageLevelLoader}
                  size={15}
                  data-testid="loader"
                />
              ) : (
                <div className="mt-4 text-black flex flex-col gap-4">
                  {addresses && addresses.length ? (
                    addresses.map((item) => (
                      <div key={item?._id} className="border p-6">
                        <p>Name: {item?.fullName}</p>
                        <p>City:{item?.city}</p>
                        <p>Country:{item?.country}</p>
                        <p>Address:{item?.address}</p>
                        <p>postal code:{item?.postalCode}</p>
                        <button
                          type="button"
                          className="text-white mt-5 mr-5 inline-block bg-black px-5 py-3 text-xs font-medium uppercase tracking-wide "
                          onClick={() => handleUpdateAddress(item)}
                        >
                          Update Address
                        </button>
                        <button
                          onClick={() => handleDeleteAddress(item?._id)}
                          className="text-white mt-5 inline-block bg-black px-5 py-3 text-xs font-medium uppercase tracking-wide "
                        >
                          {componentLevelLoader &&
                          componentLevelLoader.loading &&
                          componentLevelLoader.id === item._id ? (
                            <ComponentLevelLoader
                              text={"Deleting Address"}
                              color={"white"}
                              loading={
                                componentLevelLoader &&
                                componentLevelLoader.loading
                              }
                            />
                          ) : (
                            "  Delete Address"
                          )}
                        </button>{" "}
                      </div>
                    ))
                  ) : (
                    <p className="text-black">
                      No address found please add address below
                    </p>
                  )}
                </div>
              )}
            </div>
            <div className="">
              <button
                type="button"
                className="text-white mt-4 inline-block bg-black px-5 py-3 text-xs font-medium uppercase tracking-wide "
                onClick={() => setShowAddressFormData(!showAddressFormData)}
              >
                {showAddressFormData ? "Hide Address Form" : "Add Address Form"}
              </button>
            </div>
            {showAddressFormData ? (
              <div className="flex flex-col mt-5 justify-center pt-4 items-center">
                <div className="w-full mt-6 mr-0 mb-0 ml-0 space-y-8 text-black ">
                  {addNewAddressFormControls.map((item) => (
                    <InputComponent
                      type={item?.type}
                      name={item.name}
                      placeholder={item.placeholder}
                      value={addressFormData[item.id]}
                      onChange={(event) =>
                        setAddressFormData({
                          ...addressFormData,
                          [item.id]: event.target.value,
                        })
                      }
                    />
                  ))}
                </div>
                <button
                  type="button"
                  className="text-white mt-4 inline-block bg-black px-5 py-3 text-xs font-medium uppercase tracking-wide "
                  onClick={() => handleAddOrUpdateAddress()}
                >
                  {componentLevelLoader && componentLevelLoader.loading ? (
                    <ComponentLevelLoader
                      text={"Saving"}
                      color={"white"}
                      loading={
                        componentLevelLoader && componentLevelLoader.loading
                      }
                    />
                  ) : (
                    "Save"
                  )}
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
      <Notification />
    </section>
  );
}
