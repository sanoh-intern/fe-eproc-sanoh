import React, { useState, useEffect } from "react";
import { FaCog, FaBell, FaEnvelope, FaGithub } from "react-icons/fa";
import { motion } from "framer-motion"; // You'll need to install framer-motion

const ComingSoon = () => {
    const [dotCount, setDotCount] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setDotCount((prevCount) => (prevCount + 1) % 4);
        }, 500);

        return () => clearInterval(intervalId);
    }, []);

    const dots = ".".repeat(dotCount);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="max-w-md w-full p-8 bg-white rounded-lg shadow-2xl space-y-8"
                onHoverStart={() => setIsHovered(true)}
                onHoverEnd={() => setIsHovered(false)}
            ></motion.div>
                <motion.div
                    className="text-center"
                    animate={{ y: isHovered ? -5 : 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <h2 className="text-4xl font-bold text-gray-800 mb-4">
                        Feature Coming Soon
                    </h2>
                    <p className="text-gray-600 text-lg">
                        We're working on something awesome{dots}
                    </p>
                </motion.div>

                <div className="flex justify-center space-x-6">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    >
                        <FaCog className="text-5xl text-blue-500" />
                    </motion.div>
                    <motion.div
                        animate={{ rotate: -360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    >
                        <FaCog className="text-5xl text-purple-500" />
                    </motion.div>
                </div>

                <motion.div className="flex justify-center space-x-4 mt-6">
                    {[FaBell, FaEnvelope, FaGithub].map((Icon, index) => (
                        <motion.div
                            key={index}
                            whileHover={{ scale: 1.2, rotate: 15 }}
                            whileTap={{ scale: 0.9 }}
                            className="cursor-pointer"
                        >
                            <Icon className="text-2xl text-gray-600 hover:text-blue-500 transition-colors" />
                        </motion.div>
                    ))}
                </motion.div>

                <motion.div
                    className="text-center text-sm text-gray-400"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    <p>Stay tuned for updates!</p>
                </motion.div>

                <div className="text-center">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
                    >
                        Notify Me
                    </motion.button>
                </div>
            </motion.div>
        </div>
    );
};

export default ComingSoon;