import { Fragment, useEffect, useState } from "react";
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
} from "@heroicons/react/20/solid";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import { AuthService } from "../services/api/auth";
import { numberWithCommas } from "../utils";
import { TransactionService } from "../services/api/transaction";
import moment from "moment";

const navigation = [
  { name: "Home", href: "/dashboard", icon: HomeIcon, current: true },
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
    current: false,
  },
];
// const secondaryNavigation = [
//   { name: 'Settings', href: '#', icon: CogIcon },
//   { name: 'Help', href: '#', icon: QuestionMarkCircleIcon },
//   { name: 'Privacy', href: '#', icon: ShieldCheckIcon },
// ]

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

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

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

  const stats = [
    { id: 1, name: "Account balance", value: data?.data?.data?.accountBalance },
    { id: 2, name: "Total Income", value: data?.data?.data?.totalIncome },
    { id: 3, name: "Total Expenses", value: data?.data?.data?.totalExpenses },
    { id: 4, name: "Net Profit", value: data?.data?.data?.netProfit },
  ];

  const cards = [
    {
      name: "Account balance",
      href: "#",
      icon: ScaleIcon,
      amount: data?.data?.data?.accountBalance,
    },
    {
      name: "Total Income",
      href: "#",
      icon: ScaleIcon,
      amount: data?.data?.data?.totalIncome,
    },
    {
      name: "Total Expenses",
      href: "#",
      icon: ScaleIcon,
      amount: data?.data?.data?.totalExpenses,
    },
    {
      name: "Net Worth",
      href: "#",
      icon: ScaleIcon,
      amount: data?.data?.data?.netWorth,
    },
  ];

  const {
    isLoading: transactionIsLoading,
    isError: transactionIsError,
    error: transactionError,
    data: transactionData,
    isFetching: transactionIsFetching,
  }: any = useQuery(
    ["transaction-data"],
    () => TransactionService.getTransactions(),
    {
      keepPreviousData: true,
      // refetchInterval: 2000,
      refetchIntervalInBackground: true,
    }
  );
  console.log("NEW USER DATA", data?.data?.data);
  return (
    <>
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
            {/* Search bar */}
            <div className="flex flex-1 justify-between px-4 sm:px-6 lg:mx-auto lg:max-w-6xl lg:px-8">
              <div className="flex flex-1">
                <h1 className="ml-3 text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:leading-9 mt-4">
                  Home
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
          <main className="flex-1 pb-8">
            {/* Page header */}
            <div className="bg-white shadow">
              <div className="px-4 sm:px-6 lg:mx-auto lg:max-w-6xl lg:px-8">
                <div className="py-6 md:flex md:items-center md:justify-between lg:border-t lg:border-gray-200">
                  <div className="min-w-0 flex-1">
                    {/* Profile */}
                    <div className="flex items-center">
                      {data?.data?.data?.profilePhoto ? (
                        <img
                          className="hidden h-16 w-16 rounded-full sm:block"
                          src={data?.data?.data?.profilePhoto}
                          alt=""
                        />
                      ) : (
                        <span className="h-14 w-14 overflow-hidden rounded-full bg-gray-100 hidden sm:block">
                          <svg
                            className="h-full w-full text-gray-300"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                          </svg>
                        </span>
                      )}
                      <div>
                        <div className="flex items-center">
                          {data?.data?.data?.profilePhoto ? (
                            <img
                              className="h-16 w-16 rounded-full sm:hidden"
                              src={data?.data?.data?.profilePhoto}
                              alt=""
                            />
                          ) : (
                            <span className="inline-block h-14 w-14 overflow-hidden rounded-full bg-gray-100 sm:hidden">
                              <svg
                                className="h-full w-full text-gray-300"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                              </svg>
                            </span>
                          )}
                          <h1 className="ml-3 text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:leading-9">
                            Welcome,{" "}
                            <span className="font-thin">
                              {data?.data?.data?.companyName
                                ? data?.data?.data?.companyName
                                : data?.data?.data?.firstname}
                            </span>
                          </h1>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* <div className="mt-6 flex space-x-3 md:mt-0 md:ml-4">
                    <button
                      type="button"
                      className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    >
                      Add money
                    </button>
                    <button
                      type="button"
                      className="inline-flex items-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
                    >
                      Send money
                    </button>
                  </div> */}
                </div>
              </div>
            </div>

            <div className="mt-8">
              <div className="relative isolate overflow-hidden bg-gray-900 py-24 sm:py-32">
                <img
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2850&q=80&blend=111827&blend-mode=multiply&sat=-100&exp=15"
                  alt=""
                  className="absolute inset-0 -z-10 h-full w-full object-cover"
                />
                <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
                  <svg
                    viewBox="0 0 1266 975"
                    aria-hidden="true"
                    className="absolute -bottom-8 -left-96 -z-10 w-[79.125rem] transform-gpu blur-3xl sm:-left-40 sm:-bottom-64 lg:left-8 lg:-bottom-32 xl:-left-10"
                  >
                    <path
                      fill="url(#05f95398-6ec0-404d-8f7d-a69a4504684d)"
                      fillOpacity=".2"
                      d="M347.52 746.149 223.324 974.786 0 630.219l347.52 115.93 223.675-411.77c1.431 190.266 49.389 498.404 229.766 208.829C1026.43 181.239 966.307-135.484 1129.51 59.422c130.55 155.925 143.15 424.618 133.13 539.473L936.67 429.884l23.195 520.539L347.52 746.149Z"
                    />
                    <defs>
                      <linearGradient
                        id="05f95398-6ec0-404d-8f7d-a69a4504684d"
                        x1="1265.86"
                        x2="-162.888"
                        y1=".254"
                        y2="418.947"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop stopColor="#776FFF" />
                        <stop offset={1} stopColor="#FF4694" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-xl">
                    <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                      Overview
                    </p>
                  </div>
                  <dl className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-10 text-white sm:mt-20 sm:grid-cols-2 sm:gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-4">
                    {stats.map((stat) => (
                      <div
                        key={stat.id}
                        className="flex flex-col gap-y-3 border-l border-white/10 pl-6"
                      >
                        <dt className="text-sm leading-6">{stat.name}</dt>
                        <dd className="order-first text-3xl font-semibold tracking-tight">
                          &#8358;{numberWithCommas(+stat.value)}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>

              <h2 className="mx-auto mt-8 max-w-6xl px-4 text-lg font-medium leading-6 text-gray-900 sm:px-6 lg:px-8">
                Recent activity
              </h2>

              {/* Activity list (smallest breakpoint only) */}
              <div className="min-w-full overflow-hidden overflow-x-auto align-middle shadow sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th
                        className="bg-gray-50 px-6 py-3 text-left text-sm font-semibold text-gray-900"
                        scope="col"
                      >
                        TRANSACTION
                      </th>
                      <th
                        className="bg-gray-50 px-6 py-3 text-right text-sm font-semibold text-gray-900"
                        scope="col"
                      >
                        AMOUNT
                      </th>
                      <th
                        className="hidden bg-gray-50 px-6 py-3 text-left text-sm font-semibold text-gray-900 md:block"
                        scope="col"
                      >
                        CATEGORY
                      </th>
                      <th
                        className="bg-gray-50 px-6 py-3 text-right text-sm font-semibold text-gray-900"
                        scope="col"
                      >
                        DATE
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {transactionData?.data?.data.map((transaction: any) => (
                      <tr key={transaction._id} className="bg-white">
                        <td className="w-full max-w-0 whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                          <div className="flex">
                            <div className="group inline-flex space-x-2 truncate text-sm">
                              <BanknotesIcon
                                className="h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                                aria-hidden="true"
                              />
                              <p className="truncate text-gray-500 group-hover:text-gray-900">
                                {transaction.description}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-right text-sm text-gray-500">
                          <span className="font-medium text-gray-900">
                            &#8358;
                            {numberWithCommas(+transaction.amount)}{" "}
                          </span>
                          NGN
                        </td>
                        <td className="hidden whitespace-nowrap px-6 py-4 text-sm text-gray-500 md:block">
                          <span
                            className={classNames(
                              statusStyles[transaction.status],
                              "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize"
                            )}
                          >
                            {transaction.category[0].category.toUpperCase()}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-right text-sm text-gray-500">
                          <time dateTime={transaction.createdAt}>
                            {moment(
                              new Date(transaction.createdAt),
                              "YYYYMMDD"
                            ).fromNow()}
                          </time>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
