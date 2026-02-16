/**
 * Location Validator Utility
 * Validates user location against a list of supported Indian cities/states
 */

// List of valid Indian cities and major locations
const validLocations = [
    // Metro Cities
    'Mumbai',
    'Delhi',
    'Bangalore',
    'Bengaluru',
    'Hyderabad',
    'Chennai',
    'Kolkata',

    // Major Cities
    'Pune',
    'Ahmedabad',
    'Jaipur',
    'Surat',
    'Lucknow',
    'Kanpur',
    'Nagpur',
    'Indore',
    'Thane',
    'Bhopal',
    'Visakhapatnam',
    'Patna',
    'Vadodara',
    'Ghaziabad',
    'Ludhiana',
    'Agra',
    'Nashik',
    'Faridabad',
    'Meerut',
    'Rajkot',
    'Varanasi',

    // State Names (for broader location)
    'Maharashtra',
    'Karnataka',
    'Tamil Nadu',
    'Telangana',
    'West Bengal',
    'Gujarat',
    'Rajasthan',
    'Uttar Pradesh',
    'Madhya Pradesh',
    'Bihar',
    'Punjab',
    'Haryana',
    'Kerala',
    'Odisha',
    'Jharkhand',
    'Assam',
    'Chhattisgarh',
    'Uttarakhand',
    'Goa',
    'Himachal Pradesh',
];

/**
 * Check if location is valid (case-insensitive)
 * @param {string} location - Location string to validate
 * @returns {boolean} - True if valid, false otherwise
 */
const isValidLocation = (location) => {
    if (!location || typeof location !== 'string') {
        return false;
    }

    const normalizedInput = location.trim().toLowerCase();

    return validLocations.some(
        (loc) => loc.toLowerCase() === normalizedInput
    );
};

/**
 * Normalize location string (capitalize properly)
 * @param {string} location - Location string
 * @returns {string} - Normalized location
 */
const normalizeLocation = (location) => {
    if (!location) return '';

    return location
        .trim()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
};

/**
 * Get list of all valid locations
 * @returns {Array<string>} - Array of valid locations
 */
const getValidLocations = () => {
    return [...validLocations];
};

module.exports = {
    isValidLocation,
    normalizeLocation,
    getValidLocations,
    validLocations, // Export for direct access if needed
};