import { useState, useEffect } from "react"
import { FaCog } from "react-icons/fa"

const ComingSoon = () => {
    const [dotCount, setDotCount] = useState(0)
    const [showDetails, setShowDetails] = useState(false)

    useEffect(() => {
        const intervalId = setInterval(() => {
            setDotCount((prev) => (prev + 1) % 4) // Cycle through 0, 1, 2, 3
        }, 500)

        return () => clearInterval(intervalId)
    }, [])

    const dots = ".".repeat(dotCount)

    const toggleDetails = () => {
        setShowDetails((prev) => !prev)
    }

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div
                onClick={toggleDetails}
                className="max-w-md w-full p-6 bg-white rounded-lg shadow-xl space-y-6 hover:scale-105 transition-transform duration-300 cursor-pointer"
            >
                <div className="text-center">
                    <h2 className="text-3xl font-semibold text-primary">
                        Feature Coming Soon
                    </h2>
                    <p className="text-gray-500 mt-2">
                        We're working on something awesome{dots} Please check back later!
                    </p>
                </div>

                <div className="flex justify-center">
                    <FaCog className="animate-spin text-6xl text-primary hover:scale-125 transition-transform duration-300" />
                </div>

                {showDetails && (
                    <div className="text-center text-sm secondary transform transition-opacity duration-500 opacity-100">
                        <p className="animate-bounce">Extra details coming your way soon!</p>
                    </div>
                )}

                <div className="text-center text-xs text-secondary">
                    <p>Click anywhere to {showDetails ? "hide" : "show"} more info</p>
                </div>
            </div>
        </div>
    )
}

export default ComingSoon