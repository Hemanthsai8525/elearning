import { cn } from '../../lib/utils';
export function Badge({ className, variant = 'default', ...props }) {
    const variants = {
        default: 'bg-primary/10 text-primary border-primary/20',
        secondary: 'bg-secondary text-secondary-foreground border-secondary/20',
        success: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20',
        warning: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
        danger: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
        outline: 'border-input text-foreground',
    };
    return (
        <div
            className={cn(
                'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors',
                variants[variant],
                className
            )}
            {...props}
        />
    );
}
