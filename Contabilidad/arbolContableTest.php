<?php
include "../menu.php";
include "../header.php";
?>

<div class="content">
    <div class="container-small">
        <div id="arbolContableReactRoot"></div>
    </div>
</div>

<script type="module">
    import {
        AccountingAccountsV2
    } from './react-dist/accounting/AccountingAccountsV2.js';
    import { renderApp } from "./services/react/app-renderer.js";

    renderApp(AccountingAccountsV2, "arbolContableReactRoot");
</script>

<?php include "../footer.php"; ?>