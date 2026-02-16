<div id="admissionAppReact"></div>

<script type="module">
    import {
        AdmissionAppReact
    } from './react-dist/admissions/AdmissionAppReact.js';
    import { renderApp } from "./services/react/app-renderer.js";

    renderApp(AdmissionAppReact, "admissionAppReact");
</script>