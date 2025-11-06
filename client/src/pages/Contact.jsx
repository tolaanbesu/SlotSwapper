import React, { useState } from "react";
import { Mail, Phone, MapPin, Send } from "lucide-react";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Thank you for reaching out! We’ll get back to you soon.");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="p-8 bg-white shadow rounded-2xl max-w-3xl mx-auto mt-10">
      <h1 className="text-3xl font-bold text-green-700 mb-4">Contact Us</h1>
      <p className="text-gray-600 mb-6">
        Have a question or feedback? We’d love to hear from you. Fill out the form below or reach us through our contact details.
      </p>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Contact Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Your Name"
            className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Your Email"
            className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            placeholder="Your Message"
            rows="5"
            className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          ></textarea>
          <button
            type="submit"
            className="flex items-center justify-center gap-2 bg-green-600 text-white px-5 py-2 rounded-xl hover:bg-green-700 transition"
          >
            <Send size={18} />
            Send Message
          </button>
        </form>

        {/* Contact Info */}
        <div className="space-y-5">
          <div className="flex items-center gap-3 text-gray-700">
            <Mail className="text-green-600" />
            <span>support@slotswapper.com</span>
          </div>
          <div className="flex items-center gap-3 text-gray-700">
            <Phone className="text-green-600" />
            <span>+251 (946) 820-183</span>
          </div>
          <div className="flex items-center gap-3 text-gray-700">
            <MapPin className="text-green-600" />
            <span>Addis Ababa, Ethiopia</span>
          </div>
        </div>
      </div>
    </div>
  );
}
