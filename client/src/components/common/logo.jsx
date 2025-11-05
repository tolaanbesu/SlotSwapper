// src/components/common/Logo.jsx
import { Calendar } from 'lucide-react';

const Logo = ({ className = 'text-2xl font-bold', onClick = () => {} }) => (
  <button onClick={onClick} className={`flex items-center space-x-1 ${className}`}>
    <Calendar className="w-6 h-6 text-[#5B9AD7]" />
    <span>SlotSwapper</span>
  </button>
);

export default Logo;