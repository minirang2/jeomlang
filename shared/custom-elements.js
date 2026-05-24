const VERSION = "v1.4.1";

class JeomVersion extends HTMLElement {
  connectedCallback() {
    this.textContent = VERSION;
  }
}
customElements.define("jeom-version", JeomVersion);