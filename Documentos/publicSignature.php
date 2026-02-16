<?php
include "../public_header.php";
?>


<div class="main-content">
    <div class="component-container">
        <div id="asignar-consentimiento"></div>
    </div>
</div>

<script type="module">
    import React from "react";
    import ReactDOMClient from "react-dom/client";
    import PublicSignature from '../../react-dist/config/asignar-consentimiento/PublicSignature.js';

    const rootElement = document.getElementById('asignar-consentimiento');
    if (rootElement) {
        ReactDOMClient.createRoot(rootElement).render(React.createElement(PublicSignature));
    }
</script>

<?php
include "../footer.php";
?>