import clsx from 'clsx'

const styles = {
  primary: 'bg-cyan-400 text-slate-950 hover:bg-cyan-300 focus-visible:ring-cyan-300',
  secondary:
    'border border-slate-700 bg-slate-900 text-slate-100 hover:border-slate-500 hover:bg-slate-800 focus-visible:ring-slate-400',
  danger:
    'border border-red-500/40 bg-red-500/10 text-red-200 hover:border-red-400 hover:bg-red-500/20 focus-visible:ring-red-300',
  ghost: 'text-slate-300 hover:bg-slate-800 focus-visible:ring-slate-400',
}

export default function Button({
  as: Component = 'button',
  variant = 'primary',
  className,
  children,
  ...props
}) {
  return (
    <Component
      className={clsx(
        'inline-flex min-h-10 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-60',
        styles[variant],
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  )
}
