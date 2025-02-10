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

// Import a service function to handle password updates
import { updatePassword } from '@/services/profileChange';

function ProfileCardPassword() {
  // State to store the new password input value
  const [password, setPassword] = useState('');

  // State to store the confirmation password input value
  const [confirmPassword, setConfirmPassword] = useState('');

  // State to store any error message if the password update fails
  const [error, setError] = useState(null);

  // State to store a success message if the password update succeeds
  const [successMessage, setSuccessMessage] = useState(null);

  // Event handler for form submission
  const handlePasswordSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior

    // Check if passwords match before proceeding
    if (password !== confirmPassword) {
      setError('Passwords do not match!'); // Display an error if they don't match
      return;
    }

    try {
      // Attempt to update the password via the updatePassword service
      await updatePassword(password);

      // Reset the password input fields and set a success message
      setPassword('');
      setConfirmPassword('');
      setSuccessMessage('Password updated successfully!');

      // Clear any existing error message
      setError(null);
    } catch (err) {
      // Handle errors by displaying an error message
      setError('Failed to update password.');
      setSuccessMessage(null);
    }
  };

  return (
    // Main card component containing the password update form
    <div className="mx-auto max-w-sm">
      {/* Card header with title and description */}
      <CardHeader>
        <CardTitle className="text-2xl">Vaihda salasana</CardTitle> {/* Title: "Change Password" in Finnish */}
        <CardDescription>Anna uusi salasana</CardDescription> {/* Description: "Enter a new password" */}
      </CardHeader>

      {/* Card content containing the password input form */}
      <CardContent>
        <form onSubmit={handlePasswordSubmit}>
          <div className="grid gap-4">
            {/* Password input field */}
            <div className="grid gap-2">
              <Label htmlFor="password">Salasana</Label> {/* Label: "Password" in Finnish */}
              <Input
                id="password"
                type="password" // Ensures the input is masked
                value={password} // Controlled input linked to password state
                required // Makes the field required
                onChange={(e) => setPassword(e.target.value)} // Update state on input change
              />
            </div>

            {/* Confirm password input field */}
            <div className="grid gap-2">
              <Label htmlFor="confirmPassword">Varmista salasana</Label> {/* Label: "Confirm Password" in Finnish */}
              <Input
                id="confirmPassword"
                type="password" // Ensures the input is masked
                value={confirmPassword} // Controlled input linked to confirmPassword state
                required // Makes the field required
                onChange={(e) => setConfirmPassword(e.target.value)} // Update state on input change
              />
            </div>

            {/* Submit button to update the password */}
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

        {/* Display success message if password update succeeds */}
        {successMessage && <div className="text-green-500">{successMessage}</div>}
      </CardContent>
    </div>
  );
}

export default ProfileCardPassword; // Export the component for use in other parts of the application
