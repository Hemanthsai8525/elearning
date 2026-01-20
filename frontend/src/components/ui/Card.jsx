import { cn } from '../../lib/utils';
import { cva } from 'class-variance-authority';

const cardVariants = cva(
    'rounded-2xl border text-card-foreground shadow-sm transition-all duration-300',
    {
        variants: {
            variant: {
                default: 'bg-card hover:shadow-lg hover:border-primary/20',
                glass: 'glass-card border-white/20 dark:border-white/10',
                outline: 'bg-transparent border-2',
                ghost: 'bg-transparent border-none shadow-none',
                gradient: 'bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 border-white/20',
            },
        },
        defaultVariants: {
            variant: 'default',
        },
    }
);

export function Card({ className, variant, ...props }) {
    return (
        <div
            className={cn(cardVariants({ variant }), className)}
            {...props}
        />
    );
}

export function CardHeader({ className, ...props }) {
    return (
        <div
            className={cn('flex flex-col space-y-1.5 p-6', className)}
            {...props}
        />
    );
}

export function CardTitle({ className, ...props }) {
    return (
        <h3
            className={cn('text-2xl font-bold leading-none tracking-tight', className)}
            {...props}
        />
    );
}

export function CardDescription({ className, ...props }) {
    return (
        <p
            className={cn('text-sm text-muted-foreground leading-relaxed', className)}
            {...props}
        />
    );
}

export function CardContent({ className, ...props }) {
    return <div className={cn('p-6 pt-0', className)} {...props} />;
}

export function CardFooter({ className, ...props }) {
    return (
        <div
            className={cn('flex items-center p-6 pt-0', className)}
            {...props}
        />
    );
}
