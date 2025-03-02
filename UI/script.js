// Main application JavaScript
document.addEventListener("DOMContentLoaded", function () {
  // Elements
  const canvas = document.getElementById("canvas");
  const componentItems = document.querySelectorAll(".component-item");
  const deviceButtons = document.querySelectorAll(".device-btn");
  const propertiesContent = document.getElementById("properties-content");
  const aiSuggestionsBtn = document.getElementById("ai-suggestions-btn");
  const aiSuggestionsModal = document.getElementById("ai-suggestions-modal");
  const exportBtn = document.getElementById("export-btn");
  const exportModal = document.getElementById("export-modal");
  const saveBtn = document.getElementById("save-btn");
  const loadBtn = document.getElementById("load-btn");

  // Close buttons for modals
  const closeButtons = document.querySelectorAll(".close");
  const closeAiBtn = document.getElementById("close-suggestions");
  const closeExportBtn = document.getElementById("close-export");

  // Tab buttons
  const tabButtons = document.querySelectorAll(".tab-btn");

  // Apply suggestions button
  const applySuggestionsBtn = document.getElementById("apply-suggestions");

  // Export action buttons
  const copyCodeBtn = document.getElementById("copy-code");
  const downloadCodeBtn = document.getElementById("download-code");

  // State variables
  let selectedElement = null;
  let nextElementId = 1;

  // Component templates
  const componentTemplates = {
    button: {
      html: '<button class="component-button">Button</button>',
      defaultProperties: {
        text: "Button",
        backgroundColor: "#3498db",
        textColor: "#ffffff",
        borderRadius: "4",
        padding: "0.5rem 1rem",
        fontSize: "16",
      },
    },
    text: {
      html: '<div class="component-text">Text content</div>',
      defaultProperties: {
        text: "Text content",
        color: "#333333",
        fontSize: "16",
        fontWeight: "normal",
        textAlign: "left",
      },
    },
    input: {
      html: '<input type="text" class="component-input" placeholder="Input field">',
      defaultProperties: {
        placeholder: "Input field",
        width: "100%",
        padding: "0.5rem",
        borderColor: "#dddddd",
        borderRadius: "4",
      },
    },
    image: {
      html: '<div class="component-image"><i class="fas fa-image"></i> Image Placeholder</div>',
      defaultProperties: {
        width: "300",
        height: "200",
        alt: "Image",
      },
    },
    navbar: {
      html: `
              <div class="component-navbar">
                  <div class="navbar-brand">Brand</div>
                  <div class="navbar-links">
                      <span>Home</span>
                      <span>About</span>
                      <span>Services</span>
                      <span>Contact</span>
                  </div>
              </div>
          `,
      defaultProperties: {
        backgroundColor: "#2c3e50",
        textColor: "#ffffff",
        brandText: "Brand",
        links: "Home,About,Services,Contact",
      },
    },
    form: {
      html: `
              <div class="component-form">
                  <div style="margin-bottom:1rem;">
                      <label style="display:block;margin-bottom:0.5rem;">Name</label>
                      <input type="text" class="component-input" placeholder="Enter your name">
                  </div>
                  <div style="margin-bottom:1rem;">
                      <label style="display:block;margin-bottom:0.5rem;">Email</label>
                      <input type="email" class="component-input" placeholder="Enter your email">
                  </div>
                  <div>
                      <button class="component-button">Submit</button>
                  </div>
              </div>
          `,
      defaultProperties: {
        backgroundColor: "#f9f9f9",
        borderColor: "#dddddd",
        buttonText: "Submit",
        buttonColor: "#3498db",
      },
    },
    card: {
      html: `
              <div class="component-card">
                  <div class="component-card-header">
                      <h3>Card Title</h3>
                  </div>
                  <div class="component-card-body">
                      <p>This is some sample content for the card. You can edit this text.</p>
                  </div>
              </div>
          `,
      defaultProperties: {
        title: "Card Title",
        content:
          "This is some sample content for the card. You can edit this text.",
        headerBgColor: "#f5f5f5",
        bodyBgColor: "#ffffff",
        borderColor: "#dddddd",
      },
    },
    modal: {
      html: `
              <div class="component-modal">
                  <div class="component-modal-header">
                      <h3>Modal Title</h3>
                      <span style="cursor:pointer;">×</span>
                  </div>
                  <div class="component-modal-body">
                      <p>This is the modal content. You can edit this text.</p>
                  </div>
                  <div class="component-modal-footer">
                      <button class="component-button" style="background-color:#6c757d;">Cancel</button>
                      <button class="component-button">Confirm</button>
                  </div>
              </div>
          `,
      defaultProperties: {
        title: "Modal Title",
        content: "This is the modal content. You can edit this text.",
        cancelButtonText: "Cancel",
        confirmButtonText: "Confirm",
        width: "500",
      },
    },
  };

  // Initialize drag and drop functionality
  initDragAndDrop();

  // Initialize device view switcher
  initDeviceButtons();

  // Initialize modal functionality
  initModals();

  // Initialize tab switching
  initTabs();

  // Initialize AI suggestions (simulated)
  initAiSuggestions();

  // Initialize export functionality
  initExportFunctionality();

  // Initialize save/load functionality
  initSaveLoad();

  // Drag and Drop implementation
  function initDragAndDrop() {
    // Make components draggable
    componentItems.forEach((item) => {
      item.addEventListener("dragstart", function (e) {
        e.dataTransfer.setData(
          "text/plain",
          this.getAttribute("data-component")
        );
      });
    });

    // Make canvas accept drops
    canvas.addEventListener("dragover", function (e) {
      e.preventDefault();
    });

    canvas.addEventListener("drop", function (e) {
      e.preventDefault();
      const componentType = e.dataTransfer.getData("text/plain");

      if (componentType) {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        addComponentToCanvas(componentType, x, y);
      }
    });

    // Handle canvas click for selection
    canvas.addEventListener("click", function (e) {
      const target = e.target.closest(".canvas-element");

      if (target) {
        selectElement(target);
      } else {
        deselectElements();
      }
    });
  }

  // Add component to canvas
  function addComponentToCanvas(componentType, x, y) {
    if (!componentTemplates[componentType]) return;

    const elementId = `element-${nextElementId++}`;
    const element = document.createElement("div");
    element.className = "canvas-element";
    element.id = elementId;
    element.setAttribute("data-component-type", componentType);
    element.innerHTML = `
          <div class="element-actions">
              <button class="element-action-btn delete-btn" title="Delete">
                  <i class="fas fa-trash"></i>
              </button>
              <button class="element-action-btn duplicate-btn" title="Duplicate">
                  <i class="fas fa-copy"></i>
              </button>
          </div>
          ${componentTemplates[componentType].html}
      `;

    // Position the element at drop position
    element.style.position = "absolute";
    element.style.left = `${x}px`;
    element.style.top = `${y}px`;

    // Store default properties
    element.dataset.properties = JSON.stringify(
      componentTemplates[componentType].defaultProperties
    );

    canvas.appendChild(element);

    // Make element draggable within canvas
    makeElementDraggable(element);

    // Add event listeners for actions
    setupElementActions(element);

    // Select the new element
    selectElement(element);
  }

  // Make elements draggable within canvas
  function makeElementDraggable(element) {
    let pos1 = 0,
      pos2 = 0,
      pos3 = 0,
      pos4 = 0;

    element.addEventListener("mousedown", dragMouseDown);

    function dragMouseDown(e) {
      // Don't start dragging if clicking on action buttons
      if (e.target.closest(".element-actions")) {
        return;
      }

      e.preventDefault();
      // Get the mouse cursor position at startup
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.addEventListener("mouseup", closeDragElement);
      document.addEventListener("mousemove", elementDrag);

      // Select the element
      selectElement(element);
    }

    function elementDrag(e) {
      e.preventDefault();
      // Calculate the new cursor position
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;

      // Set the element's new position
      element.style.top = element.offsetTop - pos2 + "px";
      element.style.left = element.offsetLeft - pos1 + "px";
    }

    function closeDragElement() {
      // Stop moving when mouse button is released
      document.removeEventListener("mouseup", closeDragElement);
      document.removeEventListener("mousemove", elementDrag);
    }
  }

  // Set up action buttons for elements
  function setupElementActions(element) {
    const deleteBtn = element.querySelector(".delete-btn");
    const duplicateBtn = element.querySelector(".duplicate-btn");

    deleteBtn.addEventListener("click", function () {
      element.remove();
      // Clear properties panel if the selected element was deleted
      if (selectedElement === element) {
        selectedElement = null;
        showEmptyProperties();
      }
    });

    duplicateBtn.addEventListener("click", function () {
      const clone = element.cloneNode(true);
      const elementId = `element-${nextElementId++}`;
      clone.id = elementId;

      // Offset the position slightly
      const left = parseInt(element.style.left) + 20;
      const top = parseInt(element.style.top) + 20;
      clone.style.left = `${left}px`;
      clone.style.top = `${top}px`;

      canvas.appendChild(clone);

      // Make the clone draggable
      makeElementDraggable(clone);

      // Set up actions for the clone
      setupElementActions(clone);

      // Select the cloned element
      selectElement(clone);
    });
  }

  // Element selection
  function selectElement(element) {
    // Deselect previous element
    deselectElements();

    // Select new element
    element.classList.add("selected");
    selectedElement = element;

    // Show properties for the selected element
    showElementProperties(element);
  }

  function deselectElements() {
    const selected = document.querySelectorAll(".canvas-element.selected");
    selected.forEach((el) => {
      el.classList.remove("selected");
    });
    selectedElement = null;
  }

  // Show element properties in the properties panel
  function showElementProperties(element) {
    const componentType = element.getAttribute("data-component-type");
    const properties = JSON.parse(element.dataset.properties || "{}");

    let html = `<h3>${
      componentType.charAt(0).toUpperCase() + componentType.slice(1)
    } Properties</h3>`;

    // Common properties
    html += `
            <div class="property-group">
                <h3>Position & Size</h3>
                <div class="property-row">
                    <div class="property-label">X Position</div>
                    <div class="property-value">
                        <input type="number" id="prop-x" value="${parseInt(
                          element.style.left
                        )}">
                    </div>
                </div>
                <div class="property-row">
                    <div class="property-label">Y Position</div>
                    <div class="property-value">
                        <input type="number" id="prop-y" value="${parseInt(
                          element.style.top
                        )}">
                    </div>
                </div>
            </div>
        `;

    // Component-specific properties
    html += '<div class="property-group">';
    html += "<h3>Component Properties</h3>";

    for (const [key, value] of Object.entries(properties)) {
      if (
        key === "backgroundColor" ||
        key === "textColor" ||
        key === "borderColor" ||
        key === "headerBgColor" ||
        key === "bodyBgColor"
      ) {
        // Color picker for color properties
        html += `
                    <div class="property-row">
                        <div class="property-label">${formatPropertyLabel(
                          key
                        )}</div>
                        <div class="property-value">
                            <input type="color" id="prop-${key}" value="${value}">
                        </div>
                    </div>
                `;
      } else if (key === "text" || key === "content") {
        // Textarea for content
        html += `
                    <div class="property-row">
                        <div class="property-label">${formatPropertyLabel(
                          key
                        )}</div>
                        <div class="property-value">
                            <textarea id="prop-${key}" rows="3">${value}</textarea>
                        </div>
                    </div>
                `;
      } else {
        // Default text input
        html += `
                    <div class="property-row">
                        <div class="property-label">${formatPropertyLabel(
                          key
                        )}</div>
                        <div class="property-value">
                            <input type="text" id="prop-${key}" value="${value}">
                        </div>
                    </div>
                `;
      }
    }

    html += "</div>";

    propertiesContent.innerHTML = html;

    // Add event listeners to property inputs
    addPropertyEventListeners(element);
  }

  // Format property label (convert camelCase to Title Case with spaces)
  function formatPropertyLabel(property) {
    return property.replace(/([A-Z])/g, " $1").replace(/^./, function (str) {
      return str.toUpperCase();
    });
  }

  // Add event listeners to property inputs
  function addPropertyEventListeners(element) {
    // Position listeners
    const xPosInput = document.getElementById("prop-x");
    const yPosInput = document.getElementById("prop-y");

    if (xPosInput) {
      xPosInput.addEventListener("change", function () {
        element.style.left = `${this.value}px`;
      });
    }

    if (yPosInput) {
      yPosInput.addEventListener("change", function () {
        element.style.top = `${this.value}px`;
      });
    }

    // Component-specific property listeners
    const properties = JSON.parse(element.dataset.properties || "{}");
    const componentType = element.getAttribute("data-component-type");

    for (const key of Object.keys(properties)) {
      const input = document.getElementById(`prop-${key}`);
      if (input) {
        input.addEventListener("change", function () {
          updateElementProperty(element, key, this.value);
        });
      }
    }
  }

  // Update element property
  function updateElementProperty(element, property, value) {
    const properties = JSON.parse(element.dataset.properties || "{}");
    properties[property] = value;
    element.dataset.properties = JSON.stringify(properties);

    // Update the visual component based on property
    const componentType = element.getAttribute("data-component-type");
    const componentElement =
      element.querySelector(`.component-${componentType}`) ||
      element.querySelector("input") ||
      element;

    switch (property) {
      case "text":
        if (componentType === "button") {
          componentElement.textContent = value;
        } else if (componentType === "text") {
          componentElement.textContent = value;
        }
        break;
      case "backgroundColor":
        componentElement.style.backgroundColor = value;
        break;
      case "textColor":
      case "color":
        componentElement.style.color = value;
        break;
      case "borderRadius":
        componentElement.style.borderRadius = `${value}px`;
        break;
      case "padding":
        componentElement.style.padding = value;
        break;
      case "fontSize":
        componentElement.style.fontSize = `${value}px`;
        break;
      case "fontWeight":
        componentElement.style.fontWeight = value;
        break;
      case "textAlign":
        componentElement.style.textAlign = value;
        break;
      case "width":
        if (value.includes("%")) {
          componentElement.style.width = value;
        } else {
          componentElement.style.width = `${value}px`;
        }
        break;
      case "height":
        componentElement.style.height = `${value}px`;
        break;
      case "placeholder":
        componentElement.placeholder = value;
        break;
      case "borderColor":
        componentElement.style.borderColor = value;
        break;
      case "title":
        const titleElement = element.querySelector("h3");
        if (titleElement) {
          titleElement.textContent = value;
        }
        break;
      case "content":
        const contentElement = element.querySelector("p");
        if (contentElement) {
          contentElement.textContent = value;
        }
        break;
    }
  }

  // Empty properties message
  function showEmptyProperties() {
    propertiesContent.innerHTML =
      '<p class="empty-message">Select an element to edit its properties</p>';
  }

  // Device view switcher
  function initDeviceButtons() {
    deviceButtons.forEach((btn) => {
      btn.addEventListener("click", function () {
        // Remove active class from all buttons
        deviceButtons.forEach((b) => b.classList.remove("active"));

        // Add active class to clicked button
        this.classList.add("active");

        // Update canvas view
        const device = this.getAttribute("data-device");
        canvas.className = `canvas ${device}-view`;
      });
    });
  }

  // Modal functionality
  function initModals() {
    // Open AI suggestions modal
    aiSuggestionsBtn.addEventListener("click", function () {
      aiSuggestionsModal.style.display = "block";
      // Load suggestions when modal is opened
      loadAiSuggestions();
    });

    // Open export modal
    exportBtn.addEventListener("click", function () {
      exportModal.style.display = "block";
      generateExportCode();
    });

    // Close modal with X button
    closeButtons.forEach((btn) => {
      btn.addEventListener("click", function () {
        const modal = this.closest(".modal");
        modal.style.display = "none";
      });
    });

    // Close AI suggestions modal with button
    closeAiBtn.addEventListener("click", function () {
      aiSuggestionsModal.style.display = "none";
    });

    // Close export modal with button
    closeExportBtn.addEventListener("click", function () {
      exportModal.style.display = "none";
    });

    // Close modals when clicking outside
    window.addEventListener("click", function (e) {
      if (e.target === aiSuggestionsModal) {
        aiSuggestionsModal.style.display = "none";
      } else if (e.target === exportModal) {
        exportModal.style.display = "none";
      }
    });
  }

  // Tab switching functionality
  function initTabs() {
    tabButtons.forEach((btn) => {
      btn.addEventListener("click", function () {
        const tabType = this.closest(".suggestion-tabs, .code-tabs");
        const tabName = this.getAttribute("data-tab");

        // Get all tab buttons in this tab group
        const buttons = tabType.querySelectorAll(".tab-btn");

        // Remove active class from all buttons in this group
        buttons.forEach((b) => b.classList.remove("active"));

        // Add active class to clicked button
        this.classList.add("active");

        // Hide all tab panes
        const tabContainer = tabType.nextElementSibling;
        const tabPanes = tabContainer.querySelectorAll(".tab-pane");
        tabPanes.forEach((pane) => pane.classList.remove("active"));

        // Show selected tab pane
        const activePane = document.getElementById(`${tabName}-tab`);
        if (activePane) {
          activePane.classList.add("active");
        }
      });
    });
  }

  // AI Suggestions functionality (simulated)
  function initAiSuggestions() {
    applySuggestionsBtn.addEventListener("click", function () {
      // Simulate applying AI suggestions
      const checkedSuggestions = document.querySelectorAll(
        ".suggestion-checkbox:checked"
      );

      if (checkedSuggestions.length > 0) {
        alert("Selected suggestions have been applied to your design!");
        aiSuggestionsModal.style.display = "none";
      } else {
        alert("No suggestions were selected.");
      }
    });
  }

  // Load AI suggestions (simulated)
  function loadAiSuggestions() {
    // Sample suggestions for different categories
    const layoutSuggestions = document.getElementById("layout-suggestions");
    const colorSuggestions = document.getElementById("color-suggestions");
    const accessibilitySuggestions = document.getElementById(
      "accessibility-suggestions"
    );
    const responsiveSuggestions = document.getElementById(
      "responsive-suggestions"
    );

    // Layout suggestions
    layoutSuggestions.innerHTML = `
            <div class="suggestion-item">
                <input type="checkbox" class="suggestion-checkbox" id="layout-1">
                <div class="suggestion-content">
                    <p>Improve spacing between components for better visual hierarchy.</p>
                    <div class="suggestion-preview">Adds 1.5rem margins between sections</div>
                </div>
            </div>
            <div class="suggestion-item">
                <input type="checkbox" class="suggestion-checkbox" id="layout-2">
                <div class="suggestion-content">
                    <p>Align form elements for better readability.</p>
                    <div class="suggestion-preview">Standardizes label and input alignment</div>
                </div>
            </div>
            <div class="suggestion-item">
                <input type="checkbox" class="suggestion-checkbox" id="layout-3">
                <div class="suggestion-content">
                    <p>Adjust navigation bar layout for better balance.</p>
                    <div class="suggestion-preview">Distributes links evenly across navbar</div>
                </div>
            </div>
        `;

    // Color suggestions
    colorSuggestions.innerHTML = `
            <div class="suggestion-item">
                <input type="checkbox" class="suggestion-checkbox" id="color-1">
                <div class="suggestion-content">
                    <p>Update color scheme for better contrast and visual appeal.</p>
                    <div class="suggestion-preview" style="display:flex;gap:0.5rem;">
                        <span style="display:inline-block;width:20px;height:20px;background:#3498db;"></span>
                        <span style="display:inline-block;width:20px;height:20px;background:#2c3e50;"></span>
                        <span style="display:inline-block;width:20px;height:20px;background:#ecf0f1;"></span>
                    </div>
                </div>
            </div>
            <div class="suggestion-item">
                <input type="checkbox" class="suggestion-checkbox" id="color-2">
                <div class="suggestion-content">
                    <p>Enhance button visibility with color adjustment.</p>
                    <div class="suggestion-preview" style="display:flex;gap:0.5rem;">
                        <span style="display:inline-block;width:20px;height:20px;background:#e74c3c;"></span>
                        <span style="display:inline-block;width:20px;height:20px;background:#27ae60;"></span>
                    </div>
                </div>
            </div>
        `;

    // Accessibility suggestions
    accessibilitySuggestions.innerHTML = `
            <div class="suggestion-item">
                <input type="checkbox" class="suggestion-checkbox" id="access-1">
                <div class="suggestion-content">
                    <p>Increase contrast for better readability.</p>
                    <div class="suggestion-preview">Adjusts text/background contrast ratio to 4.5:1</div>
                </div>
            </div>
            <div class="suggestion-item">
                <input type="checkbox" class="suggestion-checkbox" id="access-2">
                <div class="suggestion-content">
                    <p>Add more descriptive button labels.</p>
                    <div class="suggestion-preview">Changes "Submit" to "Submit Form"</div>
                </div>
            </div>
            <div class="suggestion-item">
                <input type="checkbox" class="suggestion-checkbox" id="access-3">
                <div class="suggestion-content">
                    <p>Increase font size for better readability.</p>
                    <div class="suggestion-preview">Increases base font size to 16px</div>
                </div>
            </div>
        `;

    // Responsive suggestions
    responsiveSuggestions.innerHTML = `
            <div class="suggestion-item">
                <input type="checkbox" class="suggestion-checkbox" id="resp-1">
                <div class="suggestion-content">
                    <p>Optimize layout for mobile view.</p>
                    <div class="suggestion-preview">Stacks horizontal elements vertically</div>
                </div>
            </div>
            <div class="suggestion-item">
                <input type="checkbox" class="suggestion-checkbox" id="resp-2">
                <div class="suggestion-content">
                    <p>Adjust button sizes for touch targets.</p>
                    <div class="suggestion-preview">Increases button size to min 44px height</div>
                </div>
            </div>
            <div class="suggestion-item">
                <input type="checkbox" class="suggestion-checkbox" id="resp-3">
                <div class="suggestion-content">
                    <p>Make navbar collapsible on small screens.</p>
                    <div class="suggestion-preview">Adds hamburger menu for mobile view</div>
                </div>
            </div>
        `;
  }

  // Export functionality
  function initExportFunctionality() {
    copyCodeBtn.addEventListener("click", function () {
      const activeTab = document
        .querySelector(".code-tabs .tab-btn.active")
        .getAttribute("data-tab");
      const codeElement = document.getElementById(`${activeTab}-code`);

      // Copy to clipboard
      codeElement.select();
      document.execCommand("copy");

      alert("Code copied to clipboard!");
    });

    downloadCodeBtn.addEventListener("click", function () {
      alert("Files have been prepared for download! (Simulation)");
    });
  }

  // Generate export code
  function generateExportCode() {
    const htmlCode = document.getElementById("html-code");
    const cssCode = document.getElementById("css-code");

    // Generate HTML from canvas elements
    let generatedHtml =
      '<!DOCTYPE html>\n<html lang="en">\n<head>\n    <meta charset="UTF-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n    <title>Generated UI</title>\n    <link rel="stylesheet" href="styles.css">\n</head>\n<body>\n';

    // Get all elements from canvas
    const canvasElements = canvas.querySelectorAll(".canvas-element");
    generatedHtml += '    <div class="container">\n';

    canvasElements.forEach((element) => {
      const componentType = element.getAttribute("data-component-type");
      const componentElement =
        element.querySelector(`.component-${componentType}`) ||
        element.querySelector("input");
      const properties = JSON.parse(element.dataset.properties || "{}");

      if (componentElement) {
        // Create a clean clone without action buttons
        const clone = componentElement.cloneNode(true);

        // Add class based on component type
        clone.classList.add(`component-${componentType}`);

        // Add unique ID for the component
        clone.id = `generated-${componentType}-${element.id.split("-")[1]}`;

        generatedHtml += `        ${clone.outerHTML}\n`;
      }
    });

    generatedHtml += "    </div>\n</body>\n</html>";

    // Generate basic CSS
    let generatedCss = "/* Generated CSS */\n\n";
    generatedCss +=
      "* {\n    box-sizing: border-box;\n    margin: 0;\n    padding: 0;\n}\n\n";
    generatedCss +=
      "body {\n    font-family: Arial, sans-serif;\n    line-height: 1.6;\n    color: #333;\n    background-color: #f5f5f5;\n}\n\n";
    generatedCss +=
      ".container {\n    max-width: 1200px;\n    margin: 0 auto;\n    padding: 2rem;\n}\n\n";

    // Add component styles
    generatedCss += "/* Component Styles */\n";
    canvasElements.forEach((element) => {
      const componentType = element.getAttribute("data-component-type");
      const properties = JSON.parse(element.dataset.properties || "{}");
      const elementId = `generated-${componentType}-${
        element.id.split("-")[1]
      }`;

      generatedCss += `#${elementId} {\n`;

      // Add positioning
      generatedCss += `    position: relative;\n`;

      // Add properties based on component type
      for (const [key, value] of Object.entries(properties)) {
        if (
          key === "text" ||
          key === "content" ||
          key === "placeholder" ||
          key === "links" ||
          key === "brandText"
        ) {
          // Skip content properties
          continue;
        }

        let cssProperty = key.replace(/([A-Z])/g, "-$1").toLowerCase();
        let cssValue = value;

        // Handle special cases
        if (key === "fontSize" || key === "borderRadius") {
          cssValue = `${value}px`;
        } else if (key === "width" || key === "height") {
          if (!value.includes("%")) {
            cssValue = `${value}px`;
          }
        }

        generatedCss += `    ${cssProperty}: ${cssValue};\n`;
      }

      generatedCss += "}\n\n";
    });

    // Set the code in textareas
    htmlCode.value = generatedHtml;
    cssCode.value = generatedCss;
  }

  // Save/Load functionality (using localStorage for simulation)
  function initSaveLoad() {
    saveBtn.addEventListener("click", function () {
      const canvasElements = canvas.querySelectorAll(".canvas-element");
      let savedElements = [];

      canvasElements.forEach((element) => {
        savedElements.push({
          id: element.id,
          type: element.getAttribute("data-component-type"),
          left: element.style.left,
          top: element.style.top,
          properties: JSON.parse(element.dataset.properties || "{}"),
        });
      });

      // Save to localStorage
      localStorage.setItem("uiDesignerSave", JSON.stringify(savedElements));
      alert("Project saved successfully!");
    });

    loadBtn.addEventListener("click", function () {
      const savedData = localStorage.getItem("uiDesignerSave");

      if (savedData) {
        try {
          const elements = JSON.parse(savedData);

          // Clear canvas
          canvas.innerHTML = "";

          // Load saved elements
          elements.forEach((el) => {
            if (!componentTemplates[el.type]) return;

            const element = document.createElement("div");
            element.className = "canvas-element";
            element.id = el.id;
            element.setAttribute("data-component-type", el.type);
            element.innerHTML = `
                            <div class="element-actions">
                                <button class="element-action-btn delete-btn" title="Delete">
                                    <i class="fas fa-trash"></i>
                                </button>
                                <button class="element-action-btn duplicate-btn" title="Duplicate">
                                    <i class="fas fa-copy"></i>
                                </button>
                            </div>
                            ${componentTemplates[el.type].html}
                        `;

            // Set position
            element.style.position = "absolute";
            element.style.left = el.left;
            element.style.top = el.top;

            // Set properties
            element.dataset.properties = JSON.stringify(el.properties);

            canvas.appendChild(element);

            // Apply visual properties
            for (const [key, value] of Object.entries(el.properties)) {
              updateElementProperty(element, key, value);
            }

            // Make element draggable
            makeElementDraggable(element);

            // Add event listeners for actions
            setupElementActions(element);
          });

          // Update next element ID
          const ids = elements.map((el) => parseInt(el.id.split("-")[1]));
          nextElementId = Math.max(...ids, 0) + 1;

          alert("Project loaded successfully!");
        } catch (error) {
          console.error(error);
          alert("Error loading project!");
        }
      } else {
        alert("No saved project found!");
      }
    });
  }
});
