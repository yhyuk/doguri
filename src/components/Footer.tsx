import React from 'react';
import { VERSION, COPYRIGHT_YEAR, COPYRIGHT_HOLDER } from '../config/version';

const Footer: React.FC = () => {
  return (
    <footer className="fixed bottom-0 left-0 right-0 py-3 text-center pointer-events-none">
      <p className="text-[10px] text-gray-500/50 font-light tracking-wide">
        v{VERSION} · © {COPYRIGHT_YEAR} {COPYRIGHT_HOLDER}
      </p>
    </footer>
  );
};

export default Footer;