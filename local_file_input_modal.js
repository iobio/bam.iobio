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
        <input type="text" id="bam-cram-input" placeholder="Select Bam/Cram file" readonly />
        <span class="delete-icon" id="bam-cram-delete">&#x2715;</span>
        <button class="select-file-button" id="bam-cram-select">Select file</button>
    </div>
    <div class="input-container">
        <input type="text" id="bai-crai-input" placeholder="Select Bai/Crai file" readonly />
        <span class="delete-icon" id="bai-crai-delete">&#x2715;</span>
        <button class="select-file-button" id="bai-crai-select">Select file</button>
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
        
        this.bamCramInput = this.shadowRoot.querySelector('#bam-cram-input');
        this.baiCraiInput = this.shadowRoot.querySelector('#bai-crai-input');

        this.bamCramDelete = this.shadowRoot.querySelector('#bam-cram-delete');
        this.baiCraiDelete = this.shadowRoot.querySelector('#bai-crai-delete');

        this.bamCramSelect = this.shadowRoot.querySelector('#bam-cram-select');
        this.baiCraiSelect = this.shadowRoot.querySelector('#bai-crai-select');

        this.selectedBamCramFile = null;
        this.selectedBaiCraiFile = null;
        this.addEventListeners();
    }

    addEventListeners() {
        this.loadButton.addEventListener('click', () => this.handleLoad());
        this.cancelButton.addEventListener('click', () => this.close());

        this.bamCramDelete.addEventListener('click', () => this.clearBamCramInput());
        this.baiCraiDelete.addEventListener('click', () => this.clearBaiCraiInput());

        this.bamCramSelect.addEventListener('click', () => this.selectBamCramFile());
        this.baiCraiSelect.addEventListener('click', () => this.selectBaiCraiFile());
    }

    handleLoad() {
        if (!this.selectedBamCramFile) {
            alert('The BAM/CRAM file is required!');
            return;
        }
        
        if (!this.selectedBaiCraiFile) {
            alert('The BAI/CRAI file is required!');
            return;
        }
        this.dispatchEvent(new CustomEvent('local-file-loaded', {
            detail: { files: [this.selectedBamCramFile, this.selectedBaiCraiFile] },
            bubbles: true,
            composed: true
        }));
        this.close();
    }

    clearBamCramInput() {
        this.bamCramInput.value = '';
        this.selectedBamCramFile = null;
    }

    clearBaiCraiInput() {
        this.baiCraiInput.value = '';
        this.selectedBaiCraiFile = null;
    }

    selectBamCramFile() {
        this.selectFile('.bam,.cram', (file) => {
            this.bamCramInput.value = file.name;
            this.selectedBamCramFile = file;
        });
    }

    selectBaiCraiFile() {
        this.selectFile('.bai,.crai', (file) => {
            this.baiCraiInput.value = file.name;
            this.selectedBaiCraiFile = file;
        });
    }

    selectFile(accept, callback) {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = accept;
        input.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file) {
                callback(file);
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

customElements.define('iobio-local-file-input-modal', LocalFileInputModal);
export { LocalFileInputModal };