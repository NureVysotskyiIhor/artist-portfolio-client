import { useAuthStore } from '@/store/auth.store'
import { useHomepageProfileQuery } from '@/queries/homepage-profile.queries'
import { HomepageCreateForm } from '@/components/homepage/homepage-create.component'
import { HomepageEditForm } from '@/components/homepage/homepage-edit.component'
import { HomepageView } from '@/components/homepage/homepage-view.component'

const HomePage = () => {
  const { isArtist } = useAuthStore()
  const { data: profile, isLoading } = useHomepageProfileQuery()

  if (isLoading) {
    return (
      <div className="flex min-h-[calc(100vh-57px)] items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    )
  }

  if (isArtist && !profile) return <HomepageCreateForm />
  if (isArtist && profile) return <HomepageEditForm profile={profile} />

  return <HomepageView profile={profile} />
}

export default HomePage