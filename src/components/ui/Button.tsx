import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onDrag' | 'onDragStart' | 'onDragEnd' | 'onAnimationStart'> {
  variant?: 'primary' | 'gold' | 'ghost' | 'outline' | 'success' | 'error';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = 'primary',
  size = 'md',
  isLoading,
  ...props
}) => {
  const variants = {
    primary: "bg-primary text-white hover:opacity-90 shadow-glow",
    gold: "bg-accent text-charcoal font-bold hover:opacity-90 shadow-gold",
    ghost: "bg-transparent text-charcoal hover:bg-mint",
    outline: "bg-transparent border border-bordergray text-charcoal hover:bg-offwhite",
    success: "bg-success text-white hover:opacity-90",
    error: "bg-error text-white hover:opacity-90",
  };

  const sizes = {
    sm: "px-4 py-2 text-ui min-h-[40px]",
    md: "px-6 py-3 text-small min-h-[48px]",
    lg: "px-8 py-4 text-body min-h-[56px]",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "rounded-xl font-heading font-semibold flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {isLoading ? (
        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      ) : children}
    </motion.button>
  );
};

export default Button;
