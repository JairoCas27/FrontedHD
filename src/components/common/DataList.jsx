import { useId } from 'react'

export default function DataList({ children, value, onChange, required, disabled, style, placeholder, className, ...rest }) {
  const id = `dl-${useId()}`
  return (
    <>
      <input
        type="text"
        list={id}
        value={value ?? ''}
        onChange={onChange}
        required={required}
        disabled={disabled}
        style={style}
        placeholder={placeholder}
        className={className}
        autoComplete="off"
        {...rest}
      />
      <datalist id={id}>{children}</datalist>
    </>
  )
}
