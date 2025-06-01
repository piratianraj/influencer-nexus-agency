
import { HomeIcon, Users, BarChart3 } from "lucide-react";

export const navItems = [
  {
    title: "Home",
    to: "/",
    icon: <HomeIcon className="h-4 w-4" />,
  },
  {
    title: "Discovery",
    to: "/discovery", 
    icon: <Users className="h-4 w-4" />,
  },
  {
    title: "Analytics",
    to: "/analytics",
    icon: <BarChart3 className="h-4 w-4" />,
  },
];
