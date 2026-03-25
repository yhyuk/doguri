import { useState } from 'react';
import Button from './Button';

interface CopyButtonProps {
  text?: string;
  onClick?: () => void;
  className?: string;
}

export default function CopyButton({ text, onClick, className = '' }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (onClick) {
      onClick();
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } else if (text) {
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy text:', err);
      }
    }
  };

  return (
    <Button
      variant="secondary"
      size="sm"
      onClick={handleCopy}
      className={className}
    >
      {copied ? '복사됨!' : '복사'}
    </Button>
  );
}
