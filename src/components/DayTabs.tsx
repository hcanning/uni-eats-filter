import { Button } from '@/components/ui/button';

interface DayTabsProps {
  selectedDay: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday';
  onDayChange: (day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday') => void;
}

const days = [
  { key: 'monday', label: 'Monday', short: 'Mon' },
  { key: 'tuesday', label: 'Tuesday', short: 'Tue' },
  { key: 'wednesday', label: 'Wednesday', short: 'Wed' },
  { key: 'thursday', label: 'Thursday', short: 'Thu' },
  { key: 'friday', label: 'Friday', short: 'Fri' },
] as const;

export const DayTabs = ({ selectedDay, onDayChange }: DayTabsProps) => {
  return (
    <div className="flex gap-2 p-1 bg-muted rounded-lg">
      {days.map((day) => (
        <Button
          key={day.key}
          variant={selectedDay === day.key ? "default" : "ghost"}
          size="sm"
          onClick={() => onDayChange(day.key)}
          className={`flex-1 font-medium transition-all duration-200 ${
            selectedDay === day.key 
              ? 'bg-primary text-primary-foreground shadow-sm' 
              : 'hover:bg-background'
          }`}
        >
          <span className="hidden sm:inline">{day.label}</span>
          <span className="sm:hidden">{day.short}</span>
        </Button>
      ))}
    </div>
  );
};