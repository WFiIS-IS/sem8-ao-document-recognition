import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { Person } from '@/models/person';
import { useUpdatePersonMutation } from '@/api/mutations/hooks/useUpdatePersonMutation';
import { toast } from '@/components/ui/use-toast';
import { Label } from '@/components/ui/label';
import { z } from 'zod';

const formSchema = z.object({
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  date_of_birth: z.date().optional(),
  id_number: z.string().optional(),
  driving_license_number: z.string().optional()
});

type formDataType = z.infer<typeof formSchema>;

type Props = {
  data: Person;
  closeDialog: () => void;
};

export function EditPersonForm({ data, closeDialog }: Props) {
  const form = useForm<formDataType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...data,
      date_of_birth: data.date_of_birth ?? undefined,
      id_number: data.id_number ?? undefined,
      driving_license_number: data.driving_license_number ?? undefined
    }
  });

  const udpatePersonMutation = useUpdatePersonMutation({
    onSuccess: () => {
      toast({
        title: 'Person updated'
      });
      closeDialog();
    },
    onError: (error: string) => {
      console.log(error);
      toast({
        title: 'Something went wrong',
        description: 'Some errors occured while updating person',
        variant: 'destructive'
      });
    }
  });

  function onSubmit(values: formDataType) {
    udpatePersonMutation.mutate({ pesel: data.pesel, ...values });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        <Label>PESEL</Label> {data.pesel}
        <FormField
          control={form.control}
          name="first_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input placeholder="John" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="last_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last Name</FormLabel>
              <FormControl>
                <Input placeholder="Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="date_of_birth"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date of birth</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={'outline'}
                      className={cn(
                        'w-[240px] pl-3 text-left font-normal',
                        !field.value && 'text-muted-foreground'
                      )}>
                      {field.value ? (
                        format(field.value, 'PPP')
                      ) : (
                        <span>Pick your date of birth</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value || undefined}
                    onSelect={field.onChange}
                    initialFocus
                    captionLayout="dropdown"
                    fromYear={1900}
                    toYear={2050}
                    classNames={{
                      dropdown_month: '[&>div]:hidden',
                      dropdown_year: '[&>div]:hidden',
                      caption_dropdowns: 'grid grid-cols-2',
                      vhidden: 'col-span-2',
                      dropdown: 'rounded-[var(--radius)] focus:bg-accent [&>option]:bg-primary'
                    }}
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="id_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ID number</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="driving_license_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Driving License Number</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <Button type="submit" className="mt-3">
            Confirm
          </Button>
        </div>
      </form>
    </Form>
  );
}
