// js/starters.js

function showRecipePopup(dishName, recipe) {
    // Create the popup elements
    const popup = document.createElement('div');
    popup.classList.add('popup');

    const popupContent = document.createElement('div');
    popupContent.classList.add('popup-content');

    const popupTitle = document.createElement('h2');
    popupTitle.textContent = dishName;

    const popupRecipe = document.createElement('p');
    popupRecipe.textContent = recipe;

    const closeButton = document.createElement('button');
    closeButton.textContent = 'Close';
    closeButton.onclick = () => {
        document.body.removeChild(popup);
    };

    // Append elements to the popup content
    popupContent.appendChild(popupTitle);
    popupContent.appendChild(popupRecipe);
    popupContent.appendChild(closeButton);

    // Append popup content to the popup
    popup.appendChild(popupContent);

    // Append popup to the body
    document.body.appendChild(popup);
}

// Add some basic styles for the popup
const styles = `
    .popup {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .popup-content {
        background-color: white;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        text-align: center;
    }
    .popup-content h2 {
        margin-top: 0;
    }
    .popup-content button {
        margin-top: 20px;
        padding: 10px 20px;
        background-color: #28a745;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }
    .popup-content button:hover {
        background-color: #218838;
    }
`;

// Append styles to the head
const styleSheet = document.createElement('style');
styleSheet.type = 'text/css';
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);
