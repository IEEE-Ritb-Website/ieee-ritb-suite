import { useEffect } from "react"
import { useLocation } from "react-router"

export function ScrollHandler() {
    const { pathname, hash } = useLocation()

    useEffect(() => {
        if (hash) {
            // Wait a tick to ensure DOM is ready
            setTimeout(() => {
                const el = document.querySelector(hash)
                if (el) {
                    el.scrollIntoView({ behavior: "smooth" })
                }
            }, 0)
        } else {
            // No hash → scroll to top
            window.scrollTo({ top: 0, behavior: "smooth" })
        }
    }, [pathname, hash])

    return null
}