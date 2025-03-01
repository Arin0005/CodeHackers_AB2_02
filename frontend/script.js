// Initialize CodeMirror Editors
document.addEventListener("DOMContentLoaded", () => {
  // CodeMirror Initialization
  const htmlEditor = CodeMirror.fromTextArea(document.getElementById("html"), {
    mode: "htmlmixed",
    lineNumbers: true,
    theme: "dracula",
  });

  const cssEditor = CodeMirror.fromTextArea(document.getElementById("css"), {
    mode: "css",
    lineNumbers: true,
    theme: "dracula",
  });

  const jsEditor = CodeMirror.fromTextArea(document.getElementById("js"), {
    mode: "javascript",
    lineNumbers: true,
    theme: "dracula",
  });

  // Function to update the live preview
  function updatePreview() {
    try {
      const htmlCode = htmlEditor.getValue();
      const cssCode = cssEditor.getValue();
      const jsCode = jsEditor.getValue();

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
    } catch (error) {
      console.error("Error updating preview:", error);
    }
  }

  // Event listener for the Run button
  document.getElementById("run-btn").addEventListener("click", updatePreview);

  // Event listener for the Reset button
  document.getElementById("reset-btn").addEventListener("click", () => {
    htmlEditor.setValue("");
    cssEditor.setValue("");
    jsEditor.setValue("");
    updatePreview();
  });

  // Auto-update preview with debounce
  let timeout;
  [htmlEditor, cssEditor, jsEditor].forEach((editor) => {
    editor.on("change", () => {
      clearTimeout(timeout);
      timeout = setTimeout(updatePreview, 500); // Update after 500ms of inactivity
    });
  });

  // Tab Switching Logic
  const tabs = document.querySelectorAll(".tab-link");
  const editors = {
    html: document.getElementById("html-editor"),
    css: document.getElementById("css-editor"),
    js: document.getElementById("js-editor"),
  };

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      // Remove active class from all tabs
      tabs.forEach((t) => t.classList.remove("active"));
      // Hide all editors
      Object.values(editors).forEach((editor) =>
        editor.classList.add("hidden")
      );
      // Show the selected editor
      const tabId = tab.getAttribute("data-tab");
      editors[tabId].classList.remove("hidden");
      // Add active class to the clicked tab
      tab.classList.add("active");
    });
  });

  // Drag-and-Drop UI Builder Logic
  const canvas = document.querySelector(".canvas-content");
  const toolboxItems = document.querySelectorAll(".toolbox-item");
  const stylingForm = document.querySelector(".styling-form");

  let selectedElement = null;

  // Add drag-and-drop functionality
  toolboxItems.forEach((item) => {
    item.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("text/plain", e.target.dataset.type);
    });
  });

  canvas.addEventListener("dragover", (e) => {
    e.preventDefault();
  });

  canvas.addEventListener("drop", (e) => {
    e.preventDefault();
    const type = e.dataTransfer.getData("text/plain");
    const newElement = document.createElement("div");
    newElement.classList.add("ui-element");
    newElement.setAttribute("draggable", true);

    switch (type) {
      case "button":
        newElement.innerHTML = `<button>Button</button>`;
        break;
      case "text":
        newElement.innerHTML = `<input type="text" placeholder="Enter text..." />`;
        break;
      case "image":
        newElement.innerHTML = `<img src="https://via.placeholder.com/150" alt="Image" />`;
        break;
      case "form":
        newElement.innerHTML = `
          <form>
            <input type="text" placeholder="Name" />
            <input type="email" placeholder="Email" />
            <button type="submit">Submit</button>
          </form>
        `;
        break;
    }

    canvas.appendChild(newElement);
    addDragAndResize(newElement);
  });

  // Add drag-and-resize functionality to elements
  function addDragAndResize(element) {
    let isDragging = false;
    let startX, startY;

    element.addEventListener("mousedown", (e) => {
      isDragging = true;
      startX = e.clientX - element.offsetLeft;
      startY = e.clientY - element.offsetTop;
      selectedElement = element;
      stylingForm.style.display = "block";
    });

    document.addEventListener("mousemove", (e) => {
      if (isDragging) {
        element.style.left = `${e.clientX - startX}px`;
        element.style.top = `${e.clientY - startY}px`;
      }
    });

    document.addEventListener("mouseup", () => {
      isDragging = false;
    });
  }

  // Apply styling to selected element
  document.getElementById("apply-styles").addEventListener("click", () => {
    if (selectedElement) {
      const color = document.getElementById("color").value;
      const fontSize = document.getElementById("font-size").value + "px";
      const border = document.getElementById("border").value;

      selectedElement.style.backgroundColor = color;
      selectedElement.style.fontSize = fontSize;
      selectedElement.style.border = border;
    }
  });
});
