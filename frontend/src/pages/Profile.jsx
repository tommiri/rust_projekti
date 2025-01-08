import ProfileCardEmail from '@components/ProfileCardEmail';
import ProfileCardPassword from '@components/ProfileCardPassword';
import ProfileCardFirstname from '@components/ProfileCardFirstname';
import ProfileCardLastname from '@components/ProfileCardLastname';

function Profile() {
  return (
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
  );
}

export default Profile;
