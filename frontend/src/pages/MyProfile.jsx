import React, { useState, useRef } from "react";
import Sidebar from "../components/ui/Sidebar";

import {
  UserRound,
  Mail,
  Phone,
  Camera,
  MapPin,
  CalendarDays,
  Lock,
  Save,
  Pencil,
  ArrowLeft,
  AtSign,
} from "lucide-react";

const MyProfile = () => {
  const fileInputRef = useRef(null);

  const [profile, setProfile] = useState({
    fullName: "Your Name",
    username: "yourname",
    email: "you@example.com",
    phone: "",
    location: "",
    bio: "Building better habits, one day at a time.",
    birthday: "",
  });

  const [avatar, setAvatar] = useState(null);

  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordChange = (e) => {
    setPasswords({
      ...passwords,
      [e.target.name]: e.target.value,
    });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];

    if (file) {
      setAvatar(URL.createObjectURL(file));
    }
  };

  const handleSave = () => {
    if (passwords.new && passwords.new !== passwords.confirm) {
      alert("New passwords do not match.");
      return;
    }

    if (passwords.new && !passwords.current) {
      alert("Enter your current password first.");
      return;
    }

    setIsEditing(false);
    alert("Profile updated successfully!");

    // Connect your backend here to permanently save profile data.
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-ink">
      <Sidebar />

      <main className="min-h-screen min-w-0 px-4 pb-8 pt-24 sm:px-6 lg:ml-[260px] lg:p-8">

        <div className="mx-auto max-w-5xl space-y-8">

          {/* HEADER */}
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-lime">
                Your personal space
              </p>

              <h1 className="font-display text-3xl font-extrabold text-white sm:text-4xl">
                My Profile<span className="text-lime">.</span>
              </h1>

              <p className="mt-2 text-sm text-white/40">
                Manage your personal information and account details.
              </p>
            </div>

            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center justify-center gap-2 rounded-xl bg-lime px-5 py-3 text-sm font-extrabold text-ink shadow-[3px_3px_0px_#C575F8] transition hover:-translate-y-1"
              >
                <Pencil size={17} />
                Edit Profile
              </button>
            ) : (
              <div className="flex gap-3">
                <button
                  onClick={handleCancel}
                  className="rounded-xl border border-white/10 px-5 py-3 text-sm font-bold text-white/60 hover:bg-white/5"
                >
                  Cancel
                </button>

                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 rounded-xl bg-lime px-5 py-3 text-sm font-extrabold text-ink shadow-[3px_3px_0px_#C575F8]"
                >
                  <Save size={17} />
                  Save Changes
                </button>
              </div>
            )}

          </div>

          {/* PROFILE HERO */}
          <section className="relative overflow-hidden rounded-3xl border border-white/5 bg-panel p-6 sm:p-8">

            <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-grape/10 blur-3xl" />

            <div className="relative flex flex-col items-center gap-6 sm:flex-row">

              {/* PROFILE IMAGE */}
              <div className="relative">
                <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-3xl border-2 border-grape/40 bg-grape font-display text-4xl font-extrabold text-ink">
                  {avatar ? (
                    <img
                      src={avatar}
                      alt="Profile"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    profile.fullName.charAt(0).toUpperCase() || "U"
                  )}
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />

                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -bottom-2 -right-2 rounded-xl border-4 border-panel bg-lime p-2 text-ink transition hover:scale-110"
                  aria-label="Change profile picture"
                >
                  <Camera size={17} />
                </button>
              </div>

              {/* PROFILE DETAILS */}
              <div className="text-center sm:text-left">
                <h2 className="font-display text-2xl font-extrabold text-white">
                  {profile.fullName || "Your Name"}
                </h2>

                <p className="mt-1 text-sm text-white/40">
                  @{profile.username || "username"}
                </p>

                <div className="mt-4 flex flex-wrap justify-center gap-2 sm:justify-start">
                  <span className="rounded-full bg-lime/10 px-3 py-1 text-xs font-bold text-lime">
                    ✦ Habit Builder
                  </span>

                  <span className="rounded-full bg-grape/10 px-3 py-1 text-xs font-bold text-grape">
                    Aadat Member
                  </span>
                </div>
              </div>

              <div className="sm:ml-auto">
                <p className="text-xs text-white/30">
                  Small steps. Big changes.
                </p>
              </div>

            </div>
          </section>

          {/* PERSONAL INFORMATION */}
          <section className="rounded-3xl border border-white/5 bg-panel p-6 sm:p-8">

            <div className="mb-7">
              <h2 className="font-display text-xl font-extrabold text-white">
                Personal Information
              </h2>

              <p className="mt-1 text-sm text-white/40">
                Your basic personal details.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">

              <ProfileField
                label="Full Name"
                name="fullName"
                value={profile.fullName}
                onChange={handleChange}
                icon={UserRound}
                editing={isEditing}
              />

              <ProfileField
                label="Username"
                name="username"
                value={profile.username}
                onChange={handleChange}
                icon={AtSign}
                editing={isEditing}
              />

              <ProfileField
                label="Email Address"
                name="email"
                value={profile.email}
                onChange={handleChange}
                icon={Mail}
                editing={isEditing}
                type="email"
              />

              <ProfileField
                label="Phone Number"
                name="phone"
                value={profile.phone}
                onChange={handleChange}
                icon={Phone}
                editing={isEditing}
                placeholder="Add your phone number"
              />

              <ProfileField
                label="Location"
                name="location"
                value={profile.location}
                onChange={handleChange}
                icon={MapPin}
                editing={isEditing}
                placeholder="Your city"
              />

              <ProfileField
                label="Date of Birth"
                name="birthday"
                value={profile.birthday}
                onChange={handleChange}
                icon={CalendarDays}
                editing={isEditing}
                type="date"
              />

            </div>

            {/* BIO */}
            <div className="mt-6">
              <label className="mb-2 block text-sm font-semibold text-white/70">
                About Me
              </label>

              <textarea
                name="bio"
                value={profile.bio}
                onChange={handleChange}
                disabled={!isEditing}
                rows={4}
                placeholder="Tell us something about yourself..."
                className="w-full resize-none rounded-2xl border border-white/10 bg-ink p-4 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-lime disabled:opacity-60"
              />
            </div>

          </section>

          {/* CHANGE PASSWORD */}
          <section className="rounded-3xl border border-white/5 bg-panel p-6 sm:p-8">

            <div className="mb-7 flex items-center gap-3">
              <div className="rounded-xl bg-grape/10 p-3 text-grape">
                <Lock size={21} />
              </div>

              <div>
                <h2 className="font-display text-xl font-extrabold text-white">
                  Change Password
                </h2>

                <p className="mt-1 text-sm text-white/40">
                  Keep your account safe and secure.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

              <PasswordField
                label="Current Password"
                name="current"
                value={passwords.current}
                onChange={handlePasswordChange}
                disabled={!isEditing}
              />

              <div className="hidden sm:block" />

              <PasswordField
                label="New Password"
                name="new"
                value={passwords.new}
                onChange={handlePasswordChange}
                disabled={!isEditing}
              />

              <PasswordField
                label="Confirm New Password"
                name="confirm"
                value={passwords.confirm}
                onChange={handlePasswordChange}
                disabled={!isEditing}
              />

            </div>

            {!isEditing && (
              <p className="mt-4 text-xs text-white/30">
                Click Edit Profile to change your password.
              </p>
            )}

          </section>

          {/* FOOTER */}
          <div className="flex flex-col items-center justify-between gap-3 border-t border-white/5 pt-6 sm:flex-row">
            <p className="text-xs text-white/30">
              Your journey, your progress, your Aadat.
            </p>

            <p className="text-xs font-bold text-grape">
              MADE WITH ♥ FOR SMALL WINS.
            </p>
          </div>

        </div>
      </main>
    </div>
  );
};


/* REUSABLE PROFILE FIELD */
const ProfileField = ({
  label,
  name,
  value,
  onChange,
  icon: Icon,
  editing,
  type = "text",
  placeholder,
}) => (
  <div>
    <label className="mb-2 block text-sm font-semibold text-white/70">
      {label}
    </label>

    <div className="relative">
      <Icon
        size={17}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-grape"
      />

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        disabled={!editing}
        placeholder={placeholder}
        className="w-full rounded-xl border border-white/10 bg-ink py-3 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-lime disabled:cursor-not-allowed disabled:opacity-60"
      />
    </div>
  </div>
);


/* REUSABLE PASSWORD FIELD */
const PasswordField = ({
  label,
  name,
  value,
  onChange,
  disabled,
}) => (
  <div>
    <label className="mb-2 block text-sm font-semibold text-white/70">
      {label}
    </label>

    <input
      type="password"
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
      placeholder="••••••••"
      autoComplete="new-password"
      className="w-full rounded-xl border border-white/10 bg-ink px-4 py-3 text-sm text-white outline-none transition focus:border-lime disabled:cursor-not-allowed disabled:opacity-60"
    />
  </div>
);

export default MyProfile;