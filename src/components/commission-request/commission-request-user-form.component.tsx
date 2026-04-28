import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useCommissionTopicsQuery } from '@/queries/commission-topic.queries';
import {
  useCreateCommissionRequestMutation,
  useUpdateCommissionRequestMutation,
} from '@/queries/commission-request.queries';
import { useUserProfileQuery } from '@/queries/users.queries';
import {
  commissionRequestCreateSchema,
  type CommissionRequestCreateFormInput,
} from '@/utils/validations-commission-request/commission-request-create.utils';
import {
  commissionRequestUserUpdateSchema,
  type CommissionRequestUserUpdateFormInput,
} from '@/utils/validations-commission-request/commission-request-user-update.utils';
import { searchCityOrCountry, type NominatimFeature } from '@/api/nominatim.api';
import { ApiError } from '@/api/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CommissionRequestStatus } from '@/types/enums/commission-status.enums';
import type { CommissionRequestResponse } from '@/types/commission-request.types';

interface CommissionRequestUserFormProps {
  request?: CommissionRequestResponse;
  onClose: () => void;
}

const getMinDeadline = () => {
  const d = new Date();
  d.setDate(d.getDate() + 7);
  return d.toISOString().split('T')[0];
};

export const CommissionRequestUserForm = ({ request, onClose }: CommissionRequestUserFormProps) => {
  const isEditing = !!request;
  const { data: user } = useUserProfileQuery();
  const { data: topics = [] } = useCommissionTopicsQuery();
  const { mutate: createRequest, isPending: isCreating } = useCreateCommissionRequestMutation();
  const { mutate: updateRequest, isPending: isUpdating } = useUpdateCommissionRequestMutation();
  const isPending = isCreating || isUpdating;

  const [addressSearch, setAddressSearch] = useState('');
  const [addressResults, setAddressResults] = useState<NominatimFeature[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isAddressSelected, setIsAddressSelected] = useState(false);

  const createForm = useForm<CommissionRequestCreateFormInput>({
    resolver: zodResolver(commissionRequestCreateSchema),
  });

  const updateForm = useForm<CommissionRequestUserUpdateFormInput>({
    resolver: zodResolver(commissionRequestUserUpdateSchema),
  });

  useEffect(() => {
    if (request) {
      updateForm.reset({
        description: request.description,
        budgetMin: request.budgetMin,
        budgetMax: request.budgetMax,
        deadline: request.deadline,
        contacts: {
          telegram: request.contacts.telegram ?? '',
          instagram: request.contacts.instagram ?? '',
          whatsapp: request.contacts.whatsapp ?? '',
        },
        status: request.status,
      });
    }
  }, [request]);

  useEffect(() => {
    const debounce = setTimeout(
      async () => {
        if (!addressSearch || isAddressSelected) {
          setAddressResults([]);
          return;
        }
        const response = await searchCityOrCountry(addressSearch);
        setAddressResults(response);
        setShowDropdown(true);
      },
      addressSearch ? 300 : 0
    );

    return () => clearTimeout(debounce);
  }, [addressSearch, isAddressSelected]);

  const handleCreateSubmit = (data: CommissionRequestCreateFormInput) => {
    if (!user) return;
    createRequest(
      {
        userId: user.id,
        topicId: data.topicId,
        title: data.title,
        description: data.description,
        budgetMin: data.budgetMin,
        budgetMax: data.budgetMax,
        deadline: data.deadline,
        contacts: {
          telegram: data.contacts.telegram ?? '',
          instagram: data.contacts.instagram ?? '',
          whatsapp: data.contacts.whatsapp ?? '',
        },
        status: CommissionRequestStatus.PENDING,
        city: data.city,
        longitude: data.longitude,
        latitude: data.latitude,
      },
      {
        onSuccess: () => {
          toast.success('Request created');
          onClose();
        },
        onError: error => {
          if (error instanceof ApiError) toast.error('Failed to create request');
        },
      }
    );
  };

  const handleUpdateSubmit = (data: CommissionRequestUserUpdateFormInput) => {
    if (!request) return;
    updateRequest(
      {
        id: request.id,
        userId: request.userId,
        data: {
          description: data.description,
          budgetMin: data.budgetMin,
          budgetMax: data.budgetMax,
          deadline: data.deadline,
          contacts: {
            telegram: data.contacts.telegram ?? '',
            instagram: data.contacts.instagram ?? '',
            whatsapp: data.contacts.whatsapp ?? '',
          },
          status: data.status as CommissionRequestStatus,
        },
      },
      {
        onSuccess: () => {
          toast.success('Request updated');
          onClose();
        },
        onError: error => {
          if (error instanceof ApiError) toast.error('Failed to update request');
        },
      }
    );
  };

  if (isEditing) {
    return (
      <form
        onSubmit={e => void updateForm.handleSubmit(handleUpdateSubmit)(e)}
        className='flex flex-col gap-5'
      >
        <div className='flex flex-col gap-2'>
          <Label className='text-xs font-bold text-foreground/50 uppercase tracking-wider'>
            Description *
          </Label>
          <textarea
            {...updateForm.register('description')}
            rows={4}
            placeholder='Describe what you want...'
            className={cn(
              'w-full rounded-md border border-input bg-background px-3 py-2 text-sm',
              'focus:outline-none focus:ring-2 focus:ring-ring resize-none',
              updateForm.formState.errors.description && 'border-destructive'
            )}
          />
          {updateForm.formState.errors.description && (
            <p className='text-xs text-destructive'>
              {updateForm.formState.errors.description.message}
            </p>
          )}
        </div>

        <div className='flex gap-3'>
          <div className='flex flex-col gap-2 flex-1'>
            <Label className='text-xs font-bold text-foreground/50 uppercase tracking-wider'>
              Budget min *
            </Label>
            <Input
              {...updateForm.register('budgetMin', { valueAsNumber: true })}
              type='number'
              placeholder='0'
            />
          </div>
          <div className='flex flex-col gap-2 flex-1'>
            <Label className='text-xs font-bold text-foreground/50 uppercase tracking-wider'>
              Budget max *
            </Label>
            <Input
              {...updateForm.register('budgetMax', { valueAsNumber: true })}
              type='number'
              placeholder='0'
            />
          </div>
        </div>

        <div className='flex flex-col gap-2'>
          <Label className='text-xs font-bold text-foreground/50 uppercase tracking-wider'>
            Deadline *
          </Label>
          <Input {...updateForm.register('deadline')} type='date' min={getMinDeadline()} />
        </div>

        <div className='flex flex-col gap-2'>
          <p className='text-xs font-bold text-foreground/50 uppercase tracking-wider'>Contacts</p>
          <div className='flex flex-col gap-3'>
            {(['telegram', 'instagram', 'whatsapp'] as const).map(contact => (
              <div key={contact} className='flex flex-col gap-1'>
                <Label className='text-xs capitalize text-muted-foreground'>{contact}</Label>
                <Input
                  {...updateForm.register(`contacts.${contact}`)}
                  placeholder={`@${contact}`}
                />
              </div>
            ))}
          </div>
        </div>

        <div className='flex gap-3 pt-2'>
          <Button
            type='submit'
            disabled={isPending}
            className='bg-brand-green text-white hover:bg-brand-green-hover'
          >
            {isPending ? 'Saving...' : 'Save changes'}
          </Button>
          <Button type='button' variant='outline' onClick={onClose}>
            Cancel
          </Button>
        </div>
      </form>
    );
  }

  return (
    <form
      onSubmit={e => void createForm.handleSubmit(handleCreateSubmit)(e)}
      className='flex flex-col gap-5'
    >
      <div className='flex flex-col gap-2'>
        <Label className='text-xs font-bold text-foreground/50 uppercase tracking-wider'>
          Topic *
        </Label>
        <select
          {...createForm.register('topicId')}
          className='w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring'
        >
          <option value=''>Select a topic</option>
          {topics
            .filter(t => t.isActive)
            .map(topic => (
              <option key={topic.id} value={topic.id}>
                {topic.icon} {topic.name}
              </option>
            ))}
        </select>
        {createForm.formState.errors.topicId && (
          <p className='text-xs text-destructive'>{createForm.formState.errors.topicId.message}</p>
        )}
      </div>

      <div className='flex flex-col gap-2'>
        <Label className='text-xs font-bold text-foreground/50 uppercase tracking-wider'>
          Title *
        </Label>
        <Input
          {...createForm.register('title')}
          placeholder='e.g. Portrait of my cat'
          className={cn(createForm.formState.errors.title && 'border-destructive')}
        />
        {createForm.formState.errors.title && (
          <p className='text-xs text-destructive'>{createForm.formState.errors.title.message}</p>
        )}
      </div>

      <div className='flex flex-col gap-2'>
        <Label className='text-xs font-bold text-foreground/50 uppercase tracking-wider'>
          Location
        </Label>
        <div className='relative'>
          <Input
            value={addressSearch}
            placeholder='Search your city...'
            onChange={e => {
              setAddressSearch(e.target.value);
              if (isAddressSelected) {
                createForm.setValue('city', '');
                setIsAddressSelected(false);
              }
            }}
            onFocus={() => addressResults.length > 0 && setShowDropdown(true)}
            onBlur={() => {
              setTimeout(() => {
                setShowDropdown(false);
                if (!isAddressSelected && addressSearch) {
                  setAddressSearch('');
                }
              }, 150);
            }}
          />
          {showDropdown && addressResults.length > 0 && (
            <ul className='absolute z-50 mt-1 w-full rounded-xl border border-border bg-white shadow-lg max-h-60 overflow-y-auto'>
              {addressResults.map((result, index) => (
                <li
                  key={index}
                  onMouseDown={() => {
                    const displayName = result.displayName;
                    const lon = parseFloat(result.lon);
                    const lat = parseFloat(result.lat);

                    setAddressSearch(displayName);
                    createForm.setValue('city', displayName);
                    if (!isNaN(lon)) createForm.setValue('longitude', lon);
                    if (!isNaN(lat)) createForm.setValue('latitude', lat);
                    setIsAddressSelected(true);
                    setShowDropdown(false);
                  }}
                  className='px-4 py-3 text-sm cursor-pointer hover:bg-muted transition-colors first:rounded-t-xl last:rounded-b-xl'
                >
                  {result.displayName}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className='flex flex-col gap-2'>
        <Label className='text-xs font-bold text-foreground/50 uppercase tracking-wider'>
          Description *
        </Label>
        <textarea
          {...createForm.register('description')}
          rows={4}
          placeholder='Describe what you want...'
          className={cn(
            'w-full rounded-md border border-input bg-background px-3 py-2 text-sm',
            'focus:outline-none focus:ring-2 focus:ring-ring resize-none',
            createForm.formState.errors.description && 'border-destructive'
          )}
        />
        {createForm.formState.errors.description && (
          <p className='text-xs text-destructive'>
            {createForm.formState.errors.description.message}
          </p>
        )}
      </div>

      <div className='flex gap-3'>
        <div className='flex flex-col gap-2 flex-1'>
          <Label className='text-xs font-bold text-foreground/50 uppercase tracking-wider'>
            Budget min *
          </Label>
          <Input
            {...createForm.register('budgetMin', { valueAsNumber: true })}
            type='number'
            placeholder='0'
          />
        </div>
        <div className='flex flex-col gap-2 flex-1'>
          <Label className='text-xs font-bold text-foreground/50 uppercase tracking-wider'>
            Budget max *
          </Label>
          <Input
            {...createForm.register('budgetMax', { valueAsNumber: true })}
            type='number'
            placeholder='0'
          />
        </div>
      </div>

      <div className='flex flex-col gap-2'>
        <Label className='text-xs font-bold text-foreground/50 uppercase tracking-wider'>
          Deadline *
        </Label>
        <Input {...createForm.register('deadline')} type='date' min={getMinDeadline()} />
      </div>

      <div className='flex flex-col gap-2'>
        <p className='text-xs font-bold text-foreground/50 uppercase tracking-wider'>Contacts</p>
        <div className='flex flex-col gap-3'>
          {(['telegram', 'instagram', 'whatsapp'] as const).map(contact => (
            <div key={contact} className='flex flex-col gap-1'>
              <Label className='text-xs capitalize text-muted-foreground'>{contact}</Label>
              <Input {...createForm.register(`contacts.${contact}`)} placeholder={`@${contact}`} />
            </div>
          ))}
        </div>
      </div>

      <div className='flex gap-3 pt-2'>
        <Button
          type='submit'
          disabled={isPending}
          className='bg-brand-green text-white hover:bg-brand-green-hover'
        >
          {isPending ? 'Saving...' : 'Create request'}
        </Button>
        <Button type='button' variant='outline' onClick={onClose}>
          Cancel
        </Button>
      </div>
    </form>
  );
};
