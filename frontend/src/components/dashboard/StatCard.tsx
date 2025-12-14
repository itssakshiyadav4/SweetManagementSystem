import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'default' | 'primary' | 'secondary' | 'accent';
}

export function StatCard({ title, value, subtitle, icon: Icon, trend, variant = 'default' }: StatCardProps) {
  const variants = {
    default: 'bg-gradient-card',
    primary: 'bg-gradient-primary',
    secondary: 'bg-gradient-mint',
    accent: 'bg-accent/20',
  };

  const textVariants = {
    default: 'text-foreground',
    primary: 'text-primary-foreground',
    secondary: 'text-mint-foreground',
    accent: 'text-accent-foreground',
  };

  return (
    <div className={cn("stat-card relative overflow-hidden", variants[variant])}>
      {/* Background decoration */}
      <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-20" 
        style={{ background: 'var(--gradient-primary)' }} 
      />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center",
            variant === 'default' ? 'bg-primary/10' : 'bg-background/20'
          )}>
            <Icon className={cn(
              "w-6 h-6",
              variant === 'default' ? 'text-primary' : textVariants[variant]
            )} />
          </div>
          {trend && (
            <span className={cn(
              "text-sm font-medium px-2 py-1 rounded-full",
              trend.isPositive ? 'bg-mint/20 text-mint-foreground' : 'bg-destructive/20 text-destructive'
            )}>
              {trend.isPositive ? '+' : ''}{trend.value}%
            </span>
          )}
        </div>
        
        <h3 className={cn(
          "text-3xl font-display font-bold mb-1",
          variant === 'default' ? 'text-foreground' : textVariants[variant]
        )}>
          {value}
        </h3>
        
        <p className={cn(
          "text-sm",
          variant === 'default' ? 'text-muted-foreground' : `${textVariants[variant]} opacity-80`
        )}>
          {title}
        </p>
        
        {subtitle && (
          <p className={cn(
            "text-xs mt-1",
            variant === 'default' ? 'text-muted-foreground/70' : `${textVariants[variant]} opacity-60`
          )}>
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
