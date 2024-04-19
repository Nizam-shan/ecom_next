"use client";

import InputComponent from "@/components/FormElements/InputComponents";
import SelectComponent from "@/components/FormElements/SelectComponents";
import TileComponent from "@/components/FormElements/TileComponent";
import ComponentLevelLoader from "@/components/Loader/componentLevelLoader";
import Notification from "@/components/Notification";
import { GlobalContext } from "@/context";
import { addNewProduct, updateProduct } from "@/services/admin/products";
import {
  AvailableSizes,
  adminAddProductformControls,
  firebaseConfig,
  firebaseStroageURL,
} from "@/utils";
import { reject } from "bcrypt/promises";
import { initializeApp } from "firebase/app";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { useRouter } from "next/navigation";

import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

const app = initializeApp(firebaseConfig);

const storage = getStorage(app, firebaseStroageURL);

const initialData = {
  name: "",
  price: 0,
  description: "",
  priceDrop: 0,
  deliveryInfo: "",
  onSale: "no",
  sizes: [],
  category: "men",
  imageUrl: "",
};
export default function AdminAddNewProduct() {
  const [formData, setFormData] = useState(initialData);
  const {
    componentLevelLoader,
    setComponentLevelLoader,
    currentUpdatedProduct,
    setCurrentUpdatedProduct,
  } = useContext(GlobalContext);

  useEffect(() => {
    if (currentUpdatedProduct !== null) setFormData(currentUpdatedProduct);
  }, [currentUpdatedProduct]);

  const router = useRouter();

  const createUniqueFileName = (getFile) => {
    const timeStamp = Date.now();
    const randomStringValue = Math.random().toString(36).substring(2, 12);

    return `${getFile.name}-${timeStamp}-${randomStringValue}`;
  };
  async function helperForUploadToFirebase(file) {
    const getFileName = createUniqueFileName(file);
    const storageReference = ref(storage, `ecommerce/${getFileName}`);
    const uploadImage = uploadBytesResumable(storageReference, file);

    return new Promise((resolve, reject) => {
      uploadImage.on(
        "state_changed",
        (snapshot) => {},
        (error) => {
          console.log("promise img firabse error", error);
          reject(error);
        },
        () => {
          getDownloadURL(uploadImage.snapshot.ref)
            .then((downloadUrl) => resolve(downloadUrl))
            .catch((error) => reject(error));
        }
      );
    });
  }
  async function handleImage(e) {
    const extractImageUrl = await helperForUploadToFirebase(e.target.files[0]);

    if (extractImageUrl !== "") {
      setFormData({
        ...formData,
        imageUrl: extractImageUrl,
      });
    }
  }

  function handleTileClick(getCurrentitem) {
    console.log(getCurrentitem);

    let cpySizes = [...formData.sizes];

    const index = cpySizes.findIndex((item) => item.id === getCurrentitem.id);

    if (index === -1) {
      cpySizes.push(getCurrentitem);
    } else {
      cpySizes = cpySizes.filter((item) => item.id !== getCurrentitem.id);
    }

    setFormData({
      ...formData,
      sizes: cpySizes,
    });
  }

  async function handleAddProduct() {
    setComponentLevelLoader({ loading: true, id: "" });
    const response =
      currentUpdatedProduct !== null
        ? await updateProduct(formData)
        : await addNewProduct(formData);
    if (response.success) {
      setComponentLevelLoader({ loading: false, id: "" });
      console.log(response);
      toast.success(response.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
      setFormData(initialData);
      setCurrentUpdatedProduct(null);
      setTimeout(() => {
        router.push("/admin-view/all-products");
      }, 1000);
    } else {
      setComponentLevelLoader({ loading: false, id: "" });
      toast.error(response.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  }
  return (
    <>
      <div className="text-black w-full mt-5 mb-0 ml-0 relative">
        <div className="flex flex-col p-10 items-start justify-start bg-white shadow-2xl rounded-xl relative">
          <div className="w-full mt-6 mr-0 mb-0 ml-0 space-y-8">
            <input
              accept="image/*"
              max="1000000"
              type="file"
              onChange={handleImage}
            />
            <div className="flex gap-2 flex-col">
              <label>Available Sizes</label>
              <TileComponent
                data={AvailableSizes}
                onClick={handleTileClick}
                seleceted={formData.sizes}
              />
            </div>
            {adminAddProductformControls.map((controlItem) =>
              controlItem.componentType === "input" ? (
                <InputComponent
                  type={controlItem.type}
                  placeholder={controlItem.placeholder}
                  label={controlItem.label}
                  value={formData[controlItem.id]}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      [controlItem.id]: e.target.value,
                    });
                  }}
                />
              ) : controlItem.componentType === "select" ? (
                <SelectComponent
                  label={controlItem.label}
                  options={controlItem.options}
                  value={formData[controlItem.id]}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      [controlItem.id]: e.target.value,
                    });
                  }}
                />
              ) : null
            )}
            <button
              onClick={handleAddProduct}
              className="inline-flex items-center w-full justify-center bg-black px-6 py-4 text-white text-lg font-medium uppercase tracking-wide"
            >
              {componentLevelLoader && componentLevelLoader.loading ? (
                <ComponentLevelLoader
                  text={
                    currentUpdatedProduct !== null
                      ? "Updating Product"
                      : "  Adding Product"
                  }
                  color={"white"}
                  loading={componentLevelLoader && componentLevelLoader.loading}
                />
              ) : currentUpdatedProduct !== null ? (
                "Update Product"
              ) : (
                "  Add Product"
              )}
            </button>
          </div>
        </div>
        <Notification />
      </div>
    </>
  );
}
