import { useGetMeQuery } from "@/redux/fetures/auth/authApi";
import LoadingPage from "../common/loding/LoadingPage";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Calendar,
  Mail,
  Phone,
  User,
  Shield,
  Crown,
  Key,
  Eye,
  Server,
  Edit,
  Lock,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const AdminProfile = () => {
  const { data: profile, isLoading, refetch , isFetching} = useGetMeQuery("");
  const navigate = useNavigate();

  console.log(profile);

  if (isLoading || isFetching) {
    return <LoadingPage />;
  }

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-cyan-50 to-blue-100 p-4">
        <div className="text-center p-8 bg-white rounded-2xl shadow-xl max-w-md border border-cyan-200">
          <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-cyan-600" />
          </div>
          <h2 className="text-2xl font-bold text-cyan-800 mb-3">
            Profile Not Available
          </h2>
          <p className="text-cyan-600 mb-6">
            We couldn't load your admin profile information.
          </p>
          <Button
            onClick={() => refetch()}
            className="bg-cyan-600 hover:bg-cyan-700 cursor-pointer text-white px-6 py-2 cursor-pointer rounded-lg transition-all duration-200"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Generate profile logo based on name

  const handleEditProfile = () => {
    navigate("/dashboard/update-admin");
  };

  const handleChangePassword = () => {
    navigate("/dashboard/change-password");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header with Action Buttons */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-full flex items-center justify-center mr-4 shadow-lg">
              <Crown className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-800 to-blue-700 bg-clip-text text-transparent">
                Admin Profile
              </h1>
              <p className="text-cyan-600">
                System Administrator Account Overview
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={handleEditProfile}
              className="bg-cyan-600 hover:bg-cyan-700 cursor-pointer text-white px-6 py-2 rounded-lg transition-all duration-200 flex items-center gap-2"
            >
              <Edit className="w-4 h-4" />
              Edit Profile
            </Button>
            <Button
              onClick={handleChangePassword}
              variant="outline"
              className="border-cyan-600 cursor-pointer text-cyan-700 hover:bg-cyan-50 px-6 py-2 rounded-lg transition-all duration-200 flex items-center gap-2"
            >
              <Lock className="w-4 h-4" />
              Change Password
            </Button>
          </div>
        </div>

        {/* Single Card with All Information */}
        <Card className="border-0 shadow-2xl rounded-2xl overflow-hidden bg-white">
          <div className="bg-gradient-to-r from-cyan-600 to-blue-600 h-3"></div>
          <CardHeader className="pb-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              {/* Profile Logo */}
              <div className="flex-shrink-0">
                {profile?.profileImage ? (
                  <img
                    src={profile.profileImage}
                    alt={profile.name}
                    className="w-24 h-24 rounded-full object-cover shadow-xl"
                  />
                ) : (
                  <div className="w-24 h-24 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-xl">
                    {profile?.name
                      ? profile.name.slice(0, 2).toUpperCase()
                      : "A"}
                  </div>
                )}
              </div>

              {/* Profile Info */}
              <div className="flex-1 text-center md:text-left">
                <CardTitle className="text-3xl font-bold text-gray-800 mb-2">
                  {profile.name}
                </CardTitle>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-3">
                  <div className="inline-flex items-center px-4 py-2 bg-cyan-100 text-cyan-800 rounded-full text-sm font-semibold border border-cyan-200">
                    <Crown className="w-4 h-4 mr-2" />
                    {profile.role.toUpperCase()}
                  </div>
                  <div
                    className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${
                      profile.isBlocked
                        ? "bg-red-100 text-red-800 border border-red-200"
                        : "bg-green-100 text-green-800 border border-green-200"
                    }`}
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    {profile.isBlocked ? "BLOCKED" : "ACTIVE"}
                  </div>
                </div>
                <CardDescription className="text-cyan-600 text-base">
                  Administrator since {formatDate(profile.createdAt)}
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pb-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Personal Information */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-cyan-800 mb-4 flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    Personal Information
                  </h3>

                  <div className="space-y-4">
                    {/* Name */}
                    <div className="p-4 bg-cyan-50 rounded-xl border border-cyan-200">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <User className="w-4 h-4 text-cyan-600 mr-2" />
                          <label className="text-sm font-semibold text-cyan-700">
                            Full Name
                          </label>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleEditProfile}
                          className="text-cyan-600 cursor-pointer hover:text-cyan-700 hover:bg-cyan-100"
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                      </div>
                      <p className="text-cyan-900 font-medium text-lg pl-6">
                        {profile.name}
                      </p>
                    </div>

                    {/* Email */}
                    <div className="p-4 bg-cyan-50 rounded-xl border border-cyan-200">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <Mail className="w-4 h-4 text-cyan-600 mr-2" />
                          <label className="text-sm font-semibold text-cyan-700">
                            Email Address
                          </label>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleEditProfile}
                          className="text-cyan-600 cursor-pointer hover:text-cyan-700 hover:bg-cyan-100"
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                      </div>
                      <p className="text-cyan-900 font-medium text-lg pl-6">
                        {profile.email}
                      </p>
                      <p className="text-cyan-600 text-sm pl-6 mt-1">
                        Primary contact email
                      </p>
                    </div>

                    {/* Phone */}
                    <div className="p-4 bg-cyan-50 rounded-xl border border-cyan-200">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <Phone className="w-4 h-4 text-cyan-600 mr-2" />
                          <label className="text-sm font-semibold text-cyan-700">
                            Phone Number
                          </label>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleEditProfile}
                          className="text-cyan-600 cursor-pointer hover:text-cyan-700 hover:bg-cyan-100"
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                      </div>
                      <p className="text-cyan-900 font-medium text-lg pl-6">
                        {profile.phoneNumber || "Not provided"}
                      </p>
                      <p className="text-cyan-600 text-sm pl-6 mt-1">
                        Contact phone number
                      </p>
                    </div>
                  </div>
                </div>

                {/* Security Information */}
                <div>
                  <h3 className="text-xl font-bold text-cyan-800 mb-4 flex items-center">
                    <Shield className="w-5 h-5 mr-2" />
                    Security Information
                  </h3>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-cyan-50 rounded-lg border border-cyan-200">
                      <div className="flex items-center">
                        <Key className="w-4 h-4 mr-2 text-cyan-600" />
                        <span className="text-cyan-700">Password</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-green-600 text-sm font-medium">
                          ••••••••
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleChangePassword}
                          className="text-cyan-600 hover:text-cyan-700 cursor-pointer hover:bg-cyan-100 p-1"
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-cyan-50 rounded-lg border border-cyan-200">
                      <div className="flex items-center">
                        <Eye className="w-4 h-4 mr-2 text-cyan-600" />
                        <span className="text-cyan-700">
                          Two-Factor Authentication
                        </span>
                      </div>
                      <span className="text-green-600 text-sm font-medium">
                        Enabled
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-cyan-50 rounded-lg border border-cyan-200">
                      <div className="flex items-center">
                        <Server className="w-4 h-4 mr-2 text-cyan-600" />
                        <span className="text-cyan-700">Last Login</span>
                      </div>
                      <span className="text-cyan-900 text-sm">
                        Today, 14:30
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Account Details */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-cyan-800 mb-4 flex items-center">
                    <Calendar className="w-5 h-5 mr-2" />
                    Account Timeline
                  </h3>

                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                      <div className="flex items-center mb-2">
                        <Calendar className="w-4 h-4 text-green-600 mr-2" />
                        <label className="text-sm font-semibold text-green-700">
                          Account Created
                        </label>
                      </div>
                      <p className="text-green-900 font-medium pl-6">
                        {formatDate(profile.createdAt)}
                      </p>
                      <p className="text-green-600 text-sm pl-6 mt-1">
                        Your admin account was created
                      </p>
                    </div>

                    <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                      <div className="flex items-center mb-2">
                        <Calendar className="w-4 h-4 text-blue-600 mr-2" />
                        <label className="text-sm font-semibold text-blue-700">
                          Last Updated
                        </label>
                      </div>
                      <p className="text-blue-900 font-medium pl-6">
                        {formatDate(profile.updatedAt)}
                      </p>
                      <p className="text-blue-600 text-sm pl-6 mt-1">
                        Profile information was last updated
                      </p>
                    </div>

                    <div className="p-4 bg-cyan-50 rounded-xl border border-cyan-200">
                      <div className="flex items-center mb-2">
                        <Shield className="w-4 h-4 text-cyan-600 mr-2" />
                        <label className="text-sm font-semibold text-cyan-700">
                          Account Status
                        </label>
                      </div>
                      <div className="flex items-center justify-between pl-6">
                        <p className="text-cyan-900 font-medium">
                          {profile.isBlocked
                            ? "Account Blocked"
                            : "Account Active"}
                        </p>
                        <div
                          className={`w-3 h-3 rounded-full ${
                            profile.isBlocked ? "bg-red-500" : "bg-green-500"
                          }`}
                        ></div>
                      </div>
                      <p className="text-cyan-600 text-sm pl-6 mt-1">
                        {profile.isBlocked
                          ? "Account access is currently restricted"
                          : "Account is in good standing"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Role Information */}
                <div>
                  <h3 className="text-xl font-bold text-cyan-800 mb-4 flex items-center">
                    <Crown className="w-5 h-5 mr-2" />
                    Role & Permissions
                  </h3>

                  <div className="p-4 bg-cyan-50 rounded-xl border border-cyan-200">
                    <div className="flex items-center mb-3">
                      <Shield className="w-4 h-4 text-cyan-600 mr-2" />
                      <label className="text-sm font-semibold text-cyan-700">
                        Administrator Privileges
                      </label>
                    </div>
                    <ul className="text-cyan-700 text-sm space-y-2 pl-6">
                      <li className="flex items-center">
                        <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full mr-2"></div>
                        Full system access and control
                      </li>
                      <li className="flex items-center">
                        <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full mr-2"></div>
                        User management capabilities
                      </li>
                      <li className="flex items-center">
                        <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full mr-2"></div>
                        System configuration rights
                      </li>
                      <li className="flex items-center">
                        <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full mr-2"></div>
                        Database administration access
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminProfile;
