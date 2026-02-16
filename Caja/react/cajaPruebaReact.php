<?php
include "../../menu.php";
include "../../header.php";
?>

<div class="content mt-3">
    <div class="container-small mt-3">
        <div id="cajaModalRoot"></div>
    </div>
</div>

<script type="module">
    import {
        CashRegisterApp
    } from './react-dist/cash-register/CashRegisterApp.js';
    import { renderApp } from './services/react/app-renderer.js';

    renderApp(CashRegisterApp, "cajaModalRoot");
</script>

<?php include "../../footer.php"; ?>