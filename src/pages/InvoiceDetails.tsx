import { Fragment, useState } from "react";
import { Dialog, Menu, Transition, Popover } from "@headlessui/react";
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
  Bars3Icon,
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
  ArrowLongLeftIcon,
  HandThumbUpIcon,
  PaperClipIcon,
  UserIcon,
  BackwardIcon,
  BackspaceIcon,
} from "@heroicons/react/20/solid";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "react-query";
import { AuthService } from "../services/api/auth";
import { InvoiceService } from "../services/api/invoice";
import { numberWithCommas } from "../utils";
import { toast, Toaster } from "react-hot-toast";
import { Spin } from "antd";
import { GrPrevious } from "react-icons/gr";
import { EmailService } from "../services/api/sendEmail";

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
const user = {
  name: "Whitney Francis",
  email: "whitney@example.com",
  imageUrl:
    "https://images.unsplash.com/photo-1517365830460-955ce3ccd263?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=256&h=256&q=80",
};
const navigation2 = [
  { name: "Dashboard", href: "#" },
  { name: "Jobs", href: "#" },
  { name: "Applicants", href: "#" },
  { name: "Company", href: "#" },
];
const breadcrumbs = [
  { name: "Jobs", href: "#", current: false },
  { name: "Front End Developer", href: "#", current: false },
  { name: "Applicants", href: "#", current: true },
];
const userNavigation = [
  { name: "Your Profile", href: "#" },
  { name: "Settings", href: "#" },
  { name: "Sign out", href: "#" },
];
const attachments = [
  { name: "resume_front_end_developer.pdf", href: "#" },
  { name: "coverletter_front_end_developer.pdf", href: "#" },
];
const eventTypes = {
  applied: { icon: UserIcon, bgColorClass: "bg-gray-400" },
  advanced: { icon: HandThumbUpIcon, bgColorClass: "bg-blue-500" },
  completed: { icon: CheckIcon, bgColorClass: "bg-green-500" },
};

const comments = [
  {
    id: 1,
    name: "Leslie Alexander",
    date: "4d ago",
    imageId: "1494790108377-be9c29b29330",
    body: "Ducimus quas delectus ad maxime totam doloribus reiciendis ex. Tempore dolorem maiores. Similique voluptatibus tempore non ut.",
  },
  {
    id: 2,
    name: "Michael Foster",
    date: "4d ago",
    imageId: "1519244703995-f4e0f30006d5",
    body: "Et ut autem. Voluptatem eum dolores sint necessitatibus quos. Quis eum qui dolorem accusantium voluptas voluptatem ipsum. Quo facere iusto quia accusamus veniam id explicabo et aut.",
  },
  {
    id: 3,
    name: "Dries Vincent",
    date: "4d ago",
    imageId: "1506794778202-cad84cf45f1d",
    body: "Expedita consequatur sit ea voluptas quo ipsam recusandae. Ab sint et voluptatem repudiandae voluptatem et eveniet. Nihil quas consequatur autem. Perferendis rerum et.",
  },
];
// const secondaryNavigation = [
//   { name: 'Settings', href: '#', icon: CogIcon },
//   { name: 'Help', href: '#', icon: QuestionMarkCircleIcon },
//   { name: 'Privacy', href: '#', icon: ShieldCheckIcon },
// ]
const cards = [
  { name: "Account balance", href: "#", icon: ScaleIcon, amount: "$30,659.45" },
  { name: "Total Income", href: "#", icon: ScaleIcon, amount: "$30,659.45" },
  { name: "Total Expenses", href: "#", icon: ScaleIcon, amount: "$30,659.45" },
  { name: "Net Worth", href: "#", icon: ScaleIcon, amount: "$30,659.45" },
  // More items...
];
const includedFeatures = [
  "Private forum access",
  "Member resources",
  "Entry to annual conference",
  "Official member t-shirt",
];
const transactions = [
  {
    id: 1,
    name: "Payment to Molly Sanders",
    href: "#",
    amount: "$20,000",
    currency: "USD",
    status: "success",
    date: "July 11, 2020",
    datetime: "2020-07-11",
  },
  // More transactions...
];
const statusStyles: any = {
  success: "bg-green-100 text-green-800",
  processing: "bg-yellow-100 text-yellow-800",
  failed: "bg-gray-100 text-gray-800",
};

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

export default function InvoiceDetails() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const navigate = useNavigate();
  const invoiceId = window.location.pathname.split("/").at(-1);
  const logout = () => {
    navigate("/login");
    localStorage.removeItem("userToken");
  };

  const {
    isLoading: invoiceIsLoading,
    isError: invoiceIsError,
    error: invoiceError,
    data: invoiceData,
    isFetching: invoiceIsFetching,
  }: any = useQuery(
    ["invoice-single-data"],
    () => InvoiceService.getSingleInvoice(invoiceId),
    {
      keepPreviousData: true,
      refetchInterval: 2000,
      refetchIntervalInBackground: true,
    }
  );
  console.log("INVOICE DATA", invoiceData);
  const userData: any = localStorage.getItem("userData");
  const parsedData = JSON.parse(userData);
  const { isLoading, isError, error, data, isFetching }: any = useQuery(
    ["user-data"],
    () => AuthService.getProfile(parsedData._id),
    {
      keepPreviousData: true,
    }
  );

  const { mutateAsync: emailInvoice, isLoading: isEmailInvoiceLoading } =
    useMutation((payload) => EmailService.emailInvoice(invoiceId));

  const handleSendEmail = (event: any) => {
    event.preventDefault();
    emailInvoice().then((res: any) => {
      if (res?.data?.status === "success") {
        setOpen(false);
        toast.success("Email sent to customer successfully");
      } else {
        toast.error(res?.response?.data?.message);
      }
    });
  };

  const { mutateAsync: verifyInvoice, isLoading: isVerifyInvoiceLoading } =
    useMutation((payload) =>
      InvoiceService.verifyInvoice(invoiceId, { amount })
    );

  const handleInvoiceUpdate = (event: any) => {
    event.preventDefault();
    verifyInvoice().then((res: any) => {
      if (res?.data?.status === "success") {
        setOpen(false);
        toast.success("Invoice confirmed successfully");
      } else {
        toast.error(res?.response?.data?.message);
      }
    });
  };

  console.log("INVOICE DATA", invoiceData?.data?.data[0].verified);
  return (
    <>
      <div className="min-h-full">
        <div>
          <Toaster position="top-right" reverseOrder={false} />
        </div>
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
                  Invoice Detail
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
          <div className="min-h-full">
            <main className="py-10">
              {/* Page header */}
              <div className="mx-auto max-w-3xl px-4 sm:px-6 md:flex md:items-center md:justify-between md:space-x-5 lg:max-w-7xl lg:px-8">
                <div className="flex items-center space-x-5">
                  <Link to="/invoice">
                    <GrPrevious
                      className="h-6 w-5 flex-none text-green-600"
                      aria-hidden="true"
                    />
                  </Link>
                  <div className="flex-shrink-0">
                    <div className="relative">
                      {data?.data?.data?.profilePhoto ? (
                        <img
                          className="h-16 w-16 rounded-full"
                          src={data?.data?.data?.profilePhoto}
                          alt=""
                        />
                      ) : (
                        <span className="inline-block h-14 w-14 overflow-hidden rounded-full bg-gray-100">
                          <svg
                            className="h-full w-full text-gray-300"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                          </svg>
                        </span>
                      )}
                      <span
                        className="absolute inset-0 rounded-full shadow-inner"
                        aria-hidden="true"
                      />
                    </div>
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                      {data?.data?.data.companyName}
                    </h1>
                    <p className="text-sm font-medium text-gray-500">
                      {data?.data?.data.email}
                    </p>
                  </div>
                </div>
                <div className="justify-stretch mt-6 flex flex-col-reverse space-y-4 space-y-reverse sm:flex-row-reverse sm:justify-end sm:space-y-0 sm:space-x-3 sm:space-x-reverse md:mt-0 md:flex-row md:space-x-3">
                  {invoiceData?.data?.data[0].verified ? (
                    <div className="mt-2 grid text-sm leading-6 text-gray-600">
                      <div className="flex gap-x-3">
                        <CheckIcon
                          className="h-6 w-5 flex-none text-green-600"
                          aria-hidden="true"
                        />
                        <span className="font-bold">PAYMENT RECEIVED</span>
                      </div>
                    </div>
                  ) : isVerifyInvoiceLoading ? (
                    <div className="flex justify-center items-center w-full">
                      <Spin />
                    </div>
                  ) : (
                    <div>
                      <button
                        type="button"
                        onClick={() => setOpen(true)}
                        className="inline-flex items-center justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
                      >
                        Receive Payment
                      </button>
                    </div>
                  )}
                  {isEmailInvoiceLoading ? (
                    <div className="flex justify-center items-center w-full">
                      <Spin />
                    </div>
                  ) : (
                    <button
                      type="button"
                      className="inline-flex items-center justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
                      onClick={handleSendEmail}
                    >
                      Email Invoice
                    </button>
                  )}
                  {!invoiceData?.data?.data[0].verified && (
                    <div className="mt-2 grid text-sm leading-6 text-gray-600">
                      <div className="flex gap-x-3">
                        <span className="font-bold">BALANCE: &#8358;{numberWithCommas(+invoiceData?.data?.data[0].trackTotal)}</span>
                      </div>
                    </div>

                  )}
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
                                    htmlFor="about"
                                    className="block text-sm font-medium leading-6 text-gray-900"
                                  >
                                    Amount{" "}
                                  </label>
                                  <div className="mt-2">
                                    <input
                                      id="about"
                                      name="about"
                                      // type="about"
                                      onChange={(e) =>
                                        setAmount(e.target.value)
                                      }
                                      value={amount}
                                      autoComplete="about"
                                      className="block w-full rounded-md border-0 py-1.5 mb-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 pl-2"
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                            {isVerifyInvoiceLoading ? (
                              <div className="flex justify-center items-center w-full">
                                <Spin />
                              </div>
                            ) : (
                              <button
                                type="button"
                                className="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
                                onClick={handleInvoiceUpdate}
                                disabled={!amount}
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

              <div className="mx-auto mt-8 grid max-w-3xl grid-cols-1 gap-6 sm:px-6 lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-3">
                <div className="space-y-6 lg:col-span-2 lg:col-start-1">
                  {/* Description list*/}
                  <section aria-labelledby="applicant-information-title">
                    <div className="bg-white shadow sm:rounded-lg">
                      <div className="px-4 py-5 sm:px-6">
                        <h2 className="text-lg font-medium leading-6 text-gray-900">
                          Customer Information
                        </h2>
                        <p className="mt-1 max-w-2xl text-sm text-gray-500">
                          Personal details of the customer
                        </p>
                      </div>
                      <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                        <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                          <div className="sm:col-span-1">
                            <dt className="text-sm font-medium text-gray-500">
                              Name
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900">
                              {
                                invoiceData?.data?.data[0].customer[0]
                                  .customerName
                              }
                            </dd>
                          </div>
                          <div className="sm:col-span-1">
                            <dt className="text-sm font-medium text-gray-500">
                              Email address
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900">
                              {
                                invoiceData?.data?.data[0].customer[0]
                                  .customerEmail
                              }
                            </dd>
                          </div>
                          <div className="sm:col-span-1">
                            <dt className="text-sm font-medium text-gray-500">
                              Address
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900">
                              {
                                invoiceData?.data?.data[0].customer[0]
                                  .addressLine
                              }{" "}
                              {invoiceData?.data?.data[0].customer[0].city},{" "}
                              {invoiceData?.data?.data[0].customer[0].state}
                            </dd>
                          </div>
                          <div className="sm:col-span-1">
                            <dt className="text-sm font-medium text-gray-500">
                              Phone
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900">
                              {
                                invoiceData?.data?.data[0].customer[0]
                                  .phoneNumber
                              }
                            </dd>
                          </div>
                          <div className="sm:col-span-2">
                            <dt className="text-sm font-medium text-gray-500">
                              About
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900">
                              {invoiceData?.data?.data[0].customer[0].note}
                            </dd>
                          </div>
                        </dl>
                      </div>
                      <div className="px-4 py-5 sm:px-6">
                        <h2 className="text-lg font-medium leading-6 text-gray-900">
                          Product Information
                        </h2>
                        <p className="mt-1 max-w-2xl text-sm text-gray-500">
                          Details of the product
                        </p>
                      </div>
                      <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                        <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                          <div className="sm:col-span-1">
                            <dt className="text-sm font-medium text-gray-500">
                              Name
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900">
                              {
                                invoiceData?.data?.data[0].product[0]
                                  .productName
                              }
                            </dd>
                          </div>
                          <div className="sm:col-span-1">
                            <dt className="text-sm font-medium text-gray-500">
                              Price
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900">
                              &#8358;
                              {numberWithCommas(
                                +invoiceData?.data?.data[0].totalPrice
                              )}
                            </dd>
                          </div>
                          <div className="sm:col-span-1">
                            <dt className="text-sm font-medium text-gray-500">
                              Quantity
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900">
                              {invoiceData?.data?.data[0].quantity}
                            </dd>
                          </div>
                          <div className="sm:col-span-2">
                            <dt className="text-sm font-medium text-gray-500">
                              Description
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900">
                              {
                                invoiceData?.data?.data[0].product[0]
                                  .description
                              }
                            </dd>
                          </div>
                        </dl>
                      </div>
                    </div>
                  </section>
                </div>

                <section
                  aria-labelledby="timeline-title"
                  className="lg:col-span-1 lg:col-start-3"
                >
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
                                +invoiceData?.data?.data[0].grandTotal
                              )}
                            </span>
                          </span>
                          <span className="text-sm font-semibold leading-6 tracking-wide text-gray-600">
                            NAIRA
                          </span>
                        </p>
                        <p className="text-base font-semibold text-gray-600">
                          Shipping Cost:{" "}
                          <span>
                            &#8358;
                            {numberWithCommas(
                              +invoiceData?.data?.data[0].shippingCost
                            )}
                          </span>
                        </p>
                        <p className="text-base font-semibold text-gray-600">
                          VAT: <span>{numberWithCommas(+invoiceData?.data?.data[0].vat)}%</span>
                        </p>
                        {invoiceData?.data?.data[0].trackTotal !== 0 && (
                          <p className="text-base font-semibold text-gray-600">
                            Balance &#8358;
                            {numberWithCommas(
                              +invoiceData?.data?.data[0].trackTotal
                            )}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </main>
          </div>
        </div>
      </div>
    </>
  );
}
