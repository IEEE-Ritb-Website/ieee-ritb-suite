import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { copy } from "@/helpers"

async function sha256Hex(input: string) {
    const data = new TextEncoder().encode(input)
    const hash = await crypto.subtle.digest("SHA-256", data)
    const bytes = new Uint8Array(hash)
    return Array.from(bytes)
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("")
}

export default function HashTool() {
    const [text, setText] = useState("")
    const [hash, setHash] = useState("")
    const [busy, setBusy] = useState(false)

    const run = async () => {
        setBusy(true)
        const out = await sha256Hex(text)
        setHash(out)
        setBusy(false)
    }

    return (
        <div className="space-y-3">
            <div className="grid gap-2">
                <Label htmlFor="hash-in" className="font-mono text-xs">
                    input
                </Label>
                <Textarea
                    id="hash-in"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="min-h-24 font-mono"
                    placeholder="text to hash"
                />
            </div>
            <div className="flex gap-2">
                <Button disabled={busy} onClick={run} className="bg-primary text-primary-foreground hover:bg-primary/90">
                    {busy ? "hashing..." : "hash"}
                </Button>
                <Button onClick={() => copy(hash)} variant="outline" className="border-primary/30 hover:bg-primary/10 bg-transparent">
                    copy
                </Button>
            </div>
            <div className="grid gap-2">
                <Label htmlFor="hash-out" className="font-mono text-xs">
                    sha-256
                </Label>
                <Input id="hash-out" value={hash} readOnly className="font-mono" />
            </div>
        </div>
    )
}
