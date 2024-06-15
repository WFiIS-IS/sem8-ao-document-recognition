import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card.tsx';
import { add, format, intervalToDuration, isMonday, previousMonday } from 'date-fns';
import { useActivitiesDashboard } from '@/api/apollo/hooks/useActivitiesDashboard.ts';
import { useMemo } from 'react';
import moment from 'moment';
import { groupBy } from 'lodash';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ResponsiveTimeRange } from '@nivo/calendar';
import { Calendar } from 'lucide-react';

export const useMondays = () => {
  const thisMonday = useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return isMonday(now) ? now : previousMonday(now);
  }, [new Date().getDay()]);

  const nextMonday = useMemo(() => {
    const copy = new Date(thisMonday.getTime());
    return new Date(copy.setDate(thisMonday.getDate() + 7));
  }, [thisMonday]);

  const startOfTheYear = useMemo(() => {
    return new Date(new Date().getFullYear(), 0, 1);
  }, []);

  const tomorrow = useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return new Date(now.setDate(now.getDate() + 1));
  }, []);

  return { tomorrow, thisMonday, nextMonday, startOfTheYear };
};

export function Dashboard() {
  const { tomorrow, thisMonday, nextMonday, startOfTheYear } = useMondays();

  const { data } = useActivitiesDashboard(startOfTheYear, nextMonday);

  const dates = useMemo(() => {
    return [...Array(7).keys()].map((i) => format(add(thisMonday, { days: i }), 'dd/MM'));
  }, [thisMonday]);

  const { weekBars, heatMapPoints, timeToday, timeThisWeek, timeThisYear } = useMemo(() => {
    if (!data?.activities) return { weekBars: [], heatMapPoints: [] };

    const activities = data.activities.map((activity) => {
      return {
        ...activity,
        x: new Date(activity.start).setHours(0, 0, 0, 0),
        y: moment
          .duration(
            intervalToDuration({ start: activity.start, end: activity.finish ?? new Date() })
          )
          .as('minutes')
      };
    });

    const groups = groupBy(activities, (activity) => activity.x);

    const points = Object.entries(groups).map(([key, value]) => {
      return {
        x: +key,
        y: value.reduce((acc, activity) => acc + activity.y, 0)
      };
    });

    const bars = points.map((bar) => {
      return {
        x: format(bar.x, 'dd/MM'),
        y: bar.y
      };
    });

    const weekBars = dates.map((date) => {
      const bar = bars.find((bar) => bar.x === date);
      return bar ?? { x: date, y: undefined };
    });

    const heatMapPoints = points.map((point) => {
      return {
        value: point.y,
        day: format(point.x, 'yyyy-MM-dd')
      };
    });

    const minutesToday = weekBars.find((bar) => bar.x === format(new Date(), 'dd/MM'))?.y ?? 0;
    const minutesThisWeek = weekBars.reduce((acc, bar) => acc + (bar.y ?? 0), 0);
    const minutesThisYear = heatMapPoints.reduce((acc, point) => acc + point.value, 0);

    const timeToday = format(new Date().setHours(0, minutesToday, 0, 0), 'HH:mm');
    const timeThisWeek = format(new Date().setHours(0, minutesThisWeek, 0, 0), 'HH:mm');
    const timeThisYear = format(new Date().setHours(0, minutesThisYear, 0, 0), 'HH:mm');

    return { weekBars, heatMapPoints, timeToday, timeThisWeek, timeThisYear };
  }, [data?.activities]);

  console.log(tomorrow);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex max-w-full flex-wrap gap-4">
        <Card className="flex max-w-[40rem] flex-grow flex-col gap-8">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Week summary</CardTitle>
          </CardHeader>
          <CardContent className="basis-[30rem]">
            <ResponsiveContainer>
              <BarChart
                data={weekBars}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5
                }}>
                <CartesianGrid strokeDasharray="3 3" />
                <YAxis
                  tickFormatter={(value) =>
                    value ? format(new Date().setHours(0, value, 0, 0), 'HH:mm') : value
                  }
                  tickLine={false}
                  axisLine={false}
                />

                <XAxis
                  dataKey="x"
                  tickLine={false}
                  axisLine={false}
                  type="category"
                  ticks={dates}
                  interval={0}
                />
                <Tooltip cursor={false} isAnimationActive={false} />
                <Bar dataKey="y" fill="black" radius={[8, 8, 0, 0]} width={40} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="flex flex-grow flex-col flex-wrap gap-8">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Activity summary</CardTitle>
          </CardHeader>
          <CardContent className="basis-[20rem]">
            <ResponsiveTimeRange
              data={heatMapPoints}
              from={startOfTheYear}
              to={tomorrow}
              emptyColor="#ffffff"
              colors={['#dadada', '#7e7e7e', '#484848', '#000000']}
              dayBorderWidth={1}
              dayBorderColor="#f0f0f0"
            />
          </CardContent>
        </Card>
      </div>
      <div className="flex gap-4">
        <Card className="basis-[16rem]">
          <CardHeader className="pb-2">
            <div className="flex content-between justify-between">
              <CardDescription>Today</CardDescription>
              <Calendar className="h-4 w-4 text-xs text-muted-foreground" />
            </div>
            <CardTitle className="text-3xl">{timeToday}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">working hours</div>
          </CardContent>
        </Card>
        <Card className="basis-[16rem]">
          <CardHeader className="pb-2">
            <div className="flex content-between justify-between">
              <CardDescription>This Week</CardDescription>
              <Calendar className="h-4 w-4 text-xs text-muted-foreground" />
            </div>
            <CardTitle className="text-3xl">{timeThisWeek}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">working hours</div>
          </CardContent>
        </Card>
        <Card className="basis-[16rem]">
          <CardHeader className="pb-2">
            <div className="flex content-between justify-between">
              <CardDescription>This Year</CardDescription>
              <Calendar className="h-4 w-4 text-xs text-muted-foreground" />
            </div>
            <CardTitle className="text-3xl">{timeThisYear}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">working hours</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
