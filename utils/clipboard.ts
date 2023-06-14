export async function copyToClipboard(text: string) {
  // Create a temporary textarea element
  const textarea = document.createElement('textarea');
  textarea.value = text;

  // Set the position of the textarea off-screen
  textarea.style.position = 'fixed';
  textarea.style.top = '0';
  textarea.style.left = '0';
  textarea.style.opacity = '0';

  // Append the textarea to the document
  document.body.appendChild(textarea);

  // Select the text inside the textarea
  textarea.select();
  textarea.setSelectionRange(0, textarea.value.length);

  // Copy the selected text to the clipboard
  await navigator.clipboard.writeText(text);

  // Clean up: remove the textarea from the document
  document.body.removeChild(textarea);
}
