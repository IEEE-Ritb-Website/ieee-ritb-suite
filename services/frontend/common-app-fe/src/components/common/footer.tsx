import { Link } from "react-router";
import { Button } from "../ui/button";
import { CONFIGS } from "@/configs";

export function Footer() {
    return (
        <footer className="border-t border-border">
            <div className="mx-auto max-w-6xl px-4 py-8 text-xs text-muted-foreground">
                {"// built and managed by "}
                <Button asChild variant="link" className="p-0 text-xs text-muted-foreground">
                    <Link to={CONFIGS.main_website}>ieee rit-b</Link>
                </Button>
                {" • common tools • project showcase"}
            </div>
        </footer>
    )
}
