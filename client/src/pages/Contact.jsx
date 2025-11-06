import { useState } from "react";
import { Mail, Phone, MapPin, Send, ChevronLeft, X, CheckCircle } from "lucide-react";

export default function Contact({handleBack}) {
    const [form, setForm] = useState({ name: "", email: "", message: "" });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [statusMessage, setStatusMessage] = useState(null); 

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setStatusMessage(null);

        try {
            await new Promise(resolve => setTimeout(resolve, 1500)); 

            // Success feedback
            setStatusMessage({
                type: 'success',
                text: "Thank you for reaching out! We’ve received your message and will get back to you soon."
            });
            // Reset form
            setForm({ name: "", email: "", message: "" });

        } catch{
            setStatusMessage({
                type: 'error',
                text: "Failed to send message. Please try again later or contact us directly."
            });
        } finally {
            setIsSubmitting(false);
            setTimeout(() => setStatusMessage(null), 5000);
        }
    };

    const inputStyle = "w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors duration-150";

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 font-sans p-4">
            
            {/* Status Message Banner */}
            {statusMessage && (
                <div className={`fixed top-4 right-4 z-50 p-4 rounded-xl shadow-lg flex items-center gap-3 transition-opacity duration-300 ${statusMessage.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                    <CheckCircle size={20} />
                    <span>{statusMessage.text}</span>
                    <button onClick={() => setStatusMessage(null)} className="ml-2">
                        <X size={18} />
                    </button>
                </div>
            )}

            <div className="relative p-6 md:p-12 bg-white shadow-2xl rounded-3xl max-w-5xl w-full">
                
                {/* Back Button */}
                <button 
                    onClick={handleBack} 
                    className="flex items-center text-gray-500 hover:text-green-600 hover:bg-gray-100 transition-colors duration-200 mb-6 p-2 rounded-lg"
                    aria-label="Go back"
                >
                    <ChevronLeft size={24} className="mr-1" />
                    <span className="font-medium text-sm">Back to Home</span>
                </button>

                <h1 className="text-4xl font-extrabold text-green-700 mb-2">
                    Connect With Us
                </h1>
                <p className="text-gray-600 text-lg mb-8">
                    Have a question or feedback? We’d love to hear from you.
                </p>
                
                <div className="grid lg:grid-cols-3 gap-12">
                    
                    {/* Contact Info (Side Panel) */}
                    <div className="space-y-6 lg:col-span-1 p-6 bg-green-50 rounded-2xl border border-green-100 shadow-inner">
                        <h2 className="text-2xl font-bold text-green-700 mb-4">Contact Details</h2>
                        
                        <div className="flex items-start gap-3 text-gray-700">
                            <Mail className="text-green-600 flex-shrink-0 mt-1" size={20} />
                            <div>
                                <h4 className="font-semibold text-gray-800">Email Support</h4>
                                <span className="text-sm">support@slotswapper.com</span>
                            </div>
                        </div>
                        
                        <div className="flex items-start gap-3 text-gray-700">
                            <Phone className="text-green-600 flex-shrink-0 mt-1" size={20} />
                            <div>
                                <h4 className="font-semibold text-gray-800">Call Us</h4>
                                <span className="text-sm">+251 (946) 820-183</span>
                            </div>
                        </div>
                        
                        <div className="flex items-start gap-3 text-gray-700">
                            <MapPin className="text-green-600 flex-shrink-0 mt-1" size={20} />
                            <div>
                                <h4 className="font-semibold text-gray-800">Our Office</h4>
                                <span className="text-sm">Addis Ababa, Ethiopia</span>
                            </div>
                        </div>
                        
                        <div className="pt-4 text-sm text-gray-500">
                            We aim to respond to all inquiries within 24 hours.
                        </div>
                    </div>

                    {/* Contact Form */}
                    <form onSubmit={handleSubmit} className="space-y-6 lg:col-span-2">
                        <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="Your Full Name"
                            className={inputStyle}
                            disabled={isSubmitting}
                            required
                        />
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="Your Work Email"
                            className={inputStyle}
                            disabled={isSubmitting}
                            required
                        />
                        <textarea
                            name="message"
                            value={form.message}
                            onChange={handleChange}
                            placeholder="What can we help you with?"
                            rows="6"
                            className={inputStyle}
                            disabled={isSubmitting}
                            required
                        ></textarea>
                        <button
                            type="submit"
                            className={`flex items-center justify-center gap-2 text-white px-8 py-3 rounded-xl shadow-lg transition duration-200 transform ${
                                isSubmitting 
                                    ? 'bg-green-400 cursor-not-allowed' 
                                    : 'bg-green-600 hover:bg-green-700 hover:scale-[1.01]'
                            }`}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Sending...
                                </>
                            ) : (
                                <>
                                    <Send size={18} />
                                    Send Message
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}