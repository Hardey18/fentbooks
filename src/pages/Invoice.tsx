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
  BanknotesIcon,
  BuildingOfficeIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  CheckIcon,
} from "@heroicons/react/20/solid";
import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "react-query";
import { AuthService } from "../services/api/auth";
import { InvoiceService } from "../services/api/invoice";
import { inputValidationError, numberWithCommas } from "../utils";
import { Button, Divider, Input, Select, Skeleton, Space, Spin } from "antd";
import { ProductService } from "../services/api/product";
import { CustomerService } from "../services/api/customer";
import { toast, Toaster } from "react-hot-toast";
import { CategoryService } from "../services/api/categories";

const navigation = [
  { name: "Home", href: "/dashboard", icon: HomeIcon, current: false },
  { name: "Income", href: "/invoice", icon: ScaleIcon, current: true },
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
    current: false,
  },
];
const statusStyles: any = {
  success: "bg-green-100 text-green-800",
  processing: "bg-yellow-100 text-yellow-800",
  failed: "bg-gray-100 text-gray-800",
};

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

export default function Invoice() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [productId, setProductId] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [formData, setFormData]: any = useState({});
  const navigate = useNavigate();

  const [showProduct, setShowProduct] = useState(false);
  const [showCustomer, setShowCustomer] = useState(false);
  const [vatValue, setVatValue] = useState("")

  const handleShowProduct = (event: any) => {
    setShowProduct((current) => !current);
  };
  const handleShowCustomer = (event: any) => {
    setShowCustomer((current) => !current);
  };

  const updateFormData = (e: any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleVatChange = (value: string) => {
    setVatValue(value)
  }

  console.log("FORM DATA", vatValue);
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

  const { mutateAsync: createInvoice, isLoading: isCreateInvoiceLoading } =
    useMutation((payload) =>
      InvoiceService.createInvoice(payload, customerId, productId)
    );

  const handleInvoiceUpdate = (event: any) => {
    event.preventDefault();
    createInvoice({...formData, vat: vatValue}).then((res: any) => {
      if (res?.data?.status === "success") {
        setOpen(false);
        toast.success("Invoice created successfully!");
      }
    });
  };

  const {
    isLoading: invoiceIsLoading,
    isError: invoiceIsError,
    error: invoiceError,
    data: invoiceData,
    isFetching: invoiceIsFetching,
  }: any = useQuery(["invoice-data"], () => InvoiceService.getInvoice(), {
    keepPreviousData: true,
    // refetchInterval: 2000,
    refetchIntervalInBackground: true,
  });

  const {
    isLoading: productIsLoading,
    isError: productIsError,
    error: productError,
    data: productData,
    isFetching: productIsFetching,
  }: any = useQuery(["product-data"], () => ProductService.getProducts(), {
    keepPreviousData: true,
    // refetchInterval: 2000,
    refetchIntervalInBackground: true,
  });

  const {
    isLoading: customerIsLoading,
    isError: customerIsError,
    error: customerError,
    data: customerData,
    isFetching: customerIsFetching,
  }: any = useQuery(["customer-data"], () => CustomerService.getCustomers(), {
    keepPreviousData: true,
    // refetchInterval: 2000,
    refetchIntervalInBackground: true,
  });
  const [categoryId, setCategoryId]: any = useState();

  const { mutateAsync: createProduct, isLoading: isCreateProductLoading } =
    useMutation((payload) => ProductService.createProduct(payload, categoryId));

  const [productFormData, setProductFormData]: any = useState({});
  const [customerFormData, setCustomerFormData]: any = useState({});

  const updateProductFormData = (e: any) => {
    setProductFormData({
      ...productFormData,
      [e.target.name]: e.target.value,
    });
  };
  const updateCustomerFormData = (e: any) => {
    setCustomerFormData({
      ...customerFormData,
      [e.target.name]: e.target.value,
    });
  };

  const handleProductUpdate = (event: any) => {
    event.preventDefault();
    createProduct(productFormData).then((res: any) => {
      if (res?.data?.status === "success") {
        toast.success("Product created successfully!");
        setShowProduct((current) => !current);
      } else {
        toast.error(res?.response?.data?.message);
      }
    });
  };

  const {
    isLoading: categoryIsLoading,
    isError: categoryIsError,
    error: categoryError,
    data: categoryData,
    isFetching: categoryIsFetching,
  }: any = useQuery(["category-data"], () => CategoryService.getCategories(), {
    keepPreviousData: true,
    // refetchInterval: 2000,
    refetchIntervalInBackground: true,
  });
  const [file, setFile]: any = useState(null);

  const { mutateAsync: createCustomer, isLoading: isCreateCustomerLoading } =
    useMutation((payload) => CustomerService.createCustomer(payload));

  const handleCustomerUpdate = (event: any) => {
    event.preventDefault();
    createCustomer({
      ...customerFormData,
      customerPhoto: file,
    }).then((res: any) => {
      console.log("RESPONSE", res);
      if (res?.data?.status === "success") {
        toast.success("Customer created successfully!");
        setShowCustomer((current) => !current);
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
                  Invoice
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
          {/* <div className="px-4 sm:px-6 lg:px-8 mt-8">
            {invoiceData?.data?.data.length > 0 && (
              <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                  <p className="mt-2 text-sm text-gray-700">
                    A list of all your invoice
                  </p>
                </div>
                <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                  <button
                    type="button"
                    onClick={() => setOpen(true)}
                    className="block rounded-md bg-green-600 py-2 px-3 text-center text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-green:outline-green-600"
                  >
                    Create a New Invoice
                  </button>
                </div>
              </div>
            )}
          </div> */}
          {/* <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            {invoiceData?.data?.data.length > 0 ? (
              <div className="bg-white py-2 sm:py-6">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                  {invoiceData?.data?.data.map((invoice: any) => (
                    <div className="mx-auto mt-4 max-w-2xl rounded-3xl ring-1 ring-gray-200 sm:mt-4 lg:mx-0 lg:flex lg:max-w-none">
                      <div className="p-8 sm:p-10 lg:flex-auto">
                        <h3 className="text-2xl font-bold tracking-tight text-gray-900">
                          Customer Details
                        </h3>
                        <p className="text-base leading-7 text-gray-600">
                          Name: {invoice?.customer[0].customerName}
                        </p>
                        <p className="text-base leading-7 text-gray-600">
                          Email: {invoice?.customer[0].customerEmail}
                        </p>
                        <p className="text-base leading-7 text-gray-600">
                          Phone Number: {invoice?.customer[0].phoneNumber}
                        </p>
                        <p className="mb-6 text-base leading-7 text-gray-600">
                          Address: {invoice?.customer[0].addressLine}{" "}
                          {invoice?.customer[0].city}{" "}
                          {invoice?.customer[0].state}
                        </p>
                        <h3 className="text-2xl font-bold tracking-tight text-gray-900">
                          Product Details
                        </h3>
                        <p className="text-base leading-7 text-gray-600">
                          Name: {invoice?.product[0].productName}
                        </p>
                        <p className="text-base leading-7 text-gray-600">
                          Description: {invoice?.product[0].description}
                        </p>
                        <div className="mt-10 flex items-center gap-x-4">
                          <h4 className="flex-none text-sm font-semibold leading-6 text-green-600">
                            What’s included
                          </h4>
                          <div className="h-px flex-auto bg-gray-100" />
                        </div>
                        <ul
                          role="list"
                          className="mt-8 grid grid-cols-1 gap-4 text-sm leading-6 text-gray-600 sm:grid-cols-2 sm:gap-6"
                        >
                          <li className="flex gap-x-3">
                            <CheckIcon
                              className="h-6 w-5 flex-none text-green-600"
                              aria-hidden="true"
                            />
                            Price:{" "}
                            <span className="font-bold">
                              &#8358;
                              {numberWithCommas(+invoice?.product[0].price)}
                            </span>
                          </li>
                          <li className="flex gap-x-3">
                            <CheckIcon
                              className="h-6 w-5 flex-none text-green-600"
                              aria-hidden="true"
                            />
                            Shipping Fee:{" "}
                            <span className="font-bold">
                              &#8358;{numberWithCommas(+invoice?.shippingCost)}
                            </span>
                          </li>
                          <li className="flex gap-x-3">
                            <CheckIcon
                              className="h-6 w-5 flex-none text-green-600"
                              aria-hidden="true"
                            />
                            15% Tax Rate:{" "}
                            <span className="font-bold">
                              &#8358;
                              {numberWithCommas(
                                +invoice?.product[0].price * 0.15
                              )}
                            </span>
                          </li>
                        </ul>
                      </div>
                      <div className="-mt-2 p-2 lg:mt-0 lg:w-full lg:max-w-md lg:flex-shrink-0">
                        <div className="rounded-2xl bg-gray-50 py-10 text-center ring-1 ring-inset ring-gray-900/5 lg:flex lg:flex-col lg:justify-center lg:py-16">
                          <div className="mx-auto max-w-xs px-8">
                            <p className="text-base font-semibold text-gray-600">
                              {invoiceData?.data?.data[0].invoiceId}
                            </p>
                            <p className="mt-6 flex items-baseline justify-center gap-x-2">
                              <span className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900">
                                <span>
                                  &#8358;
                                  {numberWithCommas(
                                    +invoice?.totalPrice.toFixed(0)
                                  )}
                                </span>
                              </span>
                              <span className="text-sm font-semibold leading-6 tracking-wide text-gray-600">
                                NAIRA
                              </span>
                            </p>
                            <Link
                              to={`/invoice/${invoice?._id}`}
                              className="mt-10 block w-full rounded-md bg-green-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
                            >
                              View Invoice
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : invoiceIsFetching ? (
              <div className="px-4 md:px-2">
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
                  No invoice
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Create a New Invoice
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
                    New Invoice
                  </button>
                </div>
              </div>
            )}
          </div> */}
          <div className="px-4 sm:px-6 lg:px-8 mt-8">
            {invoiceData?.data?.data.length > 0 && (
              <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                  <p className="mt-2 text-sm text-gray-700">
                    A list of all your invoice
                  </p>
                </div>
                <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                  <button
                    type="button"
                    onClick={() => setOpen(true)}
                    className="block rounded-md bg-green-600 py-2 px-3 text-center text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-green:outline-indigo-600"
                  >
                    Create a new Invoice
                  </button>
                </div>
              </div>
            )}
            <div className="mt-8 flow-root">
              <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                  {invoiceData?.data?.data.length > 0 ? (
                    <table className="min-w-full divide-y divide-gray-300">
                      <thead>
                        <tr className="divide-x divide-gray-200">
                          <th
                            scope="col"
                            className="py-3.5 pl-4 pr-4 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                          >
                            CUSTOMER NAME
                          </th>
                          <th
                            scope="col"
                            className="px-4 py-3.5 text-left text-sm font-semibold text-gray-900"
                          >
                            PRODUCT NAME
                          </th>
                          <th
                            scope="col"
                            className="px-4 py-3.5 text-left text-sm font-semibold text-gray-900"
                          >
                            TOTAL
                          </th>
                          <th
                            scope="col"
                            className="py-3.5 pl-4 pr-4 text-left text-sm font-semibold text-gray-900 sm:pr-0"
                          >
                            ACTION
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 bg-white">
                        {invoiceData?.data?.data.map((person: any) => (
                          <tr
                            key={person.id}
                            className="divide-x divide-gray-200"
                          >
                            <td className="whitespace-nowrap py-4 pl-4 pr-4 text-sm font-medium text-gray-900 sm:pl-0">
                              {person.customer[0].customerName}
                            </td>
                            <td className="whitespace-nowrap p-4 text-sm text-gray-500">
                              {person.product[0].productName}
                            </td>
                            <td className="whitespace-nowrap p-4 text-sm text-gray-500">
                              &#8358;
                              {numberWithCommas(+person.grandTotal.toFixed(0))}
                            </td>
                            <td className="whitespace-nowrap py-4 pl-4 pr-4 text-sm text-gray-500 sm:pr-0">
                              <Link
                                to={`/invoice/${person?._id}`}
                                className="block w-full rounded-md bg-green-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
                              >
                                View Invoice
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : productIsFetching ? (
                    <div className="px-4 md:px-2">
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
                        No invoice
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Create a New Invoice
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
                          New Invoice
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
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
                                htmlFor="addressLine"
                                className="block text-sm font-medium leading-6 text-gray-900"
                              >
                                Select Customer{" "}
                                <span className="text-red-600">
                                  {inputValidationError(
                                    formData.addressLine,
                                    "addressLine"
                                  )}
                                </span>
                              </label>
                              <div className="mt-2 w-full mb-6">
                                <Select
                                  className="w-full"
                                  placeholder="Select Customer"
                                  allowClear
                                  optionFilterProp="children"
                                  options={customerData?.data?.data?.map(
                                    (data: any) => {
                                      return {
                                        value: data._id,
                                        label: data.customerName,
                                      };
                                    }
                                  )}
                                  filterOption={(input: any, option: any) =>
                                    (option?.product ?? "")
                                      .toLowerCase()
                                      .includes(input.toLowerCase())
                                  }
                                  onChange={(e: any) => {
                                    setCustomerId(e);
                                  }}
                                  dropdownRender={(menu) => (
                                    <>
                                      {menu}
                                      <Divider style={{ margin: "8px 0" }} />
                                      {showCustomer ? (
                                        <Button
                                          type="text"
                                          className="mb-4"
                                          onClick={handleShowCustomer}
                                        >
                                          Hide Customer
                                        </Button>
                                      ) : (
                                        <Button
                                          type="text"
                                          onClick={handleShowCustomer}
                                        >
                                          Add Customer
                                        </Button>
                                      )}
                                      {showCustomer && (
                                        <Space
                                          style={{
                                            padding: "0 8px 4px",
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "flex-start",
                                          }}
                                        >
                                          <Input
                                            placeholder="Full Name"
                                            value={customerFormData.customerName}
                                            name="customerName"
                                            onChange={updateCustomerFormData}
                                            style={{
                                              border: "1px solid lightgrey",
                                              borderRadius: "6px",
                                            }}
                                          />
                                          <Input
                                            placeholder="Email"
                                            value={customerFormData.customerEmail}
                                            name="customerEmail"
                                            onChange={updateCustomerFormData}
                                            style={{
                                              border: "1px solid lightgrey",
                                              borderRadius: "6px",
                                            }}
                                          />
                                          <Input
                                            placeholder="Phone"
                                            value={customerFormData.phoneNumber}
                                            name="phoneNumber"
                                            onChange={updateCustomerFormData}
                                            style={{
                                              border: "1px solid lightgrey",
                                              borderRadius: "6px",
                                            }}
                                          />
                                          <Input
                                            placeholder="Address"
                                            value={customerFormData.addressLine}
                                            name="addressLine"
                                            onChange={updateCustomerFormData}
                                            style={{
                                              border: "1px solid lightgrey",
                                              borderRadius: "6px",
                                            }}
                                          />
                                          <Input
                                            placeholder="City"
                                            value={customerFormData.city}
                                            name="city"
                                            onChange={updateCustomerFormData}
                                            style={{
                                              border: "1px solid lightgrey",
                                              borderRadius: "6px",
                                            }}
                                          />
                                          <Input
                                            placeholder="State"
                                            value={customerFormData.state}
                                            name="state"
                                            onChange={updateCustomerFormData}
                                            style={{
                                              border: "1px solid lightgrey",
                                              borderRadius: "6px",
                                            }}
                                          />
                                          <Input
                                            placeholder="Note"
                                            value={customerFormData.note}
                                            name="note"
                                            onChange={updateCustomerFormData}
                                            style={{
                                              border: "1px solid lightgrey",
                                              borderRadius: "6px",
                                            }}
                                          />
                                          <Button
                                            type="text"
                                            // disabled={
                                            //   !categoryId ||
                                            //   !productFormData.productName
                                            // }
                                            onClick={handleCustomerUpdate}
                                          >
                                            Submit
                                          </Button>
                                        </Space>
                                      )}
                                    </>
                                  )}
                                />
                              </div>
                            </div>
                            <div className="">
                              <label
                                htmlFor="addressLine"
                                className="block text-sm font-medium leading-6 text-gray-900"
                              >
                                Select Product or Service{" "}
                                <span className="text-red-600">
                                  {inputValidationError(
                                    formData.addressLine,
                                    "addressLine"
                                  )}
                                </span>
                              </label>
                              <div className="mt-2 w-full mb-6">
                                <Select
                                  className="w-full"
                                  placeholder="Select Product or Service"
                                  allowClear
                                  optionFilterProp="children"
                                  options={productData?.data?.data?.map(
                                    (data: any) => {
                                      return {
                                        value: data._id,
                                        label: data.productName,
                                      };
                                    }
                                  )}
                                  filterOption={(input: any, option: any) =>
                                    (option?.product ?? "")
                                      .toLowerCase()
                                      .includes(input.toLowerCase())
                                  }
                                  onChange={(e: any) => {
                                    setProductId(e);
                                  }}
                                  dropdownRender={(menu) => (
                                    <>
                                      {menu}
                                      <Divider style={{ margin: "8px 0" }} />
                                      {showProduct ? (
                                        <Button
                                          type="text"
                                          className="mb-4"
                                          onClick={handleShowProduct}
                                        >
                                          Hide Product
                                        </Button>
                                      ) : (
                                        <Button
                                          type="text"
                                          onClick={handleShowProduct}
                                        >
                                          Add Product
                                        </Button>
                                      )}
                                      {showProduct && (
                                        <Space
                                          style={{
                                            padding: "0 8px 4px",
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "flex-start",
                                          }}
                                        >
                                          <Input
                                            placeholder="Enter Product"
                                            value={productFormData.productName}
                                            name="productName"
                                            onChange={updateProductFormData}
                                            style={{
                                              border: "1px solid lightgrey",
                                              borderRadius: "6px",
                                            }}
                                          />
                                          <Select
                                            className="w-full"
                                            placeholder="Select Category"
                                            allowClear
                                            optionFilterProp="children"
                                            options={categoryData?.data?.data?.map(
                                              (data: any) => {
                                                return {
                                                  value: data._id,
                                                  label: data.category,
                                                };
                                              }
                                            )}
                                            filterOption={(
                                              input: any,
                                              option: any
                                            ) =>
                                              (option?.category ?? "")
                                                .toLowerCase()
                                                .includes(input.toLowerCase())
                                            }
                                            onChange={(e: any) => {
                                              setCategoryId(e);
                                            }}
                                          />
                                          <Button
                                            type="text"
                                            disabled={
                                              !categoryId ||
                                              !productFormData.productName
                                            }
                                            onClick={handleProductUpdate}
                                          >
                                            Submit
                                          </Button>
                                        </Space>
                                      )}
                                    </>
                                  )}
                                />
                              </div>
                            </div>

                            <div className="">
                              <label
                                htmlFor="description"
                                className="block text-sm font-medium leading-6 text-gray-900"
                              >
                                Description{" "}
                                <span className="text-red-600">
                                  {inputValidationError(
                                    formData.description,
                                    "description"
                                  )}
                                </span>
                              </label>
                              <div className="mt-2">
                                <input
                                  id="description"
                                  name="description"
                                  // type="description"
                                  onChange={updateFormData}
                                  value={formData.description}
                                  autoComplete="description"
                                  className="block w-full rounded-md border-0 py-1.5 mb-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6 pl-2"
                                />
                              </div>
                            </div>
                            <div className="">
                              <label
                                htmlFor="totalPrice"
                                className="block text-sm font-medium leading-6 text-gray-900"
                              >
                                Unit Price{" "}
                                <span className="text-red-600">
                                  {inputValidationError(
                                    formData.totalPrice,
                                    "totalPrice"
                                  )}
                                </span>
                              </label>
                              <div className="mt-2">
                                <input
                                  id="totalPrice"
                                  name="totalPrice"
                                  // type="totalPrice"
                                  onChange={updateFormData}
                                  value={formData.totalPrice}
                                  autoComplete="totalPrice"
                                  className="block w-full rounded-md border-0 py-1.5 mb-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6 pl-2"
                                />
                              </div>
                            </div>
                            <div className="">
                              <label
                                htmlFor="description"
                                className="block text-sm font-medium leading-6 text-gray-900"
                              >
                                Quantity{" "}
                                <span className="text-red-600">
                                  {inputValidationError(
                                    formData.quantity,
                                    "quantity"
                                  )}
                                </span>
                              </label>
                              <div className="mt-2">
                                <input
                                  id="quantity"
                                  name="quantity"
                                  // type="quantity"
                                  onChange={updateFormData}
                                  value={formData.quantity}
                                  autoComplete="quantity"
                                  className="block w-full rounded-md border-0 py-1.5 mb-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6 pl-2"
                                />
                              </div>
                            </div>
                            <div className="">
                              <label
                                htmlFor="vat"
                                className="block text-sm font-medium leading-6 text-gray-900"
                              >
                                VAT{" "}
                                <span className="text-red-600">
                                  {inputValidationError(formData.vat, "vat")}
                                </span>
                              </label>
                              <div className="mt-2 mb-4">
                                <Select
                                  className="w-full"
                                  placeholder="Select VAT"
                                  id="vat"
                                  // name="vat"
                                  allowClear
                                  optionFilterProp="children"
                                  options={[
                                    { value: '0', label: '0' },
                                    { value: '7.5', label: '7.5' }
                                  ]}
                                  onChange={handleVatChange}
                                >
                                  
                                </Select>
                                {/* <input
                                  id="vat"
                                  name="vat"
                                  type="number"
                                  onChange={updateFormData}
                                  value={formData.vat}
                                  autoComplete="vat"
                                  className="block w-full rounded-md border-0 py-1.5 mb-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6 pl-2"
                                /> */}
                              </div>
                            </div>
                            <div className="">
                              <label
                                htmlFor="vat"
                                className="block text-sm font-medium leading-6 text-gray-900"
                              >
                                Shipping Cost{" "}
                                <span className="text-red-600">
                                  {inputValidationError(
                                    formData.shippingCost,
                                    "shippingCost"
                                  )}
                                </span>
                              </label>
                              <div className="mt-2">
                                <input
                                  id="shippingCost"
                                  name="shippingCost"
                                  // type="shippingCost"
                                  onChange={updateFormData}
                                  value={formData.shippingCost}
                                  autoComplete="shippingCost"
                                  className="block w-full rounded-md border-0 py-1.5 mb-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6 pl-2"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        {isCreateInvoiceLoading ? (
                          <div className="flex justify-center items-center w-full">
                            <Spin />
                          </div>
                        ) : (
                          <button
                            type="submit"
                            className="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
                            disabled={
                              !formData.shippingCost ||
                              !productId ||
                              !customerId
                            }
                            onClick={handleInvoiceUpdate}
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
