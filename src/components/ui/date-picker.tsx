import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

type DatePickerProps = {
  value?: string;
  onChange: (value: string) => void;
};

export function DatePicker({ value, onChange }: DatePickerProps) {
  const selectedDate = value ? new Date(`${value}T00:00:00`) : undefined;

  const handleSelect = (date: Date | undefined) => {
    if (!date) {
      onChange('');
      return;
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    onChange(`${year}-${month}-${day}`);
  };

  return (
    <Popover>
      <PopoverTrigger
        className="
          flex w-full items-center justify-between
          rounded-lg border border-gray-300
          bg-white px-4 py-2.5
          text-sm
          transition
          hover:bg-gray-50
          focus:outline-none
        "
      >
        <span className={value ? 'text-gray-900' : 'text-gray-400'}>
          {selectedDate
            ? format(selectedDate, 'dd MMMM yyyy', {
                locale: id,
              })
            : 'Pilih tanggal lahir'}
        </span>

        <CalendarIcon size={18} className="text-gray-400" />
      </PopoverTrigger>

      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleSelect}
          disabled={{ after: new Date() }}
          captionLayout="dropdown"
        />
      </PopoverContent>
    </Popover>
  );
}
