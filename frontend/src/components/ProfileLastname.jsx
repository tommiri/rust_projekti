// Import React's useState hook for managing component state
import { useState } from 'react';

// Import UI components for the card, button, input, and label
import { Button } from '@/components/ui/button';
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// Import a service function to handle last name updates
import { updateLastname } from '@/services/profileChange';
import { useAuth } from '@/providers/authProvider';

function ProfileCardLastname() {
  const { token } = useAuth(); // Use the useAuth hook to get the authentication token
  const [lastname, setLastname] = useState('');

  // State to store any error message if the last name update fails
  const [error, setError] = useState(null);

  // State to store a success message if the last name update succeeds
  const [successMessage, setSuccessMessage] = useState(null);

  // Event handler for form submission
  const handleLastnameSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      setError('You must be logged in to update your last name.');
      return;
    }

    try {
      await updateLastname(lastname, token);
      setLastname('');
      setSuccessMessage('Last name updated successfully!');
      setError(null);
    } catch (err) {
      setError('Failed to update last name.');
      setSuccessMessage(null);
    }
  };

  return (
    <div className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Vaihda sukunimi</CardTitle> {/* Title: "Change Last Name" in Finnish */}
        <CardDescription>Anna uusi sukunimi</CardDescription> {/* Description: "Enter a new last name" */}
      </CardHeader>

      {/* Card content containing the last name input form */}
      <CardContent>
        <form onSubmit={handleLastnameSubmit}>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="lastname">Sukunimi</Label>
              <Input
                id="lastname"
                type="text"
                value={lastname}
                required
                onChange={(e) => setLastname(e.target.value)}
              />
            </div>
            {/* Submit button to update the last name */}
            <Button type="submit" className="w-full">
              Päivitä {/* "Update" in Finnish */}
            </Button>
          </div>
        </form>
      </CardContent>
      {/* Card content for displaying success or error messages */}
      <CardContent>
        {/* Display error message if an error occurs */}
        {error && <div className="text-red-500">{error}</div>}

        {/* Display success message if last name update succeeds */}
        {successMessage && <div className="text-green-500">{successMessage}</div>}
      </CardContent>
    </div>
  );
}


export default ProfileCardLastname; // Export the component for use in other parts of the application
