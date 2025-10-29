import { useAppSelector } from "@/redux/fetures/hooks";
import AdminDashboard from "./AdminDashboard";
import { userCurrentUser } from "@/redux/fetures/auth/authSlice";


const Dashboard = () => {
  const user = useAppSelector(userCurrentUser) as any;
  const role = user?.userInfo?.role;
  return <div>{role === "admin" && <AdminDashboard />}</div>;
};

export default Dashboard;
