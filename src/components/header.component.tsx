import { Link, useNavigate } from '@tanstack/react-router';
import { useAuthStore } from '@/store/auth.store';
import { Button } from '@/components/ui/button';
import { UserCircle } from 'lucide-react';

const Header = () => {
  const { token, isArtist, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    void navigate({ to: '/' });
  };

  return (
    <header className='sticky top-0 z-50 w-full border-b border-brand-green-muted bg-brand-cream/95 backdrop-blur'>
      <div className='mx-auto flex h-14 max-w-5xl items-center justify-between px-4'>
        <div className='flex items-center gap-6'>
          <Link to='/' className='font-playfair text-lg font-semibold text-brand-green'>
            Lisa Art
          </Link>

          <nav className='flex items-center gap-4 text-sm'>
            <Link
              to='/paintings'
              className='text-muted-foreground transition-colors hover:text-brand-green [&.active]:font-medium [&.active]:text-brand-green'
            >
              Paintings
            </Link>

            <Link
              to={isArtist ? '/commission-request-artist' : '/commission-request'}
              className='text-muted-foreground transition-colors hover:text-brand-green [&.active]:font-medium [&.active]:text-brand-green'
            >
              Orders
            </Link>

            {isArtist ? (
              <Link
                to='/topics'
                className='text-muted-foreground transition-colors hover:text-brand-green [&.active]:font-medium [&.active]:text-brand-green'
              >
                Topics
              </Link>
            ) : (
              <Link
                to='/favorites'
                className='text-muted-foreground transition-colors hover:text-brand-green [&.active]:font-medium [&.active]:text-brand-green'
              >
                Favorites
              </Link>
            )}
          </nav>
        </div>

        <div className='flex items-center gap-2'>
          {token ? (
            <>
              <Link
                to='/profile'
                className='flex items-center justify-center w-8 h-8 rounded-full text-brand-green hover:bg-brand-green-muted transition-colors [&.active]:bg-brand-green-muted'
              >
                <UserCircle className='w-5 h-5' />
              </Link>
              <Button
                variant='outline'
                size='sm'
                onClick={handleLogout}
                className='border-brand-green text-brand-green hover:bg-brand-green-muted hover:text-brand-green'
              >
                Log out
              </Button>
            </>
          ) : (
            <>
              <Button
                variant='outline'
                size='sm'
                className='border-brand-green text-brand-green hover:bg-brand-green-muted hover:text-brand-green'
                asChild
              >
                <Link to='/login'>Log in</Link>
              </Button>
              <Button
                size='sm'
                className='bg-brand-green text-brand-cream hover:bg-brand-green-hover'
                asChild
              >
                <Link to='/register'>Sign up</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
