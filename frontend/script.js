document.addEventListener("DOMContentLoaded", function () {
  // Initialize AOS (Animate on Scroll)
  AOS.init({
    duration: 800,
    once: true,
    offset: 100,
  });

  // Initialize CodeMirror editors
  const htmlEditor = CodeMirror.fromTextArea(document.getElementById("html"), {
    mode: "htmlmixed",
    theme: "dracula",
    lineNumbers: true,
    autoCloseTags: true,
    autoCloseBrackets: true,
    indentUnit: 2,
    tabSize: 2,
    lineWrapping: true,
  });

  const cssEditor = CodeMirror.fromTextArea(document.getElementById("css"), {
    mode: "css",
    theme: "dracula",
    lineNumbers: true,
    autoCloseBrackets: true,
    indentUnit: 2,
    tabSize: 2,
    lineWrapping: true,
  });

  const jsEditor = CodeMirror.fromTextArea(document.getElementById("js"), {
    mode: "javascript",
    theme: "dracula",
    lineNumbers: true,
    autoCloseBrackets: true,
    indentUnit: 2,
    tabSize: 2,
    lineWrapping: true,
  });

  // Set default content for the editors
  htmlEditor.setValue(`<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>UI Compiler Example</title>
</head>
<body>
  <h1>Hello, World!</h1>
  <p>Start editing to see your changes.</p>
  <button id="demo-btn">Click Me</button>
</body>
</html>`);

  cssEditor.setValue(`body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  line-height: 1.6;
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
  color: #333;
}

h1 {
  color: #6200ea;
  border-bottom: 2px solid #eee;
  padding-bottom: 10px;
}

button {
  background-color: #6200ea;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #3700b3;
}`);

  jsEditor.setValue(`// JavaScript code goes here
document.getElementById('demo-btn').addEventListener('click', function() {
  alert('Button clicked!');
});`);

  // Update the preview
  function updatePreview() {
    const previewFrame = document.getElementById("preview");
    const preview =
      previewFrame.contentDocument || previewFrame.contentWindow.document;

    preview.open();
    preview.write(`
      ${htmlEditor.getValue()}
      <style>${cssEditor.getValue()}</style>
      <script>${jsEditor.getValue()}</script>
    `);
    preview.close();
  }

  // Tab Switching
  const tabButtons = document.querySelectorAll(".tab-link");
  const editors = {
    html: document.getElementById("html-editor"),
    css: document.getElementById("css-editor"),
    js: document.getElementById("js-editor"),
  };

  tabButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const tabName = this.getAttribute("data-tab");

      // Toggle active class for tabs
      tabButtons.forEach((btn) => btn.classList.remove("active"));
      this.classList.add("active");

      // Hide all editors and show the selected one
      for (const editorKey in editors) {
        if (editorKey === tabName) {
          editors[editorKey].classList.remove("hidden");
        } else {
          editors[editorKey].classList.add("hidden");
        }
      }

      // Refresh CodeMirror to fix any display issues after unhiding
      if (tabName === "html") htmlEditor.refresh();
      if (tabName === "css") cssEditor.refresh();
      if (tabName === "js") jsEditor.refresh();
    });
  });

  // Run button
  document.getElementById("run-btn").addEventListener("click", updatePreview);

  // Reset button
  document.getElementById("reset-btn").addEventListener("click", function () {
    const activeTab = document
      .querySelector(".tab-link.active")
      .getAttribute("data-tab");

    if (activeTab === "html") {
      htmlEditor.setValue(`<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>UI Compiler Example</title>
</head>
<body>
  <h1>Hello, World!</h1>
  <p>Start editing to see your changes.</p>
  <button id="demo-btn">Click Me</button>
  <button id="ai-btn">AI Suggestions</button>
</body>
</html>`);
    } else if (activeTab === "css") {
      cssEditor.setValue(`body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  line-height: 1.6;
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
  color: #333;
}

h1 {
  color: #6200ea;
  border-bottom: 2px solid #eee;
  padding-bottom: 10px;
}

button {
  background-color: #6200ea;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-right: 8px;
}

button:hover {
  background-color: #3700b3;
}

#ai-btn {
  background-color: #00c853;
}

#ai-btn:hover {
  background-color: #009624;
}`);
    } else if (activeTab === "js") {
      jsEditor.setValue(`// JavaScript code goes here
document.getElementById('demo-btn').addEventListener('click', function() {
  alert('Button clicked!');
});

document.getElementById('ai-btn').addEventListener('click', function() {
  showAISuggestions();
});

function showAISuggestions() {
  const suggestionDiv = document.createElement('div');
  suggestionDiv.style.position = 'fixed';
  suggestionDiv.style.top = '50%';
  suggestionDiv.style.left = '50%';
  suggestionDiv.style.transform = 'translate(-50%, -50%)';
  suggestionDiv.style.backgroundColor = 'white';
  suggestionDiv.style.padding = '20px';
  suggestionDiv.style.borderRadius = '8px';
  suggestionDiv.style.boxShadow = '0 0 10px rgba(0,0,0,0.2)';
  suggestionDiv.style.zIndex = '9999';
  suggestionDiv.style.maxWidth = '80%';
  suggestionDiv.style.maxHeight = '80%';
  suggestionDiv.style.overflow = 'auto';
  
  suggestionDiv.innerHTML = \`
    <h3>AI Suggestions</h3>
    <p>Here are some suggestions to improve your UI:</p>
    <ul>
      <li>Add more contrast to your headings</li>
      <li>Consider a responsive layout for mobile devices</li>
      <li>Add hover effects to interactive elements</li>
      <li>Include form validation for better user experience</li>
    </ul>
    <button id="close-suggestion">Close</button>
  \`;
  
  document.body.appendChild(suggestionDiv);
  
  document.getElementById('close-suggestion').addEventListener('click', function() {
    document.body.removeChild(suggestionDiv);
  });
}`);
    }
  });

  // Initial preview load
  updatePreview();

  // Mobile menu toggle
  const menuToggle = document.querySelector(".menu-toggle");
  if (menuToggle) {
    menuToggle.addEventListener("click", function () {
      const navLinks = document.querySelector(".nav-links");
      navLinks.classList.toggle("show");
    });
  }

  // Drag and Drop UI Builder functionality
  const toolboxItems = document.querySelectorAll(".toolbox-item");
  const canvas = document.querySelector(".canvas-content");

  // AI button functionality
  const aiButton = document.getElementById("ai-suggest-btn");
  if (aiButton) {
    aiButton.addEventListener("click", function () {
      generateAISuggestions();
    });
  }

  function generateAISuggestions() {
    // Simple AI suggestions based on current code
    let htmlCode = htmlEditor.getValue();
    let cssCode = cssEditor.getValue();
    let jsCode = jsEditor.getValue();

    let suggestions = [];

    // Very basic analysis
    if (!htmlCode.includes('<meta name="viewport"')) {
      suggestions.push(
        "Add a viewport meta tag for better mobile responsiveness"
      );
    }

    if (!cssCode.includes("@media")) {
      suggestions.push("Consider adding media queries for responsive design");
    }

    if (!jsCode.includes("addEventListener")) {
      suggestions.push("Add event listeners to make your UI more interactive");
    }

    // Display suggestions
    const suggestionModal = document.createElement("div");
    suggestionModal.className = "ai-suggestion-modal";
    suggestionModal.innerHTML = `
      <div class="ai-suggestion-content">
        <h3>AI Suggestions</h3>
        <ul>
          ${suggestions.map((suggestion) => `<li>${suggestion}</li>`).join("")}
        </ul>
        <button id="apply-suggestions">Apply Suggestions</button>
        <button id="close-suggestions">Close</button>
      </div>
    `;

    document.body.appendChild(suggestionModal);

    document
      .getElementById("close-suggestions")
      .addEventListener("click", function () {
        document.body.removeChild(suggestionModal);
      });

    document
      .getElementById("apply-suggestions")
      .addEventListener("click", function () {
        // Implementation for applying suggestions would go here
        document.body.removeChild(suggestionModal);
      });
  }

  // Initialize drag and drop functionality
  toolboxItems.forEach((item) => {
    item.addEventListener("dragstart", function (e) {
      e.dataTransfer.setData("text/plain", this.getAttribute("data-type"));
    });
  });

  canvas.addEventListener("dragover", function (e) {
    e.preventDefault();
  });

  canvas.addEventListener("drop", function (e) {
    e.preventDefault();
    const type = e.dataTransfer.getData("text/plain");
    const element = createUIElement(type);
    if (element) {
      this.appendChild(element);

      // Update HTML code to reflect the added element
      updateHTMLEditor();
    }
  });

  function createUIElement(type) {
    let element;

    switch (type) {
      case "button":
        element = document.createElement("button");
        element.textContent = "Button";
        element.className = "ui-element";
        break;
      case "text":
        element = document.createElement("input");
        element.type = "text";
        element.placeholder = "Text Field";
        element.className = "ui-element";
        break;
      case "image":
        element = document.createElement("div");
        element.className = "ui-element image-placeholder";
        element.textContent = "Image Placeholder";
        break;
      case "form":
        element = document.createElement("form");
        element.className = "ui-element form-element";
        element.innerHTML = `
          <input type="text" placeholder="Username">
          <input type="password" placeholder="Password">
          <button type="button">Submit</button>
        `;
        break;
      default:
        return null;
    }

    // Make element selectable
    element.addEventListener("click", function (e) {
      e.stopPropagation();

      // Deselect all elements
      document.querySelectorAll(".ui-element").forEach((el) => {
        el.classList.remove("selected");
      });

      // Select this element
      this.classList.add("selected");
    });

    return element;
  }

  // Apply styles to selected element
  const applyStylesBtn = document.getElementById("apply-styles");
  if (applyStylesBtn) {
    applyStylesBtn.addEventListener("click", function () {
      const selectedElement = document.querySelector(".ui-element.selected");
      if (selectedElement) {
        const backgroundColor = document.getElementById("color").value;
        const fontSize = document.getElementById("font-size").value + "px";
        const border = document.getElementById("border").value;

        selectedElement.style.backgroundColor = backgroundColor;
        selectedElement.style.fontSize = fontSize;
        selectedElement.style.border = border;

        // Update CSS editor
        updateCSSEditor();
      }
    });
  }

  function updateHTMLEditor() {
    // Get the canvas HTML and update the HTML editor
    const canvasHTML = canvas.innerHTML;
    const currentHTML = htmlEditor.getValue();

    // Simple replacement - in a real app, you'd need a more sophisticated approach
    const bodyStartIndex = currentHTML.indexOf("<body>") + 6;
    const bodyEndIndex = currentHTML.indexOf("</body>");

    const newHTML =
      currentHTML.substring(0, bodyStartIndex) +
      "\n  " +
      canvasHTML +
      "\n" +
      currentHTML.substring(bodyEndIndex);

    htmlEditor.setValue(newHTML);
  }

  function updateCSSEditor() {
    // Get all styled elements and generate CSS
    const styledElements = document.querySelectorAll(".ui-element[style]");
    let cssRules = "";

    styledElements.forEach((element, index) => {
      const className = `custom-element-${index + 1}`;
      element.classList.add(className);

      cssRules += `.${className} {\n`;
      const style = element.style;
      for (let i = 0; i < style.length; i++) {
        const property = style[i];
        cssRules += `  ${property}: ${style.getPropertyValue(property)};\n`;
      }
      cssRules += "}\n\n";
    });

    // Add the CSS to the editor
    const currentCSS = cssEditor.getValue();
    cssEditor.setValue(currentCSS + "\n\n/* Generated Styles */\n" + cssRules);
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const navbar = document.querySelector(".navbar");

  window.addEventListener("scroll", function () {
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });
});
