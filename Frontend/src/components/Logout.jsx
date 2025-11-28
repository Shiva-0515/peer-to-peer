import { confirmToast } from "./ConfirmToast";
import { toast } from "react-hot-toast";

export const Logout = async () => {
  const confirmed = await confirmToast("Are you sure you want to logout?");

  if (!confirmed) {
    // toast("Logout canceled", {
    //   icon: "❌",
    //   style: {
    //     border: "1px solid #1447E6",
    //     color: "#1447E6",
    //   },
    // });
    return false;
  }

  // Perform logout
  localStorage.removeItem("token");
  localStorage.removeItem("UserName");

  toast.success("Logged out successfully!", {
    style: {
      border: "1px solid #1447E6",
      color: "#1447E6",
    },
  });

  return true;
};
