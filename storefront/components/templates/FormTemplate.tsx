import { InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes } from 'react'

// Input Field Template
interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

export function InputField({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  className = '',
  ...props
}: InputFieldProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-bold text-neutral-900 mb-2">
          {label}
          {props.required && <span className="text-red-600 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
            {leftIcon}
          </div>
        )}
        
        <input
          className={`
            w-full px-4 py-3 rounded-lg border transition-all
            ${leftIcon ? 'pl-10' : ''}
            ${rightIcon ? 'pr-10' : ''}
            ${error 
              ? 'border-red-500 focus:border-red-600 focus:ring-2 focus:ring-red-200' 
              : 'border-neutral-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200'
            }
            disabled:bg-neutral-100 disabled:cursor-not-allowed
            ${className}
          `}
          {...props}
        />
        
        {rightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400">
            {rightIcon}
          </div>
        )}
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      
      {helperText && !error && (
        <p className="mt-1 text-sm text-neutral-600">{helperText}</p>
      )}
    </div>
  )
}

// Textarea Field Template
interface TextareaFieldProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  helperText?: string
}

export function TextareaField({
  label,
  error,
  helperText,
  className = '',
  ...props
}: TextareaFieldProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-bold text-neutral-900 mb-2">
          {label}
          {props.required && <span className="text-red-600 ml-1">*</span>}
        </label>
      )}
      
      <textarea
        className={`
          w-full px-4 py-3 rounded-lg border transition-all resize-none
          ${error 
            ? 'border-red-500 focus:border-red-600 focus:ring-2 focus:ring-red-200' 
            : 'border-neutral-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200'
          }
          disabled:bg-neutral-100 disabled:cursor-not-allowed
          ${className}
        `}
        {...props}
      />
      
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      
      {helperText && !error && (
        <p className="mt-1 text-sm text-neutral-600">{helperText}</p>
      )}
    </div>
  )
}

// Select Field Template
interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  helperText?: string
  options: Array<{ value: string; label: string }>
}

export function SelectField({
  label,
  error,
  helperText,
  options,
  className = '',
  ...props
}: SelectFieldProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-bold text-neutral-900 mb-2">
          {label}
          {props.required && <span className="text-red-600 ml-1">*</span>}
        </label>
      )}
      
      <select
        className={`
          w-full px-4 py-3 rounded-lg border transition-all
          ${error 
            ? 'border-red-500 focus:border-red-600 focus:ring-2 focus:ring-red-200' 
            : 'border-neutral-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200'
          }
          disabled:bg-neutral-100 disabled:cursor-not-allowed
          ${className}
        `}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      
      {helperText && !error && (
        <p className="mt-1 text-sm text-neutral-600">{helperText}</p>
      )}
    </div>
  )
}

// Checkbox Field Template
interface CheckboxFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

export function CheckboxField({
  label,
  error,
  className = '',
  ...props
}: CheckboxFieldProps) {
  return (
    <div className="w-full">
      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          className={`
            mt-1 w-5 h-5 rounded border-neutral-300 text-primary-500
            focus:ring-2 focus:ring-primary-200 focus:ring-offset-0
            disabled:cursor-not-allowed disabled:opacity-50
            ${className}
          `}
          {...props}
        />
        <span className="text-sm text-neutral-900">
          {label}
          {props.required && <span className="text-red-600 ml-1">*</span>}
        </span>
      </label>
      
      {error && (
        <p className="mt-1 ml-8 text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}
