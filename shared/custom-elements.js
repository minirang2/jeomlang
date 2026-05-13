const VERSION = "v1.3.1";

class JeomVersion extends HTMLElement {
  connectedCallback() {
    this.textContent = VERSION;
  }
}
customElements.define("jeom-version", JeomVersion);