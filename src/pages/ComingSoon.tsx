import { useState, useEffect } from "react"

const ComingSoon = () => {
    const [dotCount, setDotCount] = useState(0)

    useEffect(() => {
        const intervalId = setInterval(() => {
            setDotCount((prev) => (prev + 1) % 4)
        }, 500)

        return () => clearInterval(intervalId)
    }, [])

    const dots = ".".repeat(dotCount)

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full text-center">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                    Feature Coming Soon
                </h2>
                <p className="text-gray-600">
                    We're working on something awesome{dots} Please check back later!
                </p>
            </div>
        </div>
    )
}

export default ComingSoon
