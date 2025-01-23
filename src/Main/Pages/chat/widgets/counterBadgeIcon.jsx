export const createFaviconWithBadge = (count) => {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  // Favicon size
  const size = 40; // Adjust this size if necessary
  canvas.width = size;
  canvas.height = size;

  // Draw the original favicon if count is 0
  if (count === 0) {
    const favicon = new Image();
    favicon.src = './logo.png'; // Path to your default favicon
    favicon.onload = () => {
      // Draw the original favicon on the canvas
      context.drawImage(favicon, 0, 0, size, size);

      // Update the favicon in the document head
      const newFavicon = canvas.toDataURL('image/png');
      const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
      link.type = 'image/png';
      link.rel = 'icon';
      link.href = newFavicon;
      document.head.appendChild(link);
    };
  } else if (count > 0) {
    // Only show the badge when count is greater than 0
    const badgeRadius = 18; // Increased radius for the badge
 // Adjusted offset for badge positioning

    // Draw the badge (red circle)
    context.fillStyle = '#FF0000'; // Badge color (red)
    context.beginPath();
    context.arc(size / 2, size / 2, badgeRadius, 0, Math.PI * 2, true); // Center the badge in the middle of the canvas
    context.fill();

    // Draw the count number inside the badge
    context.fillStyle = '#FFFFFF'; // Text color
    context.font = 'bold 24px Arial'; // Font size for the number
    context.textAlign = 'center';
    context.textBaseline = 'middle'; // Vertically center the text
    context.fillText(count, size / 2, size / 2); // Draw the count in the center of the badge

    // Update the favicon with just the badge (no image)
    const newFavicon = canvas.toDataURL('image/png');
    const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
    link.type = 'image/png';
    link.rel = 'icon';
    link.href = newFavicon;
    document.head.appendChild(link);
  }
};

  