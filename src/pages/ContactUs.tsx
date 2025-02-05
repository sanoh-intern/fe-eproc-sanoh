
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa"
import Button from "../components/Forms/Button"
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { API_Email } from "../api/api";

const ContactUs = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "", 
        message: ""
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        // Validation
        if (!formData.name || !formData.email || !formData.message) {
            toast.error("Please fill in all required fields");
            return;
        }

        setIsLoading(true);
        
        try {
            console.log("Sending to endpoint:", API_Email());
            console.log("Sending data:", formData);

            const response = await fetch(API_Email(), {
                method: "POST", 
                headers: {
                    "Content-Type": "application/json",
                    // Add any auth headers if needed
                },
                body: JSON.stringify(formData)
            });

            console.log("Response status:", response.status);
            
            if (response.ok) {
                const data = await response.json();
                console.log("Response data:", data);
                toast.success("Message sent successfully!");
                setFormData({ name: "", email: "", subject: "", message: "" });
            } else {
                const errorData = await response.json();
                console.error("Server error:", errorData);
                toast.error(errorData.message || "Failed to send message");
            }
        } catch (error) {
            console.error("Error sending message:", error);
            toast.error("An error occurred while sending your message");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <ToastContainer position="top-right" />
            <div className="min-h-screen bg-white">
                <div className="bg-[#f8fafc] py-16">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl text-center">Contact Us</h1>
                        <p className="mt-4 text-lg text-primary text-center max-w-2xl mx-auto">
                            Get in touch with PT. Sanoh Indonesia. We're here to help with any questions about our e-Procurement system.
                        </p>
                    </div>
                </div>

                {/* Contact Form and Information */}
                <div className="py-16 sm:py-24">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                            {/* Contact Form */}
                            <div>
                                <h2 className="text-2xl font-bold text-primary mb-6">Send us a message</h2>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            placeholder="Your Name"
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            placeholder="Your Email"
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <input
                                            type="text"
                                            name="subject"
                                            value={formData.subject}
                                            placeholder="Subject"
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <textarea
                                            name="message"
                                            value={formData.message}
                                            placeholder="Your Message"
                                            onChange={handleChange}
                                            className="w-full h-32 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                                        ></textarea>
                                    </div>
                                    <Button type="submit" title="Send Message" className="w-full" disabled={isLoading} />
                                </form>
                            </div>

                            {/* Contact Information */}
                            <div>
                            <h2 className="text-2xl font-bold text-primary mb-6">Contact Information</h2>
                            <div className="space-y-4">
                                <div className="flex items-start">
                                <FaEnvelope className="text-primary mt-1 mr-3" />
                                <div>
                                    <h3 className="font-semibold">Email</h3>
                                    <p className="text-primary">info@sanoh-indonesia.com</p>
                                </div>
                                </div>
                                <div className="flex items-start">
                                <FaPhone className="text-primary mt-1 mr-3" />
                                <div>
                                    <h3 className="font-semibold">Phone</h3>
                                    <p className="text-primary">+62 21 1234 5678</p>
                                </div>
                                </div>
                                <div className="flex items-start">
                                <FaMapMarkerAlt className="text-primary mt-1 mr-3" />
                                <div>
                                    <h3 className="font-semibold">Address</h3>
                                    <p className="text-primary">
                                    PT. Sanoh Indonesia
                                    <br />
                                    Jl. Example Street No. 123
                                    <br />
                                    Jakarta, Indonesia 12345
                                    </p>
                                </div>
                                </div>
                            </div>

                            {/* Map */}
                            <div className="mt-8">
                                <h2 className="text-2xl font-bold text-primary mb-4">Our Location</h2>
                                <div className="aspect-w-16 aspect-h-9">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4125.505927551468!2d107.12614627519572!3d-6.3366696620001655!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e6984b26b39a0bd%3A0xc6e7c8ba4066ac6b!2sPT.%20Sanoh%20Indonesia!5e1!3m2!1sid!2sid!4v1738719480720!5m2!1sid!2sid"
                                    width="100%"
                                    height="300"
                                    style={{ border: 0 }}
                                    allowFullScreen={true}
                                    loading="lazy"
                                ></iframe>
                                </div>
                            </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ContactUs

