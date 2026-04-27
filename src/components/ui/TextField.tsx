import React from 'react';
import { cn } from '../../lib/utils';

interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>(
  ({ label, error, icon, className, ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label className="block text-ui font-bold text-textgray ml-1 uppercase tracking-wider">
            {label}
          </label>
        )}
        <div className="relative group">
          {icon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-textgray group-focus-within:text-primary transition-colors">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              "w-full bg-offwhite border border-bordergray rounded-xl px-4 py-3 text-charcoal text-small outline-none transition-all min-h-[48px]",
              "focus:border-primary focus:ring-4 focus:ring-primary/5",
              icon && "pl-12",
              error && "border-error focus:border-error focus:ring-error/5",
              className
            )}
            {...props}
          />
        </div>
        {error && (
          <p className="text-ui text-error ml-1 font-medium">{error}</p>
        )}
      </div>
    );
  }
);

TextField.displayName = "TextField";

export default TextField;
