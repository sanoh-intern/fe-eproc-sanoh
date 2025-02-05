import type React from "react"
import { useState, useRef, type KeyboardEvent, type ChangeEvent } from "react"

interface VerificationCodeInputProps {
    onComplete: (code: string) => void
}

const VerificationCodeInput: React.FC<VerificationCodeInputProps> = ({ onComplete }) => {
    const [code, setCode] = useState(["", "", "", "", "", ""])
    const inputs = useRef<(HTMLInputElement | null)[]>([])

    const handleChange = (index: number, value: string) => {
        const newCode = [...code]
        newCode[index] = value
        setCode(newCode)

        if (value && index < 5) {
            inputs.current[index + 1]?.focus()
        }

        if (newCode.every((digit) => digit !== "")) {
            onComplete(newCode.join(""))
        }
    }

    const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && !code[index] && index > 0) {
            inputs.current[index - 1]?.focus()
        }
    }

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault()
        const pastedData = e.clipboardData.getData("text").slice(0, 6).split("")
        const newCode = [...code]
        pastedData.forEach((digit, index) => {
            if (index < 6) {
                newCode[index] = digit
            }
        })
        setCode(newCode)
        if (newCode.every((digit) => digit !== "")) {
            onComplete(newCode.join(""))
        }
    }

    return (
        <div className="flex justify-between">
            {code.map((digit, index) => (
                <input
                    key={index}
                    ref={(el) => (inputs.current[index] = el)}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange(index, e.target.value)}
                    onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    className="w-12 h-12 text-center text-2xl border-4 border-secondary rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-0"
                />
            ))}
        </div>
    )
}

export default VerificationCodeInput

