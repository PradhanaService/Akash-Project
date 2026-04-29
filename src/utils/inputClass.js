import clsx from 'clsx'

export function inputClass(className) {
  return clsx(
    'w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/20',
    className,
  )
}
