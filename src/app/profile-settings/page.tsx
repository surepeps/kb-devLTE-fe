"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserContext } from "@/context/user-context";
import { GET_REQUEST, POST_REQUEST, PUT_REQUEST } from "@/utils/requests";
import { URLS } from "@/utils/URLS";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  User as UserIcon,
  ArrowLeft as ArrowLeftIcon,
  Camera as CameraIcon,
  Lock as LockIcon,
  Mail as MailIcon,
  Phone as PhoneIcon,
  MapPin as MapPinIcon,
  Calendar as CalendarIcon,
  Trash2 as Trash2Icon,
  Save as SaveIcon,
  Eye as EyeIcon,
  EyeOff as EyeOffIcon,
  AlertTriangle as AlertTriangleIcon,
  X,
  Share2,
  Copy,
  ExternalLink,
} from "lucide-react";
import Loading from "@/components/loading-component/loading";
import { useFormik } from "formik";
import * as Yup from "yup";

interface UserProfile {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  address?: string;
  profileImage?: string;
  userType: "Agent" | "Landowners" | "FieldAgent";
  accountApproved?: boolean;
  createdAt: string;
}

interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function ProfileSettingsPage() {
  const router = useRouter();
  const { user, setUser } = useUserContext();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "profile" | "password" | "account" | "share"
  >("profile");
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isDeletionRequested, setIsDeletionRequested] = useState(false);
  const [deletionDate, setDeletionDate] = useState<string | null>(null);
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(
    null,
  );
  const [isEmailChangeRequested, setIsEmailChangeRequested] = useState(false);
  const [newEmailRequest, setNewEmailRequest] = useState<string>("");
  const [isRequestingEmailChange, setIsRequestingEmailChange] = useState(false);
  const [inspectionPrice, setInspectionPrice] = useState<number | "">("");
  const [inspectionPriceEnabled, setInspectionPriceEnabled] = useState(false);
  const [isSavingInspection, setIsSavingInspection] = useState(false);
  const [showEmailChangeModal, setShowEmailChangeModal] = useState(false);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setIsLoading(true);
 
      // Mock data - replace with actual API call
      const mockProfile: UserProfile = {
        _id: user?._id || "1",
        firstName: user?.firstName || "John",
        lastName: user?.lastName || "Doe",
        email: user?.email || "john.doe@email.com",
        phoneNumber: user?.phoneNumber || "+234 803 123 4567",
        address: "123 Victoria Island, Lagos State",
        profileImage: user?.profile_picture,
        userType: user?.userType || "Agent",
        accountApproved: user?.accountApproved || true,
        createdAt: "2024-01-01T00:00:00.000Z",
      };

      setUserProfile(mockProfile);
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
      toast.error("Failed to load profile");
    } finally {
      setIsLoading(false);
    }
  };

  const profileFormik = useFormik({
    initialValues: {
      firstName: userProfile?.firstName || "",
      lastName: userProfile?.lastName || "",
      email: userProfile?.email || "",
      phoneNumber: userProfile?.phoneNumber || "",
      address: userProfile?.address || "",
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      firstName: Yup.string().required("First name is required"),
      lastName: Yup.string().required("Last name is required"),
      email: Yup.string()
        .email("Invalid email format")
        .required("Email is required"),
      phoneNumber: Yup.string(),
      address: Yup.string(),
    }),
    onSubmit: async (values) => {
      setIsUpdatingProfile(true);
      try {
        // Mock API call - replace with actual endpoint
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const updatedProfile = { ...userProfile, ...values };
        setUserProfile(updatedProfile as UserProfile);
        setUser({ ...user, ...values } as any);

        toast.success("Profile updated successfully");
      } catch (error) {
        console.error("Failed to update profile:", error);
        toast.error("Failed to update profile");
      } finally {
        setIsUpdatingProfile(false);
      }
    },
  });

  const passwordFormik = useFormik<PasswordChangeData>({
    initialValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      currentPassword: Yup.string().required("Current password is required"),
      newPassword: Yup.string()
        .min(8, "Password must be at least 8 characters")
        .required("New password is required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("newPassword")], "Passwords must match")
        .required("Confirm password is required"),
    }),
    onSubmit: async (values) => {
      setIsChangingPassword(true);
      try {
        // Mock API call - replace with actual endpoint
        await new Promise((resolve) => setTimeout(resolve, 1000));

        toast.success("Password changed successfully");
        passwordFormik.resetForm();
      } catch (error) {
        console.error("Failed to change password:", error);
        toast.error("Failed to change password");
      } finally {
        setIsChangingPassword(false);
      }
    },
  });

  const handleProfileImageChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setProfileImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadProfileImage = async () => {
    if (!profileImageFile) return;

    try {
      // Mock upload - replace with actual upload logic
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const imageUrl = profileImagePreview; // In real implementation, this would be the uploaded URL
      const updatedProfile = { ...userProfile, profileImage: imageUrl };
      setUserProfile(updatedProfile as UserProfile);
      setUser({ ...user, profileImage: imageUrl } as any);

      setProfileImageFile(null);
      setProfileImagePreview(null);
      toast.success("Profile image updated successfully");
    } catch (error) {
      console.error("Failed to upload profile image:", error);
      toast.error("Failed to upload profile image");
    }
  };

  const handleRequestAccountDeletion = async () => {
    try {
      // Mock API call - replace with actual endpoint
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const deletionDate = new Date();
      deletionDate.setDate(deletionDate.getDate() + 7);

      setIsDeletionRequested(true);
      setDeletionDate(deletionDate.toLocaleDateString());

      toast.success(
        "Account deletion request submitted. Your account will be deleted in 7 days.",
      );
    } catch (error) {
      console.error("Failed to request account deletion:", error);
      toast.error("Failed to request account deletion");
    }
  };

  const handleCancelAccountDeletion = async () => {
    try {
      // Mock API call - replace with actual endpoint
      await new Promise((resolve) => setTimeout(resolve, 500));

      setIsDeletionRequested(false);
      setDeletionDate(null);

      toast.success("Account deletion request cancelled");
    } catch (error) {
      console.error("Failed to cancel account deletion:", error);
      toast.error("Failed to cancel account deletion");
    }
  };

  const handleRequestEmailChange = async () => {
    if (!newEmailRequest || !newEmailRequest.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (newEmailRequest === userProfile?.email) {
      toast.error("New email cannot be the same as current email");
      return;
    }

    setIsRequestingEmailChange(true);
    try {
      // Mock API call - replace with actual endpoint
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setIsEmailChangeRequested(true);
      setShowEmailChangeModal(false);
      setNewEmailRequest("");

      toast.success(
        `Email change request submitted. Please check ${newEmailRequest} for verification instructions.`,
      );
    } catch (error) {
      console.error("Failed to request email change:", error);
      toast.error("Failed to request email change");
    } finally {
      setIsRequestingEmailChange(false);
    }
  };

  const handleCancelEmailChange = async () => {
    try {
      // Mock API call - replace with actual endpoint
      await new Promise((resolve) => setTimeout(resolve, 500));

      setIsEmailChangeRequested(false);
      toast.success("Email change request cancelled");
    } catch (error) {
      console.error("Failed to cancel email change:", error);
      toast.error("Failed to cancel email change");
    }
  };

  const copyProfileLink = async () => {
    const profileUrl = `${window.location.origin}/agent-profile/${userProfile?._id}`;
    try {
      await navigator.clipboard.writeText(profileUrl);
      toast.success('Profile link copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };

  const shareProfile = async () => {
    const profileUrl = `${window.location.origin}/agent-profile/${userProfile?._id}`;
    const shareData = {
      title: `${userProfile?.firstName} ${userProfile?.lastName} - Khabiteq Agent`,
      text: 'Check out my profile on Khabiteq',
      url: profileUrl,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        copyProfileLink();
      }
    } else {
      copyProfileLink();
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  if (!user || !userProfile) {
    return null;
  }

  const dashboardRoute =
    user.userType === "Agent" ? "/dashboard" : "/dashboard";

  return (
    <div className="min-h-screen bg-[#EEF1F1] py-8">
      <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
            <Link
              href={dashboardRoute}
              className="inline-flex items-center gap-2 text-[#8DDB90] hover:text-[#7BC87F] font-medium"
            >
              <ArrowLeftIcon size={20} />
              Back to Dashboard
            </Link>
          </div>

          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#09391C] font-display">
                Profile Settings
              </h1>
              <p className="text-[#5A5D63] mt-2">
                Manage your account information and preferences
              </p>
            </div>
            <div className="text-sm text-[#5A5D63] bg-white px-4 py-2 rounded-lg">
              {user.userType === "Agent"
                ? "Agent Account"
                : user.userType === "Landowners"
                ? "Landowner Account"
                : user.userType === "FieldAgent"
                ? "Field Agent Account"
                : ""}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="flex border-b border-gray-200">
            {[
              { id: "profile", label: "Profile Details", icon: UserIcon },
              { id: "password", label: "Change Password", icon: LockIcon },
              { id: "share", label: "Share Profile", icon: Share2 },
              {
                id: "account",
                label: "Account Settings",
                icon: AlertTriangleIcon,
              },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
                  activeTab === tab.id
                    ? "border-b-2 border-[#8DDB90] text-[#8DDB90]"
                    : "text-[#5A5D63] hover:text-[#09391C]"
                }`}
              >
                <tab.icon size={20} />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>

          <div className="p-6">
            {/* Profile Details Tab */}
            {activeTab === "profile" && (
              <div className="space-y-6">
                {/* Profile Image Section */}
                <div className="flex flex-col sm:flex-row items-start gap-6">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden">
                      {profileImagePreview || userProfile.profileImage ? (
                        <img
                          src={profileImagePreview || userProfile.profileImage}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <UserIcon size={32} className="text-gray-400" />
                        </div>
                      )}
                    </div>
                    <label className="absolute bottom-0 right-0 bg-[#8DDB90] text-white p-2 rounded-full cursor-pointer hover:bg-[#7BC87F] transition-colors">
                      <CameraIcon size={16} />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleProfileImageChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-[#09391C] mb-2">
                      Profile Picture
                    </h3>
                    <p className="text-sm text-[#5A5D63] mb-4">
                      Upload a profile picture to personalize your account
                    </p>
                    {profileImageFile && (
                      <button
                        onClick={handleUploadProfileImage}
                        className="bg-[#8DDB90] hover:bg-[#7BC87F] text-white px-4 py-2 rounded-lg font-medium transition-colors"
                      >
                        Upload Image
                      </button>
                    )}
                  </div>
                </div>

                {/* Profile Form */}
                <form
                  onSubmit={profileFormik.handleSubmit}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#09391C] mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={profileFormik.values.firstName}
                        onChange={profileFormik.handleChange}
                        onBlur={profileFormik.handleBlur}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8DDB90] focus:border-transparent"
                      />
                      {profileFormik.touched.firstName &&
                        profileFormik.errors.firstName && (
                          <p className="text-red-500 text-sm mt-1">
                            {profileFormik.errors.firstName}
                          </p>
                        )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#09391C] mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={profileFormik.values.lastName}
                        onChange={profileFormik.handleChange}
                        onBlur={profileFormik.handleBlur}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8DDB90] focus:border-transparent"
                      />
                      {profileFormik.touched.lastName &&
                        profileFormik.errors.lastName && (
                          <p className="text-red-500 text-sm mt-1">
                            {profileFormik.errors.lastName}
                          </p>
                        )}
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-medium text-[#09391C]">
                        Email Address
                      </label>
                      {!isEmailChangeRequested && (
                        <button
                          type="button"
                          onClick={() => setShowEmailChangeModal(true)}
                          className="text-[#8DDB90] hover:text-[#7BC87F] text-sm font-medium"
                        >
                          Request Change
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <MailIcon
                        size={20}
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      />
                      <input
                        type="email"
                        name="email"
                        value={profileFormik.values.email}
                        onChange={profileFormik.handleChange}
                        onBlur={profileFormik.handleBlur}
                        disabled
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500"
                      />
                    </div>
                    {isEmailChangeRequested && (
                      <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-sm text-blue-800 font-medium mb-1">
                              Email change request pending
                            </p>
                            <p className="text-xs text-blue-700">
                              Please check your new email for verification
                              instructions.
                            </p>
                          </div>
                          <button
                            onClick={handleCancelEmailChange}
                            className="text-blue-600 hover:text-blue-800 text-xs underline"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                    {profileFormik.touched.email &&
                      profileFormik.errors.email && (
                        <p className="text-red-500 text-sm mt-1">
                          {profileFormik.errors.email}
                        </p>
                      )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#09391C] mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <PhoneIcon
                        size={20}
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      />
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={profileFormik.values.phoneNumber}
                        onChange={profileFormik.handleChange}
                        onBlur={profileFormik.handleBlur}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8DDB90] focus:border-transparent"
                      />
                    </div>
                    {profileFormik.touched.phoneNumber &&
                      profileFormik.errors.phoneNumber && (
                        <p className="text-red-500 text-sm mt-1">
                          {profileFormik.errors.phoneNumber}
                        </p>
                      )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#09391C] mb-2">
                      Address
                    </label>
                    <div className="relative">
                      <MapPinIcon
                        size={20}
                        className="absolute left-3 top-3 text-gray-400"
                      />
                      <textarea
                        name="address"
                        value={profileFormik.values.address}
                        onChange={profileFormik.handleChange}
                        onBlur={profileFormik.handleBlur}
                        rows={3}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8DDB90] focus:border-transparent"
                        placeholder="Enter your address"
                      />
                    </div>
                    {profileFormik.touched.address &&
                      profileFormik.errors.address && (
                        <p className="text-red-500 text-sm mt-1">
                          {profileFormik.errors.address}
                        </p>
                      )}
                  </div>

                  <button
                    type="submit"
                    disabled={isUpdatingProfile}
                    className="bg-[#8DDB90] hover:bg-[#7BC87F] text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
                  >
                    <SaveIcon size={16} />
                    {isUpdatingProfile ? "Updating..." : "Update Profile"}
                  </button>
                </form>
              </div>
            )}

            {/* Change Password Tab */}
            {activeTab === "password" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-[#09391C] mb-2">
                    Change Password
                  </h3>
                  <p className="text-sm text-[#5A5D63] mb-6">
                    Update your password to keep your account secure
                  </p>
                </div>

                <form
                  onSubmit={passwordFormik.handleSubmit}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm font-medium text-[#09391C] mb-2">
                      Current Password
                    </label>
                    <div className="relative">
                      <LockIcon
                        size={20}
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      />
                      <input
                        type={showCurrentPassword ? "text" : "password"}
                        name="currentPassword"
                        value={passwordFormik.values.currentPassword}
                        onChange={passwordFormik.handleChange}
                        onBlur={passwordFormik.handleBlur}
                        className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8DDB90] focus:border-transparent"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowCurrentPassword(!showCurrentPassword)
                        }
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showCurrentPassword ? (
                          <EyeOffIcon size={20} />
                        ) : (
                          <EyeIcon size={20} />
                        )}
                      </button>
                    </div>
                    {passwordFormik.touched.currentPassword &&
                      passwordFormik.errors.currentPassword && (
                        <p className="text-red-500 text-sm mt-1">
                          {passwordFormik.errors.currentPassword}
                        </p>
                      )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#09391C] mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <LockIcon
                        size={20}
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      />
                      <input
                        type={showNewPassword ? "text" : "password"}
                        name="newPassword"
                        value={passwordFormik.values.newPassword}
                        onChange={passwordFormik.handleChange}
                        onBlur={passwordFormik.handleBlur}
                        className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8DDB90] focus:border-transparent"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showNewPassword ? (
                          <EyeOffIcon size={20} />
                        ) : (
                          <EyeIcon size={20} />
                        )}
                      </button>
                    </div>
                    {passwordFormik.touched.newPassword &&
                      passwordFormik.errors.newPassword && (
                        <p className="text-red-500 text-sm mt-1">
                          {passwordFormik.errors.newPassword}
                        </p>
                      )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#09391C] mb-2">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <LockIcon
                        size={20}
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={passwordFormik.values.confirmPassword}
                        onChange={passwordFormik.handleChange}
                        onBlur={passwordFormik.handleBlur}
                        className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8DDB90] focus:border-transparent"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? (
                          <EyeOffIcon size={20} />
                        ) : (
                          <EyeIcon size={20} />
                        )}
                      </button>
                    </div>
                    {passwordFormik.touched.confirmPassword &&
                      passwordFormik.errors.confirmPassword && (
                        <p className="text-red-500 text-sm mt-1">
                          {passwordFormik.errors.confirmPassword}
                        </p>
                      )}
                  </div>

                  <button
                    type="submit"
                    disabled={isChangingPassword}
                    className="bg-[#8DDB90] hover:bg-[#7BC87F] text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
                  >
                    <LockIcon size={16} />
                    {isChangingPassword ? "Changing..." : "Change Password"}
                  </button>
                </form>
              </div>
            )}

            {/* Share Profile Tab */}
            {activeTab === "share" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-[#09391C] mb-2">
                    Share Your Profile
                  </h3>
                  <p className="text-sm text-[#5A5D63] mb-6">
                    Share your public profile with clients and colleagues
                  </p>
                </div>

                {/* Profile Preview */}
                <div className="bg-gradient-to-r from-[#8DDB90] to-[#7BC87F] p-6 rounded-xl text-white">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center overflow-hidden">
                      {userProfile.profileImage ? (
                        <img
                          src={userProfile.profileImage}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <UserIcon className="w-8 h-8 text-white" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-xl font-bold">
                        {userProfile.firstName} {userProfile.lastName}
                      </h4>
                      <p className="text-white/80">{userProfile.userType} • Khabiteq</p>
                    </div>
                  </div>
                  <p className="text-white/90 mb-4">
                    Verified real estate professional on Khabiteq platform
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
                      Verified Agent
                    </span>
                    <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
                      Lagos, Nigeria
                    </span>
                  </div>
                </div>

                {/* Sharing Options */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    onClick={shareProfile}
                    className="flex items-center justify-center gap-3 p-4 border-2 border-[#8DDB90] text-[#8DDB90] rounded-lg hover:bg-[#8DDB90] hover:text-white transition-colors">
                    <Share2 className="w-5 h-5" />
                    <span className="font-medium">Share Profile</span>
                  </button>

                  <button
                    onClick={copyProfileLink}
                    className="flex items-center justify-center gap-3 p-4 bg-[#8DDB90] text-white rounded-lg hover:bg-[#7BC87F] transition-colors">
                    <Copy className="w-5 h-5" />
                    <span className="font-medium">Copy Link</span>
                  </button>
                </div>

                {/* Profile URL Display */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Public Profile URL
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={`${typeof window !== 'undefined' ? window.location.origin : 'https://khabiteq.com'}/agent-profile/${userProfile._id}`}
                      readOnly
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm"
                    />
                    <button
                      onClick={copyProfileLink}
                      className="px-4 py-2 bg-[#8DDB90] text-white rounded-lg hover:bg-[#7BC87F] transition-colors">
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* View Public Profile */}
                <div className="text-center">
                  <a
                    href={`/agent-profile/${userProfile._id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#09391C] text-white rounded-lg hover:bg-[#0B423D] transition-colors">
                    <ExternalLink className="w-5 h-5" />
                    View Public Profile
                  </a>
                </div>

                {/* Tips */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">💡 Profile Tips</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Complete your profile information to build trust with clients</li>
                    <li>• Add a professional profile photo</li>
                    <li>• Share your profile link on business cards and social media</li>
                    <li>• Keep your contact information up to date</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Account Settings Tab */}
            {activeTab === "account" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-[#09391C] mb-2">
                    Account Information
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm text-[#5A5D63]">Account Type</p>
                      <p className="font-medium text-[#09391C]">
                        {userProfile.userType}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-[#5A5D63]">Member Since</p>
                      <p className="font-medium text-[#09391C]">
                        {new Date(userProfile.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-[#5A5D63]">Account Status</p>
                      <p className="font-medium text-green-600">
                        {userProfile.accountApproved
                          ? "Active"
                          : "Pending Approval"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-[#5A5D63]">Account ID</p>
                      <p className="font-medium text-[#09391C] text-xs">
                        {userProfile._id}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Agent Inspection Fee */}
                {userProfile.userType === "Agent" && (
                  <div className="border border-emerald-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-[#09391C] mb-2">Inspection Fee</h3>
                    <p className="text-sm text-[#5A5D63] mb-4">Set your inspection price and enable/disable it.</p>
                    <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
                      <div className="flex items-center gap-3">
                        <label className="inline-flex items-center cursor-pointer select-none">
                          <input type="checkbox" className="sr-only peer" checked={inspectionPriceEnabled} onChange={(e)=>setInspectionPriceEnabled(e.target.checked)} />
                          <div className="w-11 h-6 bg-gray-200 rounded-full relative transition-colors peer-checked:bg-emerald-500">
                            <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${inspectionPriceEnabled ? 'translate-x-5' : ''}`}/>
                          </div>
                          <span className="ml-3 text-sm text-[#09391C]">Enable Inspection Fee</span>
                        </label>
                      </div>
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-[#09391C] mb-1">Inspection Price (₦)</label>
                        <input type="number" min={0} value={inspectionPrice} onChange={(e)=>setInspectionPrice(e.target.value === '' ? '' : Number(e.target.value))} className="w-full sm:w-56 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8DDB90] focus:border-transparent" placeholder="e.g. 5000" />
                      </div>
                      <button onClick={async ()=>{ try { setIsSavingInspection(true); const token = Cookies.get('token'); const res = await PUT_REQUEST(`${URLS.BASE}${URLS.accountSettingsBaseUrl}/updateInspectionFee`, { inspectionPrice: inspectionPrice === '' ? 0 : inspectionPrice, inspectionPriceEnabled }, token); if ((res as any)?.success) { toast.success('Inspection fee updated'); } else { toast.error((res as any)?.message || 'Update failed'); } } catch { toast.error('Update failed'); } finally { setIsSavingInspection(false); } }} disabled={isSavingInspection} className="px-4 py-2 bg-[#8DDB90] text-white rounded-lg hover:bg-[#7BC87F] transition-colors disabled:opacity-50">{isSavingInspection ? 'Saving...' : 'Save'}</button>
                    </div>
                  </div>
                )}

                {/* Account Deletion Section */}
                <div className="border border-red-200 rounded-lg p-6">
                  <div className="flex items-start gap-4">
                    <AlertTriangleIcon
                      size={24}
                      className="text-red-500 mt-1"
                    />
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-red-600 mb-2">
                        Delete Account
                      </h3>

                      {!isDeletionRequested ? (
                        <>
                          <p className="text-sm text-[#5A5D63] mb-4">
                            Once you delete your account, there is no going
                            back. Please be certain. Your account will be
                            scheduled for deletion 7 days after confirmation.
                          </p>
                          <button
                            onClick={handleRequestAccountDeletion}
                            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                          >
                            <Trash2Icon size={16} />
                            Request Account Deletion
                          </button>
                        </>
                      ) : (
                        <>
                          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                            <p className="text-sm text-red-800 mb-2">
                              <strong>Account deletion scheduled</strong>
                            </p>
                            <p className="text-sm text-red-700">
                              Your account is scheduled to be deleted on{" "}
                              {deletionDate}. You can cancel this request at any
                              time before the deletion date.
                            </p>
                          </div>
                          <button
                            onClick={handleCancelAccountDeletion}
                            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                          >
                            Cancel Deletion Request
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Email Change Modal */}
        {showEmailChangeModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-[#09391C]">
                  Change Email Address
                </h3>
                <button
                  onClick={() => {
                    setShowEmailChangeModal(false);
                    setNewEmailRequest("");
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-[#5A5D63] mb-3">
                    Enter your new email address. You will receive a
                    verification email to confirm the change.
                  </p>
                  <p className="text-xs text-blue-600 mb-4">
                    Current email: {userProfile?.email}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#09391C] mb-2">
                    New Email Address
                  </label>
                  <div className="relative">
                    <MailIcon
                      size={20}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="email"
                      value={newEmailRequest}
                      onChange={(e) => setNewEmailRequest(e.target.value)}
                      placeholder="Enter new email address"
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8DDB90] focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-xs text-yellow-800">
                    <strong>Important:</strong> After submitting this request,
                    you will need to verify both your current and new email
                    addresses. Your login email will remain unchanged until
                    verification is complete.
                  </p>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => {
                      setShowEmailChangeModal(false);
                      setNewEmailRequest("");
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleRequestEmailChange}
                    disabled={isRequestingEmailChange || !newEmailRequest}
                    className="flex-1 px-4 py-2 bg-[#8DDB90] text-white rounded-lg hover:bg-[#7BC87F] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <MailIcon size={16} />
                    {isRequestingEmailChange ? "Sending..." : "Send Request"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
