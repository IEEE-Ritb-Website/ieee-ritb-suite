import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { copy } from "@/helpers"
import { Copy } from "lucide-react"

function isValidUrl(value: string) {
    try {
        const u = new URL(value)
        return !!u.protocol && !!u.host
    } catch {
        return false
    }
}

export default function UrlShortener() {
    const [url, setUrl] = useState("")
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [short, _setShort] = useState<string>("")
    const [busy, setBusy] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [recent, setRecent] = useState<Array<{ url: string; short: string; note?: string }>>([])

    useEffect(() => {
        try {
            const raw = localStorage.getItem("recent-short-links")
            if (raw) setRecent(JSON.parse(raw))
        } catch {
            // ignore
        }
    }, [])

    useEffect(() => {
        try {
            localStorage.setItem("recent-short-links", JSON.stringify(recent.slice(0, 10)))
        } catch {
            // ignore
        }
    }, [recent])

    const canShorten = useMemo(() => isValidUrl(url), [url])

    const shorten = async () => {
        setError(null)
        if (!canShorten) {
            setError("invalid url")
            return
        }
        setBusy(true)
        try {
            // TODO: Integrate api
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (e: any) {
            setError(e?.message ?? "shorten failed")
        } finally {
            setBusy(false)
        }
    }

    return (
        <div className="grid gap-4">
            <div className="grid gap-2">
                <Label htmlFor="url" className="font-mono text-xs">
                    long url
                </Label>
                <Input
                    id="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://example.com/some/very/long/path?with=query#hash"
                    className="font-mono"
                />
            </div>

            <div className="flex flex-wrap gap-2">
                <Button
                    disabled={!canShorten || busy}
                    onClick={shorten}
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                    {busy ? "shortening..." : "shorten"}
                </Button>
                <Button onClick={() => copy(short)} variant="outline" className="border-primary/30 hover:bg-primary/10 bg-transparent">
                    <Copy />
                </Button>
            </div>

            {error && <div className="text-xs text-destructive font-mono">error: {error}</div>}

            <div className="grid gap-2">
                <Label htmlFor="short" className="font-mono text-xs">
                    short url
                </Label>
                <Input id="short" value={short} readOnly className="font-mono" />
            </div>

            <div className="grid gap-3">
                <div className="text-xs text-muted-foreground font-mono">recent</div>
                <ul className="grid gap-2">
                    {recent.length === 0 && <li className="text-sm text-muted-foreground">—</li>}
                    {recent.map((r, i) => (
                        <li key={i} className="rounded-md border border-border p-3">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                                <div className="min-w-0">
                                    <div className="truncate font-mono text-sm" title={r.url}>
                                        {r.url}
                                    </div>
                                    {r.note ? (
                                        <div className="text-xs text-muted-foreground mt-1 line-clamp-2" title={r.note}>
                                            {r.note}
                                        </div>
                                    ) : null}
                                </div>
                                <div className="flex items-center gap-2">
                                    <a
                                        href={r.short}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-primary underline decoration-dotted underline-offset-4 break-all"
                                    >
                                        {r.short}
                                    </a>
                                    <Button
                                        variant="outline"
                                        className="h-8 px-2 border-primary/30 hover:bg-primary/10 bg-transparent"
                                        onClick={() => navigator.clipboard.writeText(r.short)}
                                    >
                                        copy
                                    </Button>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}
