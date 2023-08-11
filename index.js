document.addEventListener("DOMContentLoaded", function () {
    const addSectionButton = document.getElementById("addSectionBT");
    const addDivButton = document.getElementById("addDivBT");
    const designContainer = document.querySelector(".design");
    let draggedContainer = null;

    addSectionButton.addEventListener("click", function () {
        const newContainer = createContainer("block");
        const newResizableDiv = createResizableDiv();
        newContainer.appendChild(newResizableDiv);
        designContainer.appendChild(newContainer);
        checkContainers();
    });

    addDivButton.addEventListener("click", function () {
        if (!draggedContainer || draggedContainer.style.display !== "flex") {
            draggedContainer = createContainer("flex");
            designContainer.appendChild(draggedContainer);
        }
        const newResizableDiv = createResizableDiv();
        draggedContainer.appendChild(newResizableDiv);
        checkContainers();
    });

    designContainer.addEventListener("dragover", function (event) {
        event.preventDefault(); // Prevent default drag-and-drop behavior
    });

    designContainer.addEventListener("drop", function (event) {
        event.preventDefault(); // Prevent default drop behavior
        if (draggedContainer) {
            designContainer.insertBefore(draggedContainer, event.target.closest(".container"));
        }
        checkContainers();
    });

    designContainer.addEventListener("click", function (event) {
        const target = event.target;
        if (target.classList.contains("delete-button")) {
            const parentResizableDiv = target.closest(".added-div");
            const parentContainer = parentResizableDiv.parentElement;

            parentContainer.removeChild(parentResizableDiv);

            if (parentContainer.childElementCount === 0) {
                designContainer.removeChild(parentContainer);
            }
            checkContainers();
        }
    });

    function createContainer(displayStyle) {
        const newContainer = document.createElement("div");
        newContainer.classList.add("container");
        if (displayStyle === "block") {
            newContainer.classList.add("default-container");
        }
        newContainer.style.display = displayStyle;
        
        newContainer.draggable = true;

        newContainer.addEventListener("dragstart", function (event) {
            event.dataTransfer.setData("text/plain", "container");
            draggedContainer = newContainer;
        });

        newContainer.addEventListener("dragend", function () {
            draggedContainer = null;
        });

        return newContainer;
    }

    function createResizableDiv() {
        const newDiv = document.createElement("div");
        newDiv.classList.add("added-div");
        newDiv.style.width = "150px";
        newDiv.style.height = "150px";
        newDiv.style.backgroundColor = "white";
        newDiv.style.margin = "5px"; // Add a margin for the gap
        newDiv.style.position = "relative"; // Ensure relative positioning for handle
        newDiv.style.display = "flex"; // Use flexbox to center the content
        newDiv.style.flexDirection = "column"; // Stack elements vertically
        newDiv.style.alignItems = "center"; // Center horizontally
    
        const textContainer = document.createElement("div");
        textContainer.style.flex = "1"; // Allow text container to expand
        textContainer.style.display = "flex"; // Use flexbox to center the text
        textContainer.style.justifyContent = "center"; // Center horizontally
        textContainer.style.alignItems = "center"; // Center vertically
        textContainer.contentEditable = true; // Make the text container editable
        textContainer.innerHTML = "Name"; // Initial placeholder text
        textContainer.style.fontSize = "1.6rem";
        newDiv.appendChild(textContainer);
    
        const resizeHandle = document.createElement("div");
        resizeHandle.classList.add("resize-handle");
        newDiv.appendChild(resizeHandle);
    
        const deleteButton = document.createElement("button");
        deleteButton.classList.add("delete-button");
        deleteButton.textContent = "x";
        deleteButton.style.fontSize = "1rem";
        deleteButton.style.backgroundColor = "#D65A31";
        deleteButton.style.color = "#EEEEEE";
        deleteButton.style.width = "32px";
        deleteButton.style.height = "32px";
        deleteButton.style.borderRadius = "5px";
        deleteButton.style.position = "absolute"; // Position the button absolutely
        deleteButton.style.bottom = "5px"; // Distance from the bottom
        deleteButton.style.left = "5px"; // Distance from the left
        newDiv.appendChild(deleteButton);

        
        // Event listeners for resizing
        let startX, startY, startWidth, startHeight;
    
        resizeHandle.addEventListener("mousedown", (e) => {
            e.preventDefault();
            startX = e.clientX;
            startY = e.clientY;
            startWidth = newDiv.offsetWidth;
            startHeight = newDiv.offsetHeight;
            document.addEventListener("mousemove", resize);
            document.addEventListener("mouseup", stopResize);
        });
    
        function resize(e) {
            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;
    
            newDiv.style.width = startWidth + deltaX + "px";
            newDiv.style.height = startHeight + deltaY + "px";
        }
    
        function stopResize() {
            document.removeEventListener("mousemove", resize);
            document.removeEventListener("mouseup", stopResize);
        }
    
        return newDiv;
    }
    

    function checkContainers() {
        const containers = designContainer.querySelectorAll(".container");
        containers.forEach(container => {
            const displayStyle = container.classList.contains("default-container") ? "block" : "flex";
            if (displayStyle === "block" && container.childElementCount > 1) {
                designContainer.removeChild(container);
            } else if (container.childElementCount === 0) {
                designContainer.removeChild(container);
            }
        });
    }
});
