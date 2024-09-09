import { commonCss } from '../../common.js';
const Template = document.createElement('template');
Template.innerHTML = `
<style>
${commonCss}
#license-container {
    margin: 100px auto 0;
    max-width: 900px; 
    width: 100%; 
    padding: 0 15px; 
    box-sizing: border-box; 
}

#license-container p {
    font-family: Open Sans;
    font-size: 14px;
    line-height: 1.5;
}
</style>

<div id="license-container">
    <p>
        The MIT License (MIT) <br/><br/>

        Copyright (c) <2014> <copyright Marthlab></copyright> <br/><br/>

        Permission is hereby granted, free of charge, to any person obtaining a copy
        of this software and associated documentation files (the "Software"), to deal
        in the Software without restriction, including without limitation the rights
        to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
        copies of the Software, and to permit persons to whom the Software is
        furnished to do so, subject to the following conditions:<br/><br/>

        The above copyright notice and this permission notice shall be included in
        all copies or substantial portions of the Software.<br/><br/>

        THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
        IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
        FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
        AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
        LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
        OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
        THE SOFTWARE.
    </p>
</div>
`;

class License extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(Template.content.cloneNode(true));
  }
}

customElements.define('iobio-license-page', License);

export { License };
