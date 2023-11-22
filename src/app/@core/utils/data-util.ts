export function getRandomDate() {
    var startDate = new Date(2020, 0, 1);  // start date (January 1, 2020)
    var endDate = new Date();  // end date (current date)
    return new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()));
}

export function isImageFile(filename) {
    // List of valid image file extensions
    var extensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'];
    
    // Get the file extension
    var fileExtension = filename.split('.').pop().toLowerCase();
    
    // Check if the file extension is in the list of image file extensions
    return extensions.includes(fileExtension);
}