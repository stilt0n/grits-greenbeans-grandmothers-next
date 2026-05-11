import { useId, forwardRef } from 'react';
import { Input, type InputProps } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export interface FormInputProps extends InputProps {
  label: string;
  errorMessage?: string;
}

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, className, errorMessage, ...inputProps }, ref) => {
    const inputId = useId();
    return (
      <div className={`relative ${className}`}>
        <Label htmlFor={inputId}>
          {label}
          {inputProps.required ? (
            <span className='text-destructive'>*</span>
          ) : null}
        </Label>
        <Input
          className='bg-background'
          ref={ref}
          id={inputId}
          autoComplete='off'
          {...inputProps}
        />
        {errorMessage ? (
          <>
            <p className='absolute text-destructive'>{errorMessage}</p>
          </>
        ) : null}
      </div>
    );
  }
);

FormInput.displayName = 'FormInput';

export { FormInput };
