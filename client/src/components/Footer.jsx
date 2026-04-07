import React from 'react';
import { useTheme } from '../context/ThemeContext';

const Footer = () => {
    const { theme } = useTheme();
    const currentYear = new Date().getFullYear();

    return (
        <footer className="w-full py-8 text-center" style={{ 
            borderTop: `1px solid ${theme === 'light' ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)'}` 
        }}>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">
                © {currentYear} SKILL QUEST. ALL NEURAL RIGHTS RESERVED.
            </p>
        </footer>
    );
};

export default Footer;
