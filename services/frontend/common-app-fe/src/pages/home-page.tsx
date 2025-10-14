import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Base64Tool from "@/components/tools/base64-tool"
import JsonTool from "@/components/tools/json-tool"
import UuidTool from "@/components/tools/uuid-tool"
import HashTool from "@/components/tools/hash-tool"
import ColorTool from "@/components/tools/color-tool"
import { APPS_CONFIG } from "@/configs/apps"
import { Link } from "react-router"

export function HomePage() {
    return (
        <section className="mx-auto max-w-6xl w-full px-4 py-10">
            <div className="mb-10">
                <p className="text-balance text-muted-foreground">
                    The only platform to explore the cool projects created in RIT-B by students.
                </p>
            </div>

            <div id="projects" className="mb-10">
                <Card className="bg-card/50 border-border">
                    <CardHeader>
                        <CardTitle className="font-mono text-lg">Projects Showcase</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="grid gap-4 md:grid-cols-2">
                            <li className="rounded-md border border-border/60 p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="font-mono">project-terminal</h3>
                                    <span className="text-xs text-muted-foreground">2025</span>
                                </div>
                                <p className="text-sm text-muted-foreground">A TUI experiment with keyboard-first workflows.</p>
                                <div className="mt-3 flex gap-2">
                                    <Button className="bg-primary text-primary-foreground hover:bg-primary/90 h-8 px-3">View</Button>
                                    <Button variant="outline" className="h-8 px-3 border-primary/30 hover:bg-primary/10 bg-transparent">
                                        Repo
                                    </Button>
                                </div>
                            </li>
                            <li className="rounded-md border border-border/60 p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="font-mono">ml-notes</h3>
                                    <span className="text-xs text-muted-foreground">2025</span>
                                </div>
                                <p className="text-sm text-muted-foreground">Concise ML summaries with runnable notebooks.</p>
                                <div className="mt-3 flex gap-2">
                                    <Button className="bg-primary text-primary-foreground hover:bg-primary/90 h-8 px-3">View</Button>
                                    <Button variant="outline" className="h-8 px-3 border-primary/30 hover:bg-primary/10 bg-transparent">
                                        Repo
                                    </Button>
                                </div>
                            </li>
                        </ul>
                    </CardContent>
                </Card>
            </div>

            <div id="apps">
                <div className="font-mono text-lg font-semibold mb-2">Our Apps</div>
                <div className="grid gap-6 mb-10 md:grid-cols-2 *:min-w-0">
                    {APPS_CONFIG.apps.map((app) => (
                        <Card className="bg-card/50 border-border">
                            <CardHeader>
                                <CardTitle className="font-mono text-primary flex gap-2 items-center">{app.icon} {app.name}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {app.description}
                            </CardContent>
                            <CardFooter>
                                <Button asChild>
                                    <Link to={app.href}>{app.actionText}</Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>

            <div id="tools">
                <div className="font-mono text-lg font-semibold mb-2">Common Tools</div>
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3 *:min-w-0">
                    <Card className="bg-card/50 border-border">
                        <CardHeader>
                            <CardTitle className="font-mono text-primary">{"> base64"}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Base64Tool />
                        </CardContent>
                    </Card>

                    <Card className="bg-card/50 border-border">
                        <CardHeader>
                            <CardTitle className="font-mono text-primary">{"> json-format"}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <JsonTool />
                        </CardContent>
                    </Card>

                    <Card className="bg-card/50 border-border">
                        <CardHeader>
                            <CardTitle className="font-mono text-primary">{"> uuid"}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <UuidTool />
                        </CardContent>
                    </Card>

                    <Card className="bg-card/50 border-border">
                        <CardHeader>
                            <CardTitle className="font-mono text-primary">{"> sha-256"}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <HashTool />
                        </CardContent>
                    </Card>

                    <Card className="bg-card/50 border-border xl:col-span-2">
                        <CardHeader>
                            <CardTitle className="font-mono text-primary">{"> color-utils"}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ColorTool />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    )
}
