// Import React's useState hook for managing component state
import { useState } from 'react';

// Import UI components for the card, button, input, and label
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// Import a service function to handle last name updates
import { updateLastname } from '@/services/profileChange';

function ProfileCardLastname() {
  // State to store the last name input value
  const [lastname, setLastname] = useState('');

  // State to store any error message if the last name update fails
  const [error, setError] = useState(null);

  // State to store a success message if the last name update succeeds
  const [successMessage, setSuccessMessage] = useState(null);

  // Event handler for form submission
  const handleLastnameSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior

    try {
      // Attempt to update the last name via the updateLastname service
      await updateLastname(lastname);

      // Reset the last name input field and set a success message
      setLastname('');
      setSuccessMessage('Last name updated successfully!');

      // Clear any existing error message
      setError(null);
    } catch (err) {
      // Handle errors by displaying an error message
      setError('Failed to update Last name.');
      setSuccessMessage(null);
    }
  };

  return (
    // Main card component containing the last name update form
    <Card className="mx-auto max-w-sm">
      {/* Card header with title and description */}
      <CardHeader>
        <CardTitle className="text-2xl">Vaihda sukunimi</CardTitle> {/* Title: "Change Last Name" in Finnish */}
        <CardDescription>Anna uusi sukunimi</CardDescription> {/* Description: "Enter a new last name" */}
      </CardHeader>

      {/* Card content containing the last name input form */}
      <CardContent>
        <form onSubmit={handleLastnameSubmit}>
          <div className="grid gap-4">
            <div className="grid gap-2">
              {/* Label for the last name input field */}
              <Label htmlFor="name">Sukunimi</Label> {/* Label: "Last Name" in Finnish */}
              {/* Last name input field */}
              <Input
                id="name"
                type="text" // Correct input type for text data
                value={lastname} // Controlled input linked to lastname state
                required // Makes the field required
                onChange={(e) => setLastname(e.target.value)} // Update state on input change
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
    </Card>
  );
}

export default ProfileCardLastname; // Export the component for use in other parts of the application
