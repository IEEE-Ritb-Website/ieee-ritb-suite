export async function copy(item: string) {
    try {
        await navigator.clipboard.writeText(item)
    } catch {
        throw new Error("Could not copy to clipboard")
    }
}