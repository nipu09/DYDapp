
import React, { useState, useEffect } from "react";
import { logoutUser, getCurrentUser } from "../../api/auth";

import {
  LayoutDashboard,
  CalendarCheck,
  BrainCircuit,
  Settings,
  LogOut,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";

import Logo from "./Logo";

import { Link, NavLink, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  // USER PROFILE STATE
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // fetch user PROFILE
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getCurrentUser();

        setProfile(response.data);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // USER DETAILS
  const username = profile?.username || "User";
  const fullName = profile?.fullName || "Your Profile";

  const initial = username.charAt(0).toUpperCase();

  // LOGOUT FUNCTION
  const handleLogout = async () => {
    try {
      setIsOpen(false);

      await logoutUser();

      navigate("/login", { replace: true });

    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // MAIN MENU ITEMS
  const menuItems = [
    {
      name: "Overview",
      icon: LayoutDashboard,
      path: "/dashboard",
    },
    {
      name: "My Habits",
      icon: CalendarCheck,
      path: "/habits",
    },
    {
      name: "AI Analysis",
      icon: BrainCircuit,
      path: "/analysis",
    },
  ];

  // BOTTOM MENU ITEMS
  const bottomItems = [
    {
      name: "Settings",
      icon: Settings,
      path: "/settings",
    },
  ];

  // NAVIGATION ITEM COMPONENT
  const NavItem = ({ item }) => {
    const Icon = item.icon;

    return (
      <NavLink
        to={item.path}
        onClick={() => setIsOpen(false)}
        className={({ isActive }) => `
          group relative flex w-full items-center gap-3
          rounded-xl px-4 py-3
          text-sm font-semibold
          transition-all duration-200
          ${
            isActive
              ? "bg-lime text-ink shadow-[3px_3px_0px_#C575F8]"
              : "text-white/55 hover:bg-white/5 hover:text-lime"
          }
        `}
      >
        {({ isActive }) => (
          <>
            <Icon size={19} strokeWidth={2} />

            <span>{item.name}</span>

            {isActive && (
              <ChevronRight
                size={17}
                className="ml-auto"
                strokeWidth={2.5}
              />
            )}
          </>
        )}
      </NavLink>
    );
  };

  return (
    <>
      {/* MOBILE TOP BAR */}
      <header className="fixed left-0 top-0 z-[60] flex w-full items-center justify-between border-b border-white/5 bg-ink px-5 py-4 lg:hidden">
        <Logo />

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-xl border border-white/10 bg-panel p-2 text-white transition hover:text-lime"
          aria-label="Toggle navigation menu"
          aria-expanded={isOpen}
        >
          {isOpen ? <X size={23} /> : <Menu size={23} />}
        </button>
      </header>

      {/* MOBILE OVERLAY */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-[45] bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          fixed left-0 top-0 z-[50]
          flex h-screen w-[260px] flex-col
          border-r border-white/5 bg-ink
          px-5 py-7
          transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* LOGO */}
        <div className="pb-10">
          <div className="hidden lg:block">
            <Logo />
          </div>

          {/* MOBILE CLOSE BUTTON */}
          <button
            onClick={() => setIsOpen(false)}
            className="absolute right-5 top-5 rounded-lg p-2 text-white/50 hover:text-lime lg:hidden"
            aria-label="Close navigation menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* MAIN NAVIGATION */}
        <div className="flex-1">
          <p className="mb-4 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">
            Workspace
          </p>

          <nav className="space-y-2">
            {menuItems.map((item) => (
              <NavItem key={item.name} item={item} />
            ))}
          </nav>
        </div>

        {/* BOTTOM NAVIGATION */}
        <div className="space-y-5">

          {/* USER PROFILE */}
          <div className="rounded-2xl border border-white/5 bg-panel p-3 transition-all duration-300 hover:border-grape/30 hover:bg-white/5">

            <Link
              to="/profile"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3"
            >
              {/* USER AVATAR */}
              <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-grape font-display text-lg font-extrabold text-ink">
                {profile?.avatar ? (
                  <img
                    src={profile.avatar}
                    alt={username}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  initial
                )}
              </div>

              {/* USER DETAILS */}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-white">
                  {loading ? "Loading..." : fullName}
                </p>

                <p className="mt-1 truncate text-xs text-white/40">
                  {loading ? "Please wait..." : `@${username}`}
                </p>
              </div>
            </Link>

          </div>

          {/* SETTINGS */}
          <nav className="space-y-2">
            {bottomItems.map((item) => (
              <NavItem key={item.name} item={item} />
            ))}
          </nav>

          {/* LOGOUT BUTTON */}
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-white/45 transition-all hover:bg-grape/10 hover:text-grape"
          >
            <LogOut size={19} />
            Logout
          </button>

          {/* FOOTER */}
          <p className="px-3 text-[10px] text-white/20">
            MADE WITH ♥ FOR SMALL WINS.
          </p>

        </div>
      </aside>
    </>
  );
};

export default Sidebar;
