const helpTemplate = document.createElement('template');
helpTemplate.innerHTML = `
  <style>
    #main {
      font-size: 24px;
      width: 500px;
      margin-left: auto;
      margin-right: auto;
      margin-top: 100px;
    }
  </style>
  <div id='main'>
    <h1>Getting Help</h1>
    <p>
      If you have any trouble with bam.iobio, you can email us directly
      at <a href='mailto:iobioproject@gmail.com'>iobioproject@gmail.com</a>. 
      We usually respond within a day, though we may not always be able to
      fix something immediately.
    </p>
  </div>
`;

class HelpPage extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(helpTemplate.content.cloneNode(true));
  }
}

customElements.define('iobio-help-page', HelpPage);
export { HelpPage }
