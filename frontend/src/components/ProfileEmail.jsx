// Import React's useState hook for managing component state
import { useState } from 'react';

// Import UI components for the card, button, input, and label
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// Import a service function to handle email updates
import { updateEmail } from '@/services/profileChange';

function ProfileCardEmail() {
  // State to store the email input value
  const [email, setEmail] = useState('');

  // State to store any error message if the email update fails
  const [error, setError] = useState(null);

  // State to store a success message if the email update succeeds
  const [successMessage, setSuccessMessage] = useState(null);

  // Event handler for form submission
  const handleEmailSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior

    try {
      // Attempt to update the email via the updateEmail service
      await updateEmail(email);

      // Reset the email input field and set a success message
      setEmail('');
      setSuccessMessage('Email updated successfully!');

      // Clear any existing error message
      setError(null);
    } catch (err) {
      // Handle errors by displaying an error message
      setError('Failed to update email.');
      setSuccessMessage(null);
    }
  };

  return (
    // Main card component containing the email update form
    <div className="mx-auto max-w-sm">
      {/* Card header with title and description */}
      <CardHeader>
        <CardTitle className="text-2xl">Vaihda sähköposti</CardTitle> {/* Title: "Change Email" in Finnish */}
        <CardDescription>Anna uusi sähköposti</CardDescription> {/* Description: "Enter a new email" */}
      </CardHeader>

      {/* Card content containing the email input form */}
      <CardContent>
        <form onSubmit={handleEmailSubmit}>
          <div className="grid gap-4">
            <div className="grid gap-2">
              {/* Label for the email input field */}
              <Label htmlFor="email">Sähköposti</Label> {/* Label: "Email" in Finnish */}
              {/* Email input field */}
              <Input
                id="email"
                type="email"
                value={email} // Controlled input linked to email state
                required // Makes the field required
                onChange={(e) => setEmail(e.target.value)} // Update state on input change
              />
            </div>
            {/* Submit button to update the email */}
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

        {/* Display success message if email update succeeds */}
        {successMessage && <div className="text-green-500">{successMessage}</div>}
      </CardContent>
    </div>
  );
}

export default ProfileCardEmail; // Export the component for use in other parts of the application
