// Function to update the live preview
function updatePreview() {
  const htmlCode = document.getElementById("html").value;
  const cssCode = document.getElementById("css").value;
  const jsCode = document.getElementById("js").value;

  const previewFrame = document.getElementById("preview");
  const previewDocument =
    previewFrame.contentDocument || previewFrame.contentWindow.document;

  previewDocument.open();
  previewDocument.write(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>${cssCode}</style>
      </head>
      <body>
        ${htmlCode}
        <script>${jsCode}<\/script>
      </body>
      </html>
    `);
  previewDocument.close();
}

// Event listener for the Run button
document.getElementById("run-btn").addEventListener("click", updatePreview);

// Optional: Auto-update preview as you type
document.querySelectorAll(".code-editor textarea").forEach((textarea) => {
  textarea.addEventListener("input", updatePreview);
});
