import { toast } from "sonner";

export async function copy(item: string) {
    try {
        await navigator.clipboard.writeText(item);
        toast.success("Copied to clipboard");
    } catch {
        toast.error("Could not copy to clipboard");
        throw new Error("Could not copy to clipboard");
    }
}