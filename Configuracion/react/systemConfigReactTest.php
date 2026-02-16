<?php
include "../../menu.php";
include "../../header.php";
?>

<div class="content">
    <div class="container-small">
        <div id="systemConfigReactTest"></div>
    </div>
</div>

<script type="module">
    import {
        SystemConfigApp
    } from './react-dist/config/system-config/SystemConfigApp.js';
    import { renderApp } from './services/react/app-renderer.js';

    renderApp(SystemConfigApp, 'systemConfigReactTest');
</script>

<?php include "../../footer.php"; ?>