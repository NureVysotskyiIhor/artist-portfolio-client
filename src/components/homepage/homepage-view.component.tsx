import type { HomepageProfileResponse } from '@/types/homepage-profile.types';

interface HomepageViewProps {
  profile: HomepageProfileResponse | undefined;
}

export const HomepageView = ({ profile }: HomepageViewProps) => {
  if (!profile) {
    return (
      <main className='flex min-h-[calc(100vh-57px)] items-center justify-center bg-brand-cream'>
        <div className='text-center'>
          <h1 className='font-playfair text-3xl font-bold text-brand-green mb-2'>Coming soon</h1>
          <p className='text-sm text-muted-foreground'>This portfolio is still being set up</p>
        </div>
      </main>
    );
  }

  return (
    <main className='max-w-3xl mx-auto px-4 py-10'>
      <section className='mb-10'>
        <p className='text-[11px] font-bold tracking-[.18em] uppercase text-brand-green mb-2'>
          Artist Portfolio
        </p>
        <h1 className='font-playfair text-4xl font-bold text-foreground mb-2'>{profile.name}</h1>
        {profile.title && <p className='text-lg text-muted-foreground mb-4'>{profile.title}</p>}
        {profile.bio && <p className='text-sm text-foreground/70 leading-relaxed'>{profile.bio}</p>}
      </section>

      {profile.skills?.length > 0 && (
        <section className='mb-8'>
          <h2 className='text-xs font-bold tracking-[.18em] uppercase text-brand-green mb-3'>
            Skills
          </h2>
          <div className='flex flex-wrap gap-2'>
            {profile.skills.map(skill => (
              <span
                key={skill}
                className='px-3 py-1 text-sm rounded-full bg-brand-green-muted text-brand-green border border-brand-green-muted'
              >
                {skill}
              </span>
            ))}
          </div>
        </section>
      )}

      {profile.achievements?.length > 0 && (
        <section className='mb-8'>
          <h2 className='text-xs font-bold tracking-[.18em] uppercase text-brand-green mb-3'>
            Achievements
          </h2>
          <ul className='flex flex-col gap-2'>
            {profile.achievements.map(achievement => (
              <li key={achievement} className='flex items-center gap-2 text-sm text-foreground/70'>
                <span className='w-1.5 h-1.5 rounded-full bg-brand-green shrink-0' />
                {achievement}
              </li>
            ))}
          </ul>
        </section>
      )}

      {(profile.contacts?.telegram ||
        profile.contacts?.instagram ||
        profile.contacts?.whatsapp) && (
        <section>
          <h2 className='text-xs font-bold tracking-[.18em] uppercase text-brand-green mb-3'>
            Contacts
          </h2>
          <div className='flex flex-col gap-2'>
            {profile.contacts.telegram && (
              <a
                href={`https://t.me/${profile.contacts.telegram.replace('@', '')}`}
                target='_blank'
                rel='noreferrer'
                className='text-sm text-brand-green hover:underline'
              >
                Telegram: {profile.contacts.telegram}
              </a>
            )}
            {profile.contacts.instagram && (
              <a
                href={`https://instagram.com/${profile.contacts.instagram.replace('@', '')}`}
                target='_blank'
                rel='noreferrer'
                className='text-sm text-brand-green hover:underline'
              >
                Instagram: {profile.contacts.instagram}
              </a>
            )}
            {profile.contacts.whatsapp && (
              <p className='text-sm text-foreground/70'>WhatsApp: {profile.contacts.whatsapp}</p>
            )}
          </div>
        </section>
      )}
    </main>
  );
};
