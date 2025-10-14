import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { copy } from "@/helpers"

function binStringFromUint8(arr: Uint8Array) {
    let s = ""
    for (let i = 0; i < arr.length; i++) s += String.fromCharCode(arr[i])
    return s
}

function uint8FromBinString(s: string) {
    const arr = new Uint8Array(s.length)
    for (let i = 0; i < s.length; i++) arr[i] = s.charCodeAt(i)
    return arr
}

export default function Base64Tool() {
    const [input, setInput] = useState("")
    const [output, setOutput] = useState("")
    const [error, setError] = useState<string | null>(null)

    const encode = () => {
        try {
            const bytes = new TextEncoder().encode(input)
            const base64 = btoa(binStringFromUint8(bytes))
            setOutput(base64)
            setError(null)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (e: any) {
            setError(e?.message ?? "Encode error")
        }
    }

    const decode = () => {
        try {
            const bin = atob(input)
            const text = new TextDecoder().decode(uint8FromBinString(bin))
            setOutput(text)
            setError(null)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (e: any) {
            setError(e?.message ?? "Decode error")
        }
    }

    return (
        <div className="space-y-3">
            <div className="grid gap-2">
                <Label htmlFor="b64in" className="font-mono text-xs">
                    input
                </Label>
                <Textarea
                    id="b64in"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="min-h-28 font-mono"
                    placeholder="paste text or base64 here"
                />
            </div>
            <div className="flex gap-2">
                <Button onClick={encode} className="bg-primary text-primary-foreground hover:bg-primary/90">
                    encode
                </Button>
                <Button onClick={decode} variant="outline" className="border-primary/30 hover:bg-primary/10 bg-transparent">
                    decode
                </Button>
                <Button onClick={() => copy(output)} variant="ghost" className="hover:bg-primary/10">
                    copy
                </Button>
            </div>
            {error && <div className="text-xs text-destructive font-mono">error: {error}</div>}
            <div className="grid gap-2">
                <Label htmlFor="b64out" className="font-mono text-xs">
                    output
                </Label>
                <Textarea id="b64out" value={output} readOnly className="min-h-28 font-mono" />
            </div>
        </div>
    )
}
