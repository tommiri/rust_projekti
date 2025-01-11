// Importing components for changing email, password, first name, and last name
import ProfileCardEmail from '@components/ProfileCardEmail';
import ProfileCardPassword from '@components/ProfileCardPassword';
import ProfileCardFirstname from '@components/ProfileCardFirstname';
import ProfileCardLastname from '@components/ProfileCardLastname';
import ProfileDisplay from '@/components/ProfileDisplay';

function Profile() {
  return (
    // Main profile page containing all the profile card components
    <div>
      <ProfileDisplay />
      <div className="p-4 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <ProfileCardEmail />
        </div>
        <div>
          <ProfileCardPassword />
        </div>
        <div>
          <ProfileCardFirstname />
        </div>
        <div>
          <ProfileCardLastname />
        </div>
      </div>
    </div>
  );
}

export default Profile; // Export the component for use on the website
