import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { inputClass } from "./AuthCard";

export default function PasswordInput(props) {
  const [showPassword, setShowPassword] = useState(false);

  const toggleShow = (e) => {
    e.preventDefault();
    setShowPassword(!showPassword);
  };

  // We remove className from props here so we don't apply it twice if passed.
  // Actually, we should extract className to handle it safely.
  const { className, ...rest } = props;
  const combinedClass = `${inputClass} pr-10 ${className || ""}`;

  return (
    <div className="relative">
      <input
        {...rest}
        type={showPassword ? "text" : "password"}
        className={combinedClass}
      />
      <button
        type="button"
        onClick={toggleShow}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate/50 hover:text-ink transition-colors focus:outline-none"
        aria-label={showPassword ? "Hide password" : "Show password"}
      >
        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  );
}
