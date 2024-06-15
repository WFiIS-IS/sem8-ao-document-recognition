import { useRunningActivities } from '@/api/apollo/hooks/useActivitiesRunning.ts';
import { ActivityCreateDialog } from '@/pages/activities/table/activityCreateDialog.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Pause, Play } from 'lucide-react';
import { formatDuration } from '@/lib/utils.ts';
import { useEffect, useState } from 'react';
import { useToast } from '@/components/ui/use-toast.ts';
import { useActivityUpdateMutation } from '@/api/apollo/hooks/useActivityUpdateMutation.ts';

export const ActivityPlayButton = () => {
  const { data, loading } = useRunningActivities();
  const [updateActivity] = useActivityUpdateMutation();
  const { toast } = useToast();

  const [duration, setDuration] = useState(formatDuration(...(data?.activities ?? [])));

  useEffect(() => {
    if (!data?.activities.length) {
      return;
    }

    const interval = setInterval(() => {
      setDuration(() => formatDuration(...(data?.activities ?? [])));
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [data]);

  const onFinishActivityClick = () => {
    if (!data) return;

    if (data.activities.length > 1) {
      toast({
        title: 'There are more than 1 running activity. It is not supported in current version'
      });
    }

    if (data.activities.length === 0) {
      toast({
        title: 'No running activities found'
      });
    }

    const activity = data.activities[0];

    updateActivity({
      variables: {
        id: activity.id,
        start: activity.start,
        finish: new Date()
      }
    }).then();
  };

  return (
    <div>
      {loading ? (
        <></>
      ) : (
        <>
          {data?.activities.length ? (
            <Button variant="outline" onClick={onFinishActivityClick}>
              {duration} <Pause className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <ActivityCreateDialog>
              <Button variant="outline">
                00:00 <Play className="ml-2 h-4 w-4" />
              </Button>
            </ActivityCreateDialog>
          )}
        </>
      )}
    </div>
  );
};
