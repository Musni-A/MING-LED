export const handleLogout = (navigate) => {
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("userDepartment");
    localStorage.removeItem("jobRole");
    localStorage.removeItem("userId");
    localStorage.removeItem("name");
    localStorage.removeItem("userName");
    navigate("/");
  };