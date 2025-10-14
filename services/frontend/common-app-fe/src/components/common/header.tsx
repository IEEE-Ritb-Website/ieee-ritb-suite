import { ChevronDown, Menu } from "lucide-react";
import { Button } from "../ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "../ui/drawer";
import { APPS_CONFIG } from "@/configs/apps";
import { CONFIGS } from "@/configs";
import { Link } from "react-router";
import { ThemeToggle } from "./theme-toggle";

export function Header() {
    return (
        <header className="border-b border-border">
            <div className="mx-auto max-w-6xl px-4 py-6 flex items-center justify-between">
                {/* Logo */}
                <Link
                    to="/"
                    className="font-mono text-pretty text-2xl md:text-3xl tracking-tight"
                >
                    <span className="text-primary">{"// "}</span>
                    apps<span className="text-primary">.</span>ritb
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-2">
                    {CONFIGS.nav_links.map((link) => (
                        <Button key={link.href} variant="ghost" asChild>
                            <Link
                                to={link.href}
                                className="text-sm hover:text-primary transition-colors"
                            >
                                {link.name}
                            </Link>
                        </Button>
                    ))}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                className="h-8 px-3 border-primary/30 hover:text-primary hover:bg-primary/30 bg-transparent"
                            >
                                Apps <ChevronDown />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="min-w-56">
                            <DropdownMenuLabel className="font-mono text-xs">
                                Tools
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {APPS_CONFIG.apps.map((app) => (
                                <DropdownMenuItem key={app.href} className="focus:bg-primary/30 dark:hover:text-white" asChild>
                                    <Link to={app.href}>{app.name}</Link>
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <ThemeToggle />
                </div>

                {/* Mobile Hamburger */}
                <div className="md:hidden flex">
                    <ThemeToggle />
                    <Drawer>
                        <DrawerTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <Menu className="h-6 w-6" />
                            </Button>
                        </DrawerTrigger>
                        <DrawerContent>
                            <DrawerHeader>
                                <DrawerTitle className="font-mono text-xl">
                                    <span className="text-primary">{"// "}</span>
                                    apps<span className="text-primary">.</span>ritb
                                </DrawerTitle>
                            </DrawerHeader>
                            <div className="flex flex-col pb-10">
                                {CONFIGS.nav_links.map((link) => (
                                    <Button key={link.href} variant="ghost" asChild>
                                        <Link
                                            to={link.href}
                                            className="text-base hover:text-primary transition-colors"
                                        >
                                            {link.name}
                                        </Link>
                                    </Button>
                                ))}
                                <div className="mt-4 flex flex-col items-center">
                                    <p className="text-xs font-mono mb-2 text-muted-foreground">
                                        Our Apps
                                    </p>
                                    {APPS_CONFIG.apps.map((app) => (
                                        <Button
                                            key={app.href}
                                            variant="ghost"
                                            asChild
                                        >
                                            <Link to={app.href}>{app.name}</Link>
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        </DrawerContent>
                    </Drawer>
                </div>
            </div>
        </header>
    );
}
