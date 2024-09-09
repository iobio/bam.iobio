const modalTemplate = document.createElement('template');
modalTemplate.innerHTML = `
  <style>
.modal {
    background-color: #f0f0f0;
    margin: 20% auto;
    border: 1px solid #888;
    width: 500px;
    border-radius: 5px;
    padding: 20px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.input-container {
    margin-bottom: 10px;
    position: relative;
}

input[type="text"] {
    width: 100%;
    padding: 10px;
    padding-right: 30px;
    border: 1px solid #ccc;
    border-radius: 3px;
    box-sizing: border-box;
}

.delete-icon {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
    color: #888;
}

.button-container {
    display: flex;
    justify-content: center;
    margin-top: 20px;
}

button {
    background-color: #2d8fc1;
    color: white;
    padding: 8px 15px;
    border: none;
    border-radius: 3px;
    cursor: pointer;
    margin-left: 10px;
    width: 70px;
    text-align: center;
}

::backdrop {
    background-color: rgba(0, 0, 0, 0.4);
}
</style>
<dialog class="modal">
    <div class="input-container">
        <input type="text" placeholder="Bam/Cram URL" />
        <span class="delete-icon">&#x2715;</span>
    </div>
    <div class="input-container">
        <input type="text" placeholder="Bai/Crai URL (Optional)" />
        <span class="delete-icon">&#x2715;</span>
    </div>
    <div class="button-container">
        <button class="load-button">Load</button>
        <button class="cancel-button">Cancel</button>
    </div>
</dialog>
`;

class URLInputModal extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(modalTemplate.content.cloneNode(true));

        this.modal = this.shadowRoot.querySelector('.modal');
        this.loadButton = this.shadowRoot.querySelector('.load-button');
        this.cancelButton = this.shadowRoot.querySelector('.cancel-button');
        this.deleteIcons = this.shadowRoot.querySelectorAll('.delete-icon');
        this.inputs = this.shadowRoot.querySelectorAll('input');

        this.addEventListeners();
    }

    addEventListeners() {
        this.loadButton.addEventListener('click', () => this.handleLoad());
        this.cancelButton.addEventListener('click', () => this.close());
        this.deleteIcons.forEach((icon, index) => {
            icon.addEventListener('click', () => this.clearInput(index));
        });
    }

    handleLoad() {
        const urls = Array.from(this.inputs).map(input => input.value);
        if (!urls[0].trim()) {
            // If it's empty, prevent the modal from closing and emitting the event
            alert('The first URL cannot be empty!');
            return;
        }
        this.dispatchEvent(new CustomEvent('remote-file-loaded', { 
            detail: { urls: urls },
            bubbles: true,
            composed: true

        }));
        this.close();
    }

    clearInput(index) {
        this.inputs[index].value = '';
    }

    showModal() {
        this.modal.showModal();
    }

    close() {
        this.modal.close();
    }
}

customElements.define('url-input-modal', URLInputModal);
export { URLInputModal };