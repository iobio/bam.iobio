const Template = document.createElement('template');
Template.innerHTML = `
<style>
#image-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    overflow: hidden;
}

img {
    max-width: 100%;
    max-height: 100vh;
    width: auto;
    height: auto;
    -webkit-user-select: none;
    background-color: hsl(0, 0%, 90%);
    transition: background-color 300ms;
    display: block;
    margin: auto;
}
</style>
<div id="image-container">
    <img src="/images/browserCompatability.png" alt="Compatible Browsers" id="browserImage">
</div>
`;

class CompatibleBrowsersPage extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(Template.content.cloneNode(true));
    }
}

customElements.define('iobio-compatible-browsers-page', CompatibleBrowsersPage);
export { CompatibleBrowsersPage }
