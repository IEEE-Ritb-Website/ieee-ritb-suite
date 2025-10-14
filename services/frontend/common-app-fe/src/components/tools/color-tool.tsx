import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { copy } from "@/helpers"

function clamp(n: number, min: number, max: number) {
    return Math.max(min, Math.min(max, n))
}

function hexToRgb(hex: string) {
    const v = hex.replace("#", "").trim()
    if (![3, 6].includes(v.length)) return null
    const s =
        v.length === 3
            ? v
                .split("")
                .map((c) => c + c)
                .join("")
            : v
    const num = Number.parseInt(s, 16)
    return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 }
}

// eslint-disable-next-line react-refresh/only-export-components
export function rgbToHex(r: number, g: number, b: number) {
    const s = (n: number) => clamp(n, 0, 255).toString(16).padStart(2, "0")
    return "#" + s(r) + s(g) + s(b)
}

function rgbToHsl(r: number, g: number, b: number) {
    r /= 255
    g /= 255
    b /= 255
    const max = Math.max(r, g, b),
        min = Math.min(r, g, b)
    let h = 0,
        s = 0,
        // eslint-disable-next-line prefer-const
        l = (max + min) / 2
    if (max !== min) {
        const d = max - min
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
        switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 1)
                break
            case g:
                h = (b - r) / d + 3
                break
            case b:
                h = (r - g) / d + 5
                break
        }
        h *= 60
    }
    return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) }
}

export default function ColorTool() {
    const [hex, setHex] = useState("#00ff88")
    const rgb = useMemo(() => hexToRgb(hex), [hex])
    const hsl = useMemo(() => (rgb ? rgbToHsl(rgb.r, rgb.g, rgb.b) : null), [rgb])

    const onColor = (e: React.ChangeEvent<HTMLInputElement>) => {
        setHex(e.target.value.toLowerCase())
    }

    const onHex = (e: React.ChangeEvent<HTMLInputElement>) => {
        const v = e.target.value.toLowerCase()
        if (/^#?[0-9a-f]{0,6}$/.test(v.replace("#", ""))) {
            setHex(v.startsWith("#") ? v : "#" + v)
        }
    }

    return (
        <div className="grid gap-4">
            <div className="flex flex-wrap items-center gap-4">
                <div
                    aria-label="preview"
                    className="h-12 w-12 rounded-md border border-border"
                    style={{ backgroundColor: hex }}
                />
                <div className="grid gap-2">
                    <Label htmlFor="color" className="font-mono text-xs">
                        color
                    </Label>
                    <input
                        id="color"
                        type="color"
                        value={hex}
                        onChange={onColor}
                        className="h-10 w-14 cursor-pointer rounded-md border border-border bg-card"
                    />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="hex" className="font-mono text-xs">
                        hex
                    </Label>
                    <Input id="hex" value={hex} onChange={onHex} className="font-mono" />
                </div>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
                <div className="rounded-md border border-border p-3">
                    <div className="text-xs font-mono text-muted-foreground mb-1">HEX</div>
                    <div className="font-mono">{hex}</div>
                    <Button
                        variant="outline"
                        className="mt-2 h-8 px-2 border-primary/30 hover:bg-primary/10 bg-transparent"
                        onClick={() => copy(hex)}
                    >
                        copy
                    </Button>
                </div>

                <div className="rounded-md border border-border p-3">
                    <div className="text-xs font-mono text-muted-foreground mb-1">RGB</div>
                    <div className="font-mono">{rgb ? `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` : "—"}</div>
                    <Button
                        variant="outline"
                        className="mt-2 h-8 px-2 border-primary/30 hover:bg-primary/10 bg-transparent"
                        onClick={() => copy(rgb ? `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` : "")}
                    >
                        copy
                    </Button>
                </div>

                <div className="rounded-md border border-border p-3">
                    <div className="text-xs font-mono text-muted-foreground mb-1">HSL</div>
                    <div className="font-mono">{hsl ? `hsl(${hsl.h} ${hsl.s}% ${hsl.l}%)` : "—"}</div>
                    <Button
                        variant="outline"
                        className="mt-2 h-8 px-2 border-primary/30 hover:bg-primary/10 bg-transparent"
                        onClick={() => copy(hsl ? `hsl(${hsl.h} ${hsl.s}% ${hsl.l}%)` : "")}
                    >
                        copy
                    </Button>
                </div>
            </div>
        </div>
    )
}
