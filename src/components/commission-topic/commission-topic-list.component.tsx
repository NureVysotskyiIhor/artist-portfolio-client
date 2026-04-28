import { Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { CommissionTopicResponse } from '@/types/commission-topic.types';

interface CommissionTopicListProps {
  topics: CommissionTopicResponse[];
  onEdit: (topic: CommissionTopicResponse) => void;
  onDelete: (topic: CommissionTopicResponse) => void;
}

export const CommissionTopicList = ({ topics, onEdit, onDelete }: CommissionTopicListProps) => {
  if (topics.length === 0) {
    return (
      <div className='flex items-center justify-center py-16'>
        <p className='text-sm text-muted-foreground'>No topics yet</p>
      </div>
    );
  }

  return (
    <ul className='flex flex-col gap-3'>
      {topics.map(topic => (
        <li
          key={topic.id}
          className='flex items-center justify-between rounded-2xl border border-border bg-white p-4 shadow-sm'
        >
          <div className='flex items-center gap-3'>
            {topic.icon && <span className='text-xl'>{topic.icon}</span>}
            <div>
              <div className='flex items-center gap-2'>
                <p className='text-sm font-semibold text-foreground'>{topic.name}</p>
                {!topic.isActive && (
                  <span className='text-[10px] font-bold uppercase tracking-wider text-muted-foreground bg-muted px-2 py-0.5 rounded-full'>
                    Inactive
                  </span>
                )}
              </div>
              <p className='text-xs text-muted-foreground mt-0.5'>{topic.description}</p>
            </div>
          </div>

          <div className='flex items-center gap-2'>
            <Button
              variant='ghost'
              size='icon'
              onClick={() => onEdit(topic)}
              className='text-muted-foreground hover:text-brand-green hover:bg-brand-green-muted'
            >
              <Pencil className='w-4 h-4' />
            </Button>
            <Button
              variant='ghost'
              size='icon'
              onClick={() => onDelete(topic)}
              className='text-muted-foreground hover:text-destructive hover:bg-destructive/10'
            >
              <Trash2 className='w-4 h-4' />
            </Button>
          </div>
        </li>
      ))}
    </ul>
  );
};
