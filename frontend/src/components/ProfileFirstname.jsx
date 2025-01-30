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

// Import a service function to handle first name updates
import { updateFirstname } from '@/services/profileChange';

function ProfileCardFirstname() {
  // State to store the first name input value
  const [firstname, setFirstname] = useState('');

  // State to store any error message if the first name update fails
  const [error, setError] = useState(null);

  // State to store a success message if the first name update succeeds
  const [successMessage, setSuccessMessage] = useState(null);

  // Event handler for form submission
  const handleFirstnameSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior

    try {
      // Attempt to update the first name via the updateFirstname service
      await updateFirstname(firstname);

      // Reset the first name input field and set a success message
      setFirstname('');
      setSuccessMessage('First name updated successfully!');

      // Clear any existing error message
      setError(null);
    } catch (err) {
      // Handle errors by displaying an error message
      setError('Failed to update First name.');
      setSuccessMessage(null);
    }
  };

  return (
    // Main card component containing the first name update form
    <div className="mx-auto max-w-sm">
      {/* Card header with title and description */}
      <CardHeader>
        <CardTitle className="text-2xl">Vaihda etunimi</CardTitle> {/* Title: "Change First Name" in Finnish */}
        <CardDescription>Anna uusi etunimi</CardDescription> {/* Description: "Enter a new first name" */}
      </CardHeader>

      {/* Card content containing the first name input form */}
      <CardContent>
        <form onSubmit={handleFirstnameSubmit}>
          <div className="grid gap-4">
            <div className="grid gap-2">
              {/* Label for the first name input field */}
              <Label htmlFor="name">Etunimi</Label> {/* Label: "First Name" in Finnish */}
              {/* First name input field */}
              <Input
                id="name"
                type="text" // Correct type for the input field
                value={firstname} // Controlled input linked to firstname state
                required // Makes the field required
                onChange={(e) => setFirstname(e.target.value)} // Update state on input change
              />
            </div>
            {/* Submit button to update the first name */}
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

        {/* Display success message if first name update succeeds */}
        {successMessage && <div className="text-green-500">{successMessage}</div>}
      </CardContent>
    </div>
  );
}

export default ProfileCardFirstname; // Export the component for use in other parts of the application
