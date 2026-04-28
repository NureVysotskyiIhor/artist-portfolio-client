import { useState } from 'react';
import { useUserProfileQuery } from '@/queries/users.queries';
import { ProfileView } from '@/components/profile/profile-view.component';
import { ProfileEdit } from '@/components/profile/profile-edit.component';
import { EyebrowLabel } from '@/components/ui/eyebrow-label';

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const { data: user, isLoading } = useUserProfileQuery();

  if (isLoading) {
    return (
      <div className='flex min-h-[calc(100vh-57px)] items-center justify-center'>
        <p className='text-sm text-muted-foreground'>Loading...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <main className='max-w-2xl mx-auto px-4 py-10'>
      <div className='mb-8'>
        <EyebrowLabel>Account</EyebrowLabel>
        <h1 className='text-2xl font-bold font-playfair text-foreground'>My Profile</h1>
      </div>

      <div className='bg-white rounded-3xl border-[1.5px] border-border p-8 shadow-sm'>
        {isEditing ? (
          <ProfileEdit user={user} onClose={() => setIsEditing(false)} />
        ) : (
          <ProfileView user={user} onEdit={() => setIsEditing(true)} />
        )}
      </div>
    </main>
  );
};

export default ProfilePage;
