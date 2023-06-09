import { Fragment, useState } from "react";
import { Dialog, Menu, Transition } from "@headlessui/react";
import {
  Bars3CenterLeftIcon,
  BellIcon,
  ClockIcon,
  CogIcon,
  CreditCardIcon,
  DocumentChartBarIcon,
  HomeIcon,
  QuestionMarkCircleIcon,
  ScaleIcon,
  ShieldCheckIcon,
  UserGroupIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import {
  ChevronDownIcon,
  PlusIcon,
} from "@heroicons/react/20/solid";
import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "react-query";
import { AuthService } from "../services/api/auth";
import { CustomerService } from "../services/api/customer";
import { inputValidationError } from "../utils";
import { Skeleton, Spin } from "antd";
import { toast, Toaster } from "react-hot-toast";

const navigation = [
  { name: "Home", href: "/dashboard", icon: HomeIcon, current: false },
  { name: "Income", href: "/invoice", icon: ScaleIcon, current: false },
  {
    name: "Expenses",
    href: "/transactions",
    icon: ClockIcon,
    current: false,
  },
  { name: "Products", href: "/products", icon: CreditCardIcon, current: false },
  {
    name: "Categories",
    href: "/categories",
    icon: UserGroupIcon,
    current: false,
  },
  {
    name: "Customers",
    href: "/customers",
    icon: DocumentChartBarIcon,
    current: true,
  },
];

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

export default function Customers() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [formData, setFormData]: any = useState({});
  const [file, setFile]: any = useState(null);
  const navigate = useNavigate();

  const updateCustomerData = (e: any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const logout = () => {
    navigate("/login");
    localStorage.removeItem("userToken");
  };
  const userData: any = localStorage.getItem("userData");
  const parsedData = JSON.parse(userData);
  const { isLoading, isError, error, data, isFetching }: any = useQuery(
    ["user-data"],
    () => AuthService.getProfile(parsedData._id),
    {
      keepPreviousData: true,
    }
  );

  const {
    isLoading: customerIsLoading,
    isError: customerIsError,
    error: customerError,
    data: customerData,
    isFetching: customerIsFetching,
  }: any = useQuery(["all-customer"], () => CustomerService.getCustomers(), {
    keepPreviousData: true,
    refetchInterval: 2000,
    refetchIntervalInBackground: true,
  });

  const { mutateAsync: createCustomer, isLoading: isCreateCustomerLoading } =
    useMutation((payload) => CustomerService.createCustomer(payload));

  const handleCustomerUpdate = (event: any) => {
    event.preventDefault();
    createCustomer({
      ...formData,
      customerPhoto: file,
    }).then((res: any) => {
      console.log("RESPONSE", res);
      if (res?.data?.status === "success") {
        toast.success("Customer created successfully!");
        setOpen(false);
      } else {
        toast.error(res?.response?.data?.message);
      }
    });
  };

  return (
    <>
      <div>
        <Toaster position="top-right" reverseOrder={false} />
      </div>
      <div className="min-h-full">
        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-40 lg:hidden"
            onClose={setSidebarOpen}
          >
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
            </Transition.Child>

            <div className="fixed inset-0 z-40 flex">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <Dialog.Panel className="relative flex w-full max-w-xs flex-1 flex-col bg-green-700 pt-5 pb-4">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute top-0 right-0 -mr-12 pt-2">
                      <button
                        type="button"
                        className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                        onClick={() => setSidebarOpen(false)}
                      >
                        <span className="sr-only">Close sidebar</span>
                        <XMarkIcon
                          className="h-6 w-6 text-white"
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                  </Transition.Child>
                  <div className="flex flex-shrink-0 items-center px-4">
                    <img
                      className="h-12 w-auto rounded-full"
                      src="logo.png"
                      alt="Easywire logo"
                    />
                  </div>
                  <nav
                    className="mt-5 h-full flex-shrink-0 divide-y divide-green-800 overflow-y-auto"
                    aria-label="Sidebar"
                  >
                    <div className="space-y-1 px-2">
                      {navigation.map((item) => (
                        <Link
                          key={item.name}
                          to={item.href}
                          className={classNames(
                            item.current
                              ? "bg-green-800 text-white"
                              : "text-green-100 hover:bg-green-600 hover:text-white",
                            "group flex items-center rounded-md px-2 py-2 text-base font-medium"
                          )}
                          aria-current={item.current ? "page" : undefined}
                        >
                          <item.icon
                            className="mr-4 h-6 w-6 flex-shrink-0 text-green-200"
                            aria-hidden="true"
                          />
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  </nav>
                </Dialog.Panel>
              </Transition.Child>
              <div className="w-14 flex-shrink-0" aria-hidden="true">
                {/* Dummy element to force sidebar to shrink to fit close icon */}
              </div>
            </div>
          </Dialog>
        </Transition.Root>

        {/* Static sidebar for desktop */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className="flex flex-grow flex-col overflow-y-auto bg-green-700 pt-5 pb-4">
            <div className="flex flex-shrink-0 items-center px-4">
              <img
                className="h-12 w-auto rounded-full"
                src="logo.png"
                alt="Easywire logo"
              />
            </div>
            <nav
              className="mt-5 flex flex-1 flex-col divide-y divide-green-800 overflow-y-auto"
              aria-label="Sidebar"
            >
              <div className="space-y-1 px-2">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className={classNames(
                      item.current
                        ? "bg-green-800 text-white"
                        : "text-green-100 hover:bg-green-600 hover:text-white",
                      "group flex items-center rounded-md px-2 py-2 text-sm font-medium leading-6"
                    )}
                    aria-current={item.current ? "page" : undefined}
                  >
                    <item.icon
                      className="mr-4 h-6 w-6 flex-shrink-0 text-green-200"
                      aria-hidden="true"
                    />
                    {item.name}
                  </a>
                ))}
              </div>
            </nav>
          </div>
        </div>

        <div className="flex flex-1 flex-col lg:pl-64">
          <div className="flex h-16 flex-shrink-0 border-b border-gray-200 bg-white lg:border-none">
            <button
              type="button"
              className="border-r border-gray-200 px-4 text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500 lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              <Bars3CenterLeftIcon className="h-6 w-6" aria-hidden="true" />
            </button>
            {/* Page title */}
            <div className="flex flex-1 justify-between px-4 sm:px-6 lg:mx-auto lg:max-w-6xl lg:px-8">
              <div className="flex flex-1">
                <h1 className="ml-3 text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:leading-9 mt-4">
                  Customers
                </h1>
              </div>
              <div className="ml-4 flex items-center md:ml-6">
                <button
                  type="button"
                  className="rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                  <span className="sr-only">View notifications</span>
                  <BellIcon className="h-6 w-6" aria-hidden="true" />
                </button>

                {/* Profile dropdown */}
                <Menu as="div" className="relative ml-3">
                  <div>
                    <Menu.Button className="flex max-w-xs items-center rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 lg:rounded-md lg:p-2 lg:hover:bg-gray-50">
                      {data?.data?.data?.profilePhoto ? (
                        <img
                          className="h-8 w-8 rounded-full"
                          src={data?.data?.data?.profilePhoto}
                          alt=""
                        />
                      ) : (
                        <span className="inline-block h-8 w-8 overflow-hidden rounded-full bg-gray-100">
                          <svg
                            className="h-full w-full text-gray-300"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                          </svg>
                        </span>
                      )}
                      <span className="ml-3 hidden text-sm font-medium text-gray-700 lg:block">
                        <span className="sr-only">Open user menu for </span>
                        {data?.data?.data?.companyName}
                      </span>
                      <ChevronDownIcon
                        className="ml-1 hidden h-5 w-5 flex-shrink-0 text-gray-400 lg:block"
                        aria-hidden="true"
                      />
                    </Menu.Button>
                  </div>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <Menu.Item>
                        {({ active }) => (
                          <div
                            onClick={() => navigate("/profile")}
                            className={classNames(
                              active ? "bg-gray-100 cursor-pointer" : "",
                              "block px-4 py-2 text-sm text-gray-700"
                            )}
                          >
                            Your Profile
                          </div>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <div
                            onClick={logout}
                            className={classNames(
                              active ? "bg-gray-100 cursor-pointer" : "",
                              "block px-4 py-2 text-sm text-gray-700"
                            )}
                          >
                            Logout
                          </div>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            </div>
          </div>
          <div className="bg-white py-24">
            {customerData?.data?.data.length > 0 && (
              <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <button
                  type="button"
                  onClick={() => setOpen(true)}
                  className="rounded-md bg-green-600 py-2.5 px-3.5 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
                >
                  Add a new Customer
                </button>
              </div>
            )}
            {customerData?.data?.data.length > 0 ? (
              <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <ul
                  role="list"
                  className="mx-auto mt-20 grid max-w-2xl grid-cols-1 gap-x-6 gap-y-20 sm:grid-cols-2 lg:max-w-4xl lg:gap-x-8 xl:max-w-none"
                >
                  {[...customerData?.data?.data]
                    ?.reverse()
                    .map((person: any) => (
                      <li
                        key={person.customerName}
                        className="flex flex-col gap-6 xl:flex-row"
                      >
                        <div className="flex-auto">
                          <h3 className="text-lg font-semibold leading-8 tracking-tight text-gray-900">
                            {person.customerName}
                          </h3>
                          <p className="text-base leading-7 text-gray-600">
                            {person.note}
                          </p>
                          <p className="text-base leading-7 text-gray-600">
                            {person.customerEmail}
                          </p>
                          <p className="text-base leading-7 text-gray-600">
                            {person.addressLine}, {person.city}, {person.state}
                          </p>
                          <p className="text-base leading-7 text-gray-600">
                            {person.phoneNumber}
                          </p>
                        </div>
                      </li>
                    ))}
                </ul>
              </div>
            ) : customerIsFetching ? (
              <div className="p-4">
                <Skeleton active />
              </div>
            ) : (
              <div className="text-center mt-12">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    vectorEffect="non-scaling-stroke"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-semibold text-gray-900">
                  No customers
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Create a New Customer
                </p>
                <div className="mt-6">
                  <button
                    type="button"
                    onClick={() => setOpen(true)}
                    className="inline-flex items-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
                  >
                    <PlusIcon
                      className="-ml-0.5 mr-1.5 h-5 w-5"
                      aria-hidden="true"
                    />
                    New Customer
                  </button>
                </div>
              </div>
            )}
          </div>
          <Transition.Root show={open} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={setOpen}>
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
              </Transition.Child>

              <div className="fixed inset-0 z-10 overflow-y-auto">
                <div className="flex mt-16 items-end justify-center p-4 text-center sm:items-center sm:p-0">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    enterTo="opacity-100 translate-y-0 sm:scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                    leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                  >
                    <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6 w-full">
                      <div className="mt-5 sm:mt-2">
                        <div className="sm:flex sm:items-start">
                          <div className="w-full">
                            <div className="">
                              <label
                                htmlFor="customerName"
                                className="block text-sm font-medium leading-6 text-gray-900"
                              >
                                Customer Name{" "}
                                <span className="text-red-600">
                                  {inputValidationError(
                                    formData.customerName,
                                    "customerName"
                                  )}
                                </span>
                              </label>
                              <div className="mt-2">
                                <input
                                  id="customerName"
                                  name="customerName"
                                  // type="customerName"
                                  onChange={updateCustomerData}
                                  value={formData.customerName}
                                  autoComplete="customerName"
                                  className="block w-full rounded-md border-0 py-1.5 mb-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 pl-2"
                                />
                              </div>
                            </div>
                            <div className="">
                              <label
                                htmlFor="customerEmail"
                                className="block text-sm font-medium leading-6 text-gray-900"
                              >
                                Customer Email{" "}
                                <span className="text-red-600">
                                  {inputValidationError(
                                    formData.customerEmail,
                                    "customerEmail"
                                  )}
                                </span>
                              </label>
                              <div className="mt-2">
                                <input
                                  id="customerEmail"
                                  name="customerEmail"
                                  // type="customerEmail"
                                  onChange={updateCustomerData}
                                  value={formData.customerEmail}
                                  autoComplete="customerEmail"
                                  className="block w-full rounded-md border-0 py-1.5 mb-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 pl-2"
                                />
                              </div>
                            </div>
                            <div className="">
                              <label
                                htmlFor="phoneNumber"
                                className="block text-sm font-medium leading-6 text-gray-900"
                              >
                                Phone Number{" "}
                                <span className="text-red-600">
                                  {inputValidationError(
                                    formData.phoneNumber,
                                    "phoneNumber"
                                  )}
                                </span>
                              </label>
                              <div className="mt-2">
                                <input
                                  id="phoneNumber"
                                  name="phoneNumber"
                                  // type="phoneNumber"
                                  onChange={updateCustomerData}
                                  value={formData.phoneNumber}
                                  autoComplete="phoneNumber"
                                  className="block w-full rounded-md border-0 py-1.5 mb-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 pl-2"
                                />
                              </div>
                            </div>
                            <div className="">
                              <label
                                htmlFor="addressLine"
                                className="block text-sm font-medium leading-6 text-gray-900"
                              >
                                Address Line{" "}
                                <span className="text-red-600">
                                  {inputValidationError(
                                    formData.addressLine,
                                    "addressLine"
                                  )}
                                </span>
                              </label>
                              <div className="mt-2">
                                <input
                                  id="addressLine"
                                  name="addressLine"
                                  // type="addressLine"
                                  onChange={updateCustomerData}
                                  value={formData.addressLine}
                                  autoComplete="addressLine"
                                  className="block w-full rounded-md border-0 py-1.5 mb-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 pl-2"
                                />
                              </div>
                            </div>
                            <div className="">
                              <label
                                htmlFor="city"
                                className="block text-sm font-medium leading-6 text-gray-900"
                              >
                                City{" "}
                                <span className="text-red-600">
                                  {inputValidationError(formData.city, "city")}
                                </span>
                              </label>
                              <div className="mt-2">
                                <input
                                  id="city"
                                  name="city"
                                  // type="city"
                                  onChange={updateCustomerData}
                                  value={formData.city}
                                  autoComplete="city"
                                  className="block w-full rounded-md border-0 py-1.5 mb-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 pl-2"
                                />
                              </div>
                            </div>
                            <div className="">
                              <label
                                htmlFor="state"
                                className="block text-sm font-medium leading-6 text-gray-900"
                              >
                                State{" "}
                                <span className="text-red-600">
                                  {inputValidationError(
                                    formData.state,
                                    "state"
                                  )}
                                </span>
                              </label>
                              <div className="mt-2">
                                <input
                                  id="state"
                                  name="state"
                                  // type="state"
                                  onChange={updateCustomerData}
                                  value={formData.state}
                                  autoComplete="state"
                                  className="block w-full rounded-md border-0 py-1.5 mb-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 pl-2"
                                />
                              </div>
                            </div>
                            <div className="">
                              <label
                                htmlFor="note"
                                className="block text-sm font-medium leading-6 text-gray-900"
                              >
                                Note{" "}
                                <span className="text-red-600">
                                  {inputValidationError(formData.note, "note")}
                                </span>
                              </label>
                              <div className="mt-2">
                                <textarea
                                  id="note"
                                  name="note"
                                  // type="note"
                                  onChange={updateCustomerData}
                                  value={formData.note}
                                  autoComplete="note"
                                  className="block w-full rounded-md border-0 py-1.5 mb-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 pl-2"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        {isCreateCustomerLoading ? (
                          <div className="flex justify-center items-center w-full">
                            <Spin />
                          </div>
                        ) : (
                          <button
                            type="submit"
                            className="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
                            disabled={
                              !formData.customerName ||
                              !formData.customerEmail ||
                              !formData.phoneNumber ||
                              !formData.addressLine ||
                              !formData.city ||
                              !formData.state ||
                              !formData.note
                              // !file
                            }
                            onClick={handleCustomerUpdate}
                          >
                            Add
                          </button>
                        )}
                      </div>
                    </Dialog.Panel>
                  </Transition.Child>
                </div>
              </div>
            </Dialog>
          </Transition.Root>
        </div>
      </div>
    </>
  );
}
