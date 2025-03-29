import React from "react";
import { motion } from "framer-motion";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "./Header";


const ComingSoon = () => {
    return (
        <>
            <Header />
            <div
                className="d-flex flex-column justify-content-center align-items-center vh-100"
                style={{
                    background: "linear-gradient(135deg,rgb(158, 213, 255),rgb(95, 192, 245),rgb(239, 248, 250))",
                    animation: "backgroundFade 8s infinite alternate",
                    textAlign: "center",
                    overflow: "hidden",
                }}
            >
                {/* Animated Chick Emoji */}
                <motion.span
                    role="img"
                    aria-label="hatching chick"
                    initial={{ y: -20, rotate: -10, scale: 0.8, opacity: 0 }}
                    animate={{
                        y: [0, -15, 0],
                        rotate: [0, 10, -10, 0],
                        scale: [1, 1.1, 1],
                        opacity: 1,
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatType: "mirror",
                        ease: "easeInOut",
                    }}
                    style={{ fontSize: "60px", display: "block" }}
                >
                    🐣
                </motion.span>


                {/* Animated Heading */}
                <motion.h1
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    style={{
                        fontSize: "3rem",
                        fontWeight: "bold",
                        color: "#343a40",
                    }}
                >
                    Coming Soon...
                </motion.h1>


                {/* Animated Subtext */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }}
                    style={{
                        fontSize: "1.3rem",
                        color: "#6c757d",
                    }}
                >
                    Something exciting is hatching! Stay tuned.
                </motion.p>


                {/* Floating Dots for Extra Effect */}
                <motion.div
                    animate={{
                        y: [-5, 5, -5],
                        opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    style={{
                        position: "absolute",
                        bottom: "20px",
                        fontSize: "24px",
                        color: "#6c757d",
                    }}
                >
                    • • •
                </motion.div>
            </div>
        </>
    );
};


export default ComingSoon;


