// components/UserAvatar.tsx
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface UserAvatarProps {
  user: {
    username: string;
    full_name: string;
  };
  className?: string;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base",
};

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

// Generate consistent color based on username
function stringToColor(str: string) {
  const colors = [
    "bg-gradient-to-br from-violet-500 to-purple-600",
    "bg-gradient-to-br from-blue-500 to-cyan-600",
    "bg-gradient-to-br from-green-500 to-emerald-600",
    "bg-gradient-to-br from-yellow-500 to-orange-600",
    "bg-gradient-to-br from-pink-500 to-rose-600",
    "bg-gradient-to-br from-indigo-500 to-blue-600",
  ];

  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  return colors[Math.abs(hash) % colors.length];
}

export function UserAvatar({ user, className, size = "md" }: UserAvatarProps) {
  const gradientClass = stringToColor(user.username);

  return (
    <Avatar
      className={cn(
        sizeClasses[size],
        "border-2 border-background shadow-sm",
        className
      )}
    >
      <AvatarImage
        src={`https://api.dicebear.com/7.x/lorelei/svg?seed=${user.username}&backgroundColor=b6e3f4,c0aede,d1d4f9&backgroundType=gradientLinear`}
        alt={user.full_name}
      />
      <AvatarFallback className={cn(gradientClass, "text-white font-semibold")}>
        {getInitials(user.full_name)}
      </AvatarFallback>
    </Avatar>
  );
}
