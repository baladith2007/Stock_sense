import { forwardRef, useId, type InputHTMLAttributes, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const fieldBase =
  'w-full rounded-input border border-line bg-surface-soft px-3.5 text-[15px] text-ink placeholder:text-muted-strong transition-colors duration-150 hover:border-muted/40 focus:border-primary focus:bg-surface focus:outline-none focus:ring-[3px] focus:ring-primary-ring disabled:cursor-not-allowed disabled:opacity-60';

function FieldShell({
  label,
  hint,
  error,
  htmlFor,
  children,
  className,
  required,
}: {
  label?: string;
  hint?: string;
  error?: string;
  htmlFor?: string;
  children: React.ReactNode;
  className?: string;
  required?: boolean;
}) {
  return (
    <div className={cn('space-y-1.5', className)}>
      {label && (
        <label htmlFor={htmlFor} className="block text-label font-semibold text-ink">
          {label}
          {required && <span className="ml-0.5 text-danger-ink" aria-hidden="true">*</span>}
        </label>
      )}
      {children}
      {error ? (
        <p id={htmlFor ? `${htmlFor}-error` : undefined} role="alert" className="text-caption text-danger-ink">
          {error}
        </p>
      ) : (
        hint && (
          <p id={htmlFor ? `${htmlFor}-hint` : undefined} className="text-caption text-muted">
            {hint}
          </p>
        )
      )}
    </div>
  );
}

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
  containerClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, hint, error, id, className, containerClassName, required, ...props },
  ref,
) {
  const autoId = useId();
  const inputId = id || autoId;
  return (
    <FieldShell label={label} hint={hint} error={error} htmlFor={inputId} className={containerClassName} required={required}>
      <input
        ref={ref}
        id={inputId}
        className={cn(fieldBase, 'h-11', error && 'border-danger focus:border-danger focus:ring-danger-tint', className)}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
        required={required}
        {...props}
      />
    </FieldShell>
  );
});

interface PasswordInputProps extends Omit<InputProps, 'type'> {
  showLabel?: string;
  hideLabel?: string;
}

export function PasswordInput({
  label = 'Password',
  hint,
  error,
  id,
  className,
  containerClassName,
  showLabel = 'Show password',
  hideLabel = 'Hide password',
  ...props
}: PasswordInputProps) {
  const autoId = useId();
  const inputId = id || autoId;
  const [visible, setVisible] = useState(false);
  return (
    <FieldShell label={label} hint={hint} error={error} htmlFor={inputId} className={containerClassName}>
      <div className="relative">
        <input
          id={inputId}
          type={visible ? 'text' : 'password'}
          className={cn(
            fieldBase,
            'h-11 pr-12',
            error && 'border-danger focus:border-danger focus:ring-danger-tint',
            className,
          )}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
          {...props}
        />
        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          aria-label={visible ? hideLabel : showLabel}
          aria-pressed={visible}
          className="absolute inset-y-0 right-0 flex w-11 items-center justify-center rounded-r-input text-muted transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          {visible ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
        </button>
      </div>
    </FieldShell>
  );
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  hint?: string;
  error?: string;
}

export function Textarea({ label, hint, error, id, className, required, ...props }: TextareaProps) {
  const autoId = useId();
  const inputId = id || autoId;
  return (
    <FieldShell label={label} hint={hint} error={error} htmlFor={inputId} required={required}>
      <textarea
        id={inputId}
        className={cn(fieldBase, 'min-h-[88px] py-2.5', error && 'border-danger focus:border-danger', className)}
        aria-invalid={error ? true : undefined}
        required={required}
        {...props}
      />
    </FieldShell>
  );
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  hint?: string;
  error?: string;
}

export function Select({ label, hint, error, id, className, children, required, ...props }: SelectProps) {
  const autoId = useId();
  const inputId = id || autoId;
  return (
    <FieldShell label={label} hint={hint} error={error} htmlFor={inputId} required={required}>
      <select
        id={inputId}
        className={cn(fieldBase, 'h-11 appearance-none bg-[length:16px] pr-9', className)}
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2364748B' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")",
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 12px center',
        }}
        aria-invalid={error ? true : undefined}
        required={required}
        {...props}
      >
        {children}
      </select>
    </FieldShell>
  );
}

export function Toggle({
  checked,
  onChange,
  label,
  description,
  disabled,
  id,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  description?: string;
  disabled?: boolean;
  id?: string;
}) {
  const autoId = useId();
  const toggleId = id || autoId;
  return (
    <div className="flex items-start justify-between gap-4 py-3">
      <div className="min-w-0">
        <label htmlFor={toggleId} className="block text-[14px] font-medium text-ink">
          {label}
        </label>
        {description && <p className="mt-0.5 text-caption text-muted">{description}</p>}
      </div>
      <button
        id={toggleId}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative mt-0.5 h-6 w-11 shrink-0 rounded-full border transition-colors duration-150 after:absolute after:-inset-2.5 after:content-[""] focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-primary-ring disabled:opacity-60',
          checked ? 'border-primary bg-primary' : 'border-line bg-surface-soft',
        )}
      >
        <span
          className={cn(
            'absolute top-0.5 h-[18px] w-[18px] rounded-full bg-white shadow-sm transition-transform duration-150',
            checked ? 'translate-x-[22px]' : 'translate-x-0.5',
          )}
        />
      </button>
    </div>
  );
}
