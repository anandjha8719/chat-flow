import { useEffect, useState } from "react";

const NavBar = ({ children, onClick, actionResult }) => {
  const [localActionResult, setLocalActionResult] = useState(actionResult);

  useEffect(() => {
    if (actionResult.message) {
      setLocalActionResult(actionResult);
      const timer = setTimeout(() => {
        setLocalActionResult({ type: "", message: "" });
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [actionResult]);
  const messageBgColor =
    localActionResult.type === "error"
      ? "bg-red-300"
      : localActionResult.type === "success"
      ? "bg-green-300"
      : "";
  const messagePadding = localActionResult.message ? "p-2" : "";

  return (
    <div className="h-16 bg-gray-200 w-full flex justify-between px-16 items-center">
      <div></div>
      <div className={`rounded text-white ${messageBgColor} ${messagePadding}`}>
        {localActionResult.message}
      </div>
      <div onClick={onClick}>{children}</div>
    </div>
  );
};

export default NavBar;
