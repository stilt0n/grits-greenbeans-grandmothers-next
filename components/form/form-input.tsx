import { useId, forwardRef } from 'react';
import { Input, InputProps } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface FormInputProps extends InputProps {
  label: string;
  errorMessage?: string;
}

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, className, errorMessage, ...inputProps }, ref) => {
    const inputId = useId();
    return (
      <div className={className}>
        <Label htmlFor={inputId}>{label}</Label>
        <Input ref={ref} id={inputId} autoComplete='off' {...inputProps} />
        {errorMessage ? <p className='text-red-800'>{errorMessage}</p> : null}
      </div>
    );
  }
);

FormInput.displayName = 'FormInput';

export { FormInput };
