import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog.tsx';
import { Button } from '@/components/ui/button.tsx';
import { CalendarIcon } from '@radix-ui/react-icons';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form.tsx';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select.tsx';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useMemo, useState } from 'react';
import { useCustomersAndProjectsForDropdown } from '@/api/apollo/hooks/useCustomersAndProjectsForDropdown.ts';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover.tsx';
import { add, eachMinuteOfInterval, format, intervalToDuration } from 'date-fns';
import { Calendar } from '@/components/ui/calendar.tsx';
import { cn } from '@/lib/utils.ts';
import { ScrollArea } from '@/components/ui/scroll-area.tsx';
import { Input } from '@/components/ui/input.tsx';
import { ChevronDown, Clock9 } from 'lucide-react';
import moment from 'moment';
import { useActivityCreateMutation } from '@/api/apollo/hooks/useActivityCreateMutation.ts';

const formSchema = z.object({
  customer: z.string().min(1),
  project: z.string().min(1),
  startDate: z.date(),
  start: z
    .string()
    .min(1, 'Time is required')
    .refine((value) => /^([0-2][0-9]):([0-5][0-9])$/.test(value ?? ''), 'Incorrect time format'),
  duration: z
    .string()
    .refine(
      (value) => /^(([0-2][0-9]):([0-5][0-9]))?$/.test(value ?? ''),
      'Incorrect duration format'
    ),
  finish: z
    .string()
    .refine((value) => /^(([0-2][0-9]):([0-5][0-9]))?$/.test(value ?? ''), 'Incorrect time format')
});

type ActivityCreateDialogProps = {
  children?: React.ReactNode;
};

export function ActivityCreateDialog({ children }: ActivityCreateDialogProps) {
  const [createActivity] = useActivityCreateMutation();

  const { data } = useCustomersAndProjectsForDropdown();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [startDatePopoverOpen, setStartDatePopoverOpen] = useState(false);
  const [startPopoverOpen, setStartPopoverOpen] = useState(false);
  const [durationPopoverOpen, setDurationPopoverOpen] = useState(false);
  const [finishPopoverOpen, setFinishPopoverOpen] = useState(false);

  const [customerId, setCustomerId] = useState('');

  useEffect(() => {
    if (dialogOpen) {
      form.setValue('start', format(new Date(), 'HH:mm'));
    }
  }, [dialogOpen]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customer: '',
      project: '',
      startDate: new Date(new Date().setHours(0, 0, 0)),
      start: format(new Date(), 'HH:mm'),
      duration: '',
      finish: ''
    }
  });

  const projects = useMemo(() => {
    const result = data?.projects.filter((p) => {
      if (!customerId) return true;

      return p.customer.id === customerId;
    });

    return result ?? [];
  }, [data, customerId]);

  const times = useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    let times = eachMinuteOfInterval(
      {
        start: now,
        end: new Date(now.getTime() + 24 * 60 * 60 * 1000)
      },
      {
        step: 15
      }
    ).map((date) => format(date, 'HH:mm'));

    times = [...new Set(times)];

    return times;
  }, []);

  const durations = useMemo(() => {
    return times.slice(0, times.length / 2);
  }, [times]);

  const onSubmitCreateActivity = (values: z.infer<typeof formSchema>) => {
    const { project, start, finish } = values;

    const s = timeToDate(start);
    const f = timeToDate(finish);

    createActivity({
      variables: {
        projectId: project,
        start: s.toISOString(),
        finish: !isNaN(f.getTime()) ? f.toISOString() : null
      }
    }).then();

    setDialogOpen(false);
  };

  const timeToDate = (time: string) => {
    const formValues = form.getValues();

    const [hours, minutes] = time.split(':').map((p) => Number(p));

    const date = new Date(formValues.startDate.getTime()).setHours(hours, minutes, 0, 0);

    return new Date(date);
  };

  const recalculateDuration = () => {
    const formValues = form.getValues();

    formValues.startDate.setHours(0, 0, 0, 0);

    const start = timeToDate(formValues.start);
    const finish = timeToDate(formValues.finish);

    if (!finish) {
      form.resetField('duration');
      return;
    }

    const duration = intervalToDuration({ start: start, end: finish });

    const result = moment.utc(moment.duration(duration).as('milliseconds')).format('HH:mm');

    form.setValue('duration', result);
  };

  const recalculateFinish = () => {
    const formValues = form.getValues();

    formValues.startDate.setHours(0, 0, 0, 0);

    const start = timeToDate(formValues.start);

    const duration = intervalToDuration({
      start: formValues.startDate,
      end: timeToDate(formValues.duration)
    });

    const finish = add(start, duration);

    const result = format(finish, 'HH:mm');

    form.setValue('finish', result);
  };

  const onOpenChanged = (open: boolean) => {
    setDialogOpen(open);
    form.reset();
  };

  const onFinishTimeChosen = (event: React.MouseEvent<HTMLButtonElement>, time: string) => {
    event.preventDefault();
    form.setValue('finish', time);
    setFinishPopoverOpen(false);
    recalculateDuration();
  };

  const onFinishWithCurrentTimeClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    form.setValue('finish', format(new Date(), 'HH:mm'));
    recalculateDuration();
  };

  const onStartTimeChosen = (event: React.MouseEvent<HTMLButtonElement>, time: string) => {
    event.preventDefault();
    form.setValue('start', time);
    setStartPopoverOpen(false);
    recalculateDuration();
  };

  const onStartWithCurrentTimeClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    form.setValue('start', format(new Date(), 'HH:mm'));
    recalculateDuration();
  };

  const onDurationChosen = (event: React.MouseEvent<HTMLButtonElement>, duration: string) => {
    event.preventDefault();
    form.setValue('duration', duration);
    setDurationPopoverOpen(false);
    recalculateFinish();
  };

  const onActivityCustomerChanged = () => {
    const { customer, project } = form.getValues();

    setCustomerId(customer);

    const projectCustomerId = data?.projects.find((p) => p.id === project)?.customer.id ?? '';

    if (projectCustomerId !== customer) {
      form.setValue('project', '');
    }
  };

  const onActivityProjectChanged = () => {
    const { customer, project } = form.getValues();

    if (project === '') return;

    const customerId = data?.projects.find((p) => p.id === project)?.customer.id ?? '';

    if (customer !== customerId) {
      setCustomerId(customerId);
      form.setValue('customer', customerId);
    }
  };

  const onStartDateChanged = (startDate: Date | undefined) => {
    form.setValue('startDate', startDate!);
    setStartDatePopoverOpen(false);
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={onOpenChanged}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Create an activity</DialogTitle>
          <DialogDescription>
            Create an activity, set from / to and assign it to project.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmitCreateActivity)} className="space-y-4">
            <div className="space-y-2">
              <FormLabel>From</FormLabel>
              <div className="grid grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <Popover
                        modal={true}
                        open={startDatePopoverOpen}
                        onOpenChange={setStartDatePopoverOpen}>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={'outline'}
                              className={cn(
                                'pl-3 text-left font-normal',
                                !field.value && 'text-muted-foreground'
                              )}>
                              {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={onStartDateChanged}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="start"
                  render={({ field }) => (
                    <FormItem
                      className="flex flex-grow flex-col justify-end"
                      onChange={recalculateDuration}>
                      <div className="flex items-center rounded-md">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={onStartWithCurrentTimeClick}
                          className="basis-16 rounded-r-none border-r-0 focus-visible:relative">
                          <Clock9 className="h-4 w-4" />
                        </Button>
                        <Input
                          placeholder="HH:MM"
                          className={cn(
                            'rounded-l-none rounded-r-none pl-3 font-normal focus-visible:relative focus-visible:ring-offset-0',
                            !field.value && 'text-muted-foreground'
                          )}
                          autoComplete="off"
                          {...field}
                        />
                        <Popover
                          modal={true}
                          open={startPopoverOpen}
                          onOpenChange={setStartPopoverOpen}>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              size="icon"
                              className="basis-16 rounded-l-none border-l-0">
                              <ChevronDown className="h-4 w-4" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <ScrollArea className="h-[30rem] w-[20rem] p-2">
                              <div className="grid grid-cols-4 gap-2 p-2">
                                {times.map((time) => (
                                  <Button
                                    key={'start-' + time}
                                    variant={'outline'}
                                    onSelect={field.onChange}
                                    onClick={(event) => onStartTimeChosen(event, time)}>
                                    {time}
                                  </Button>
                                ))}
                              </div>
                            </ScrollArea>
                          </PopoverContent>
                        </Popover>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="space-y-2">
              <FormLabel>Duration / To</FormLabel>
              <div className="grid grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem className="flex flex-col" onChange={recalculateFinish}>
                      <div className="flex items-center rounded-md">
                        <Button
                          variant="outline"
                          size="icon"
                          disabled
                          className="basis-16 rounded-r-none border-r-0 focus-visible:relative">
                          <Clock9 className="h-4 w-4" />
                        </Button>
                        <Input
                          placeholder="HH:MM"
                          className={cn(
                            'rounded-l-none rounded-r-none pl-3 font-normal focus-visible:relative focus-visible:ring-offset-0',
                            !field.value && 'text-muted-foreground'
                          )}
                          autoComplete="off"
                          {...field}
                        />
                        <Popover
                          modal={true}
                          open={durationPopoverOpen}
                          onOpenChange={setDurationPopoverOpen}>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              size="icon"
                              className="basis-16 rounded-l-none border-l-0">
                              <ChevronDown className="h-4 w-4" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <ScrollArea className="h-[30rem] w-[20rem] p-2">
                              <div className="grid grid-cols-4 gap-2 p-2">
                                {durations.map((duration) => (
                                  <Button
                                    key={'duration-' + duration}
                                    variant={'outline'}
                                    onSelect={field.onChange}
                                    onClick={(event) => onDurationChosen(event, duration)}>
                                    {duration}
                                  </Button>
                                ))}
                              </div>
                            </ScrollArea>
                          </PopoverContent>
                        </Popover>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="finish"
                  render={({ field }) => (
                    <FormItem className="flex flex-grow flex-col" onChange={recalculateDuration}>
                      <div className="flex items-center rounded-md">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={onFinishWithCurrentTimeClick}
                          className="basis-16 rounded-r-none border-r-0 focus-visible:relative">
                          <Clock9 className="h-4 w-4" />
                        </Button>
                        <Input
                          placeholder="HH:MM"
                          className={cn(
                            'rounded-l-none rounded-r-none pl-3 font-normal focus-visible:relative focus-visible:ring-offset-0',
                            !field.value && 'text-muted-foreground'
                          )}
                          autoComplete="off"
                          {...field}
                        />
                        <Popover
                          modal={true}
                          open={finishPopoverOpen}
                          onOpenChange={setFinishPopoverOpen}>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              size="icon"
                              className="basis-16 rounded-l-none border-l-0">
                              <ChevronDown className="h-4 w-4" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <ScrollArea className="h-[30rem] w-[20rem] p-2">
                              <div className="grid grid-cols-4 gap-2 p-2">
                                {times.map((time) => (
                                  <Button
                                    key={'finish-' + time}
                                    variant={'outline'}
                                    onSelect={field.onChange}
                                    onClick={(event) => onFinishTimeChosen(event, time)}>
                                    {time}
                                  </Button>
                                ))}
                              </div>
                            </ScrollArea>
                          </PopoverContent>
                        </Popover>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <FormField
              control={form.control}
              name="customer"
              render={({ field }) => (
                <FormItem onChange={onActivityCustomerChanged}>
                  <FormLabel>Customer</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a customer" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {data?.customers.map((customer) => (
                        <SelectItem key={customer.id} value={customer.id}>
                          {customer.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="project"
              render={({ field }) => (
                <FormItem onChange={onActivityProjectChanged}>
                  <FormLabel>Project</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a project" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {projects?.map((project) => (
                        <SelectItem key={project.id} value={project.id}>
                          {project.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">Create</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
