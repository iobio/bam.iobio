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
    display: flex;
    align-items: center;
}

input[type="text"] {
    flex-grow: 1;
    padding: 10px;
    padding-right: 30px;
    border: 1px solid #ccc;
    border-radius: 3px;
    box-sizing: border-box;
}

.delete-icon {
    position: absolute;
    right: 100px;
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
    text-align: center;
}

.select-file-button {
    width: 80px;
    white-space: nowrap;
}

.load-button, .cancel-button {
    width: 70px;
}

::backdrop {
    background-color: rgba(0, 0, 0, 0.4);
}
</style>
<dialog class="modal">
    <div class="input-container">
        <input type="text" placeholder="Select Bam/Cram file" readonly />
        <span class="delete-icon">&#x2715;</span>
        <button class="select-file-button" data-index="0">Select file</button>
    </div>
    <div class="input-container">
        <input type="text" placeholder="Select Bai/Crai file" readonly />
        <span class="delete-icon">&#x2715;</span>
        <button class="select-file-button" data-index="1">Select file</button>
    </div>
    <div class="button-container">
        <button class="load-button">Load</button>
        <button class="cancel-button">Cancel</button>
    </div>
</dialog>
`;

class LocalFileInputModal extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(modalTemplate.content.cloneNode(true));

        this.modal = this.shadowRoot.querySelector('.modal');
        this.loadButton = this.shadowRoot.querySelector('.load-button');
        this.cancelButton = this.shadowRoot.querySelector('.cancel-button');
        this.deleteIcons = this.shadowRoot.querySelectorAll('.delete-icon');
        this.inputs = this.shadowRoot.querySelectorAll('input');
        this.selectFileButtons = this.shadowRoot.querySelectorAll('.select-file-button');

        this.selectedFiles = [null, null];
        this.addEventListeners();
    }

    addEventListeners() {
        this.loadButton.addEventListener('click', () => this.handleLoad());
        this.cancelButton.addEventListener('click', () => this.close());
        this.deleteIcons.forEach((icon, index) => {
            icon.addEventListener('click', () => this.clearInput(index));
        });
        this.selectFileButtons.forEach((button) => {
            button.addEventListener('click', (event) => this.selectFile(event.target.dataset.index));
        });
    }

    handleLoad() {
        if (!this.selectedFiles[0]) {
            alert('The BAM/CRAM file is required!');
            return;
        }
        
        if (!this.selectedFiles[1]) {
            alert('The BAI/CRAI file is required!');
            return;
        }
        this.dispatchEvent(new CustomEvent('local-file-loaded', {
            detail: { files: this.selectedFiles },
            bubbles: true,
            composed: true
        }));
        this.close();
    }

    clearInput(index) {
        this.inputs[index].value = '';
        this.selectedFiles[index] = null;
    }

    selectFile(index) {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = index === '0' ? '.bam,.cram' : '.bai,.crai';
        input.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file) {
                this.inputs[index].value = file.name;
                this.selectedFiles[index] = file; 
            }
        });
        input.click();
    }

    showModal() {
        this.modal.showModal();
    }

    close() {
        this.modal.close();
    }
}

customElements.define('local-file-input-modal', LocalFileInputModal);
export { LocalFileInputModal };