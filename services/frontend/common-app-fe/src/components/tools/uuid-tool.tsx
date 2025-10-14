import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { copy } from "@/helpers"

export default function UuidTool() {
    const [uuid, setUuid] = useState<string>("")

    const generate = () => {
        const id = crypto.randomUUID()
        setUuid(id)
    }

    return (
        <div className="space-y-3">
            <div className="grid gap-2">
                <Label htmlFor="uuid" className="font-mono text-xs">
                    uuid v4
                </Label>
                <Input id="uuid" value={uuid} readOnly className="font-mono" />
            </div>
            <div className="flex gap-2">
                <Button onClick={generate} className="bg-primary text-primary-foreground hover:bg-primary/90">
                    generate
                </Button>
                <Button onClick={() => copy(uuid)} variant="outline" className="border-primary/30 hover:bg-primary/10 bg-transparent">
                    copy
                </Button>
            </div>
        </div>
    )
}
