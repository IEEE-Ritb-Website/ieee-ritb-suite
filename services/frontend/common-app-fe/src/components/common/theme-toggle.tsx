import { Moon, Sun, Monitor } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
} from "@/components/ui/select";
import { useTheme } from "@/hooks/use-theme";

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();

    const getThemeIcon = (className: string) => {
        switch (theme) {
            case "dark":
                return <Moon className={className} />;
            case "light":
                return <Sun className={className} />;
            case "system":
            default:
                return <Monitor className={className} />;
        }
    };

    return (
        <Select value={theme} onValueChange={setTheme}>
            <SelectTrigger className="rounded-full justify-center text-primary" aria-label="Toggle theme">
                {getThemeIcon("h-5 w-5 text-primary")}
            </SelectTrigger>
            <SelectContent align="end">
                <SelectItem value="light">
                    <div className="flex items-center gap-2">
                        <Sun className="h-4 w-4 text-primary" />
                        Light
                    </div>
                </SelectItem>
                <SelectItem value="dark">
                    <div className="flex items-center gap-2">
                        <Moon className="h-4 w-4 text-primary" />
                        Dark
                    </div>
                </SelectItem>
                <SelectItem value="system">
                    <div className="flex items-center gap-2">
                        <Monitor className="h-4 w-4 text-primary" />
                        System
                    </div>
                </SelectItem>
            </SelectContent>
        </Select>
    );
}
