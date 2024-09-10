import { commonCss } from './lib/iobio-charts/common.js';
const Template = document.createElement('template');
Template.innerHTML = `
<style>
${commonCss}
#main {
    margin: 50px auto 0;
    max-width: 900px; 
    width: 100%; 
    padding: 0 15px; 
    box-sizing: border-box; 
}

#main header {
    font-family: Quicksand;
    font-size: 46px;
}

#main h1, h2, h3, h4 {
    font-family: Muli;
}

#main h1 {
    font-size: 26px;
    font-weight: normal;
}

#main h2 {
    font-size: 24px;
}

#main h3 {
    font-size: 18px;
    margin-top: 40px;
}

#main h4 {
    margin-bottom: 5px;
}

#main body {
    font-family: Open Sans;
    width: 900px;
    font-weight: 300;
}

a {
    color: var(--data-color);
    text-decoration: none; !important;
}

pre {
    border: none;
    background: none;
}
</style>

<div id="main">
    <body>
        <header><a href="http://bam.iobio.io">bam<span style="color:rgb(200,200,200)">.iobio.io</span><span color>&nbsp;</span></a></header>

        <h1>The indexed BAM</h1>

        <p>bam.iobio needs indexed bam files so that it can sample regions from the entire file. Follow the instructions below to index your bam file and use bam.iobio.</p>

        <h3>Install Bamtools</h3>

        <p>Download and install bamtools using the instructions <a href="https://github.com/pezmaster31/bamtools/wiki/Building-and-installing">here</a>.</p>

        <h3>Indexing your BAM</h3>

        <p>Once you have successfully compiled bamtools, you can index your bam files with the following command:</p>
        <pre>
            $ /path/to/bamtools index -in mybam.bam
        </pre>
        <p>This command will create a new file, the index file (.bam.bai). Now you are ready to run <a href="../../../../index.html">bam.iobio</a>, selecting this file and your bam file when prompted.</p>
    </body>
</div>
`;

class FileRequirement extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(Template.content.cloneNode(true));
  }
}

customElements.define('iobio-file-requirements-page', FileRequirement);

export { FileRequirement }