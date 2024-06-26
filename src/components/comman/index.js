import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";

export default function CommonModel({
  modelTitle,
  mainContent,
  showButton,
  buttonComponent,
  show,
  setShow,
  showModelTitle,
}) {
  return (
    <Transition.Root as={Fragment} show={show}>
      <Dialog as="div" className={"relative z-10"} onClose={setShow}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-900"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-25 transition-opacity"></div>
        </Transition.Child>
        <div className="fixed overflow-hidden inset-0">
          <div className="absolute overflow-hidden inset-0">
            <div className="fixed inset-y-0 right-0  flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="ease-in-out duration-900"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition-opacity duration-150"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Dialog.Panel className={"w-screen max-w-md"}>
                  <div className="flex-col flex h-full overflow-y-scroll bg-white shadow-xl">
                    <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                      {showModelTitle ? (
                        <div className="flex items-start justify-between">
                          <Dialog.Title>{modelTitle}</Dialog.Title>
                        </div>
                      ) : null}
                      <div className="mt-20">{mainContent}</div>
                    </div>
                    {showButton ? (
                      <div className="border-t border-gray-300 px-4 py-6 sm:px-6">
                        {buttonComponent}
                      </div>
                    ) : null}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
