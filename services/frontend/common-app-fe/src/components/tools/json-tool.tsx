import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { copy } from "@/helpers"

export default function JsonTool() {
    const [input, setInput] = useState("")
    const [output, setOutput] = useState("")
    const [status, setStatus] = useState<"idle" | "ok" | "error">("idle")
    const [message, setMessage] = useState<string | null>(null)

    const format = () => {
        try {
            const obj = JSON.parse(input)
            setOutput(JSON.stringify(obj, null, 2))
            setStatus("ok")
            setMessage("valid JSON")
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (e: any) {
            setOutput("")
            setStatus("error")
            setMessage(e?.message ?? "parse error")
        }
    }

    const minify = () => {
        try {
            const obj = JSON.parse(input)
            setOutput(JSON.stringify(obj))
            setStatus("ok")
            setMessage("valid JSON")
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (e: any) {
            setOutput("")
            setStatus("error")
            setMessage(e?.message ?? "parse error")
        }
    }

    return (
        <div className="space-y-3">
            <div className="grid gap-2">
                <Label htmlFor="json-in" className="font-mono text-xs">
                    input
                </Label>
                <Textarea
                    id="json-in"
                    placeholder='{"hello":"world"}'
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="min-h-32 font-mono"
                />
            </div>
            <div className="flex gap-2">
                <Button onClick={format} className="bg-primary text-primary-foreground hover:bg-primary/90">
                    format
                </Button>
                <Button onClick={minify} variant="outline" className="border-primary/30 hover:bg-primary/10 bg-transparent">
                    minify
                </Button>
                <Button onClick={() => copy(output)} variant="ghost" className="hover:bg-primary/10">
                    copy out
                </Button>
            </div>
            {status !== "idle" && (
                <div className={`text-xs font-mono ${status === "ok" ? "text-emerald-400" : "text-destructive"}`}>
                    {status}: {message}
                </div>
            )}
            <div className="grid gap-2">
                <Label htmlFor="json-out" className="font-mono text-xs">
                    output
                </Label>
                <Textarea id="json-out" value={output} readOnly className="min-h-32 font-mono" />
            </div>
        </div>
    )
}
