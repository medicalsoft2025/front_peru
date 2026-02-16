<?php
include "../../../menu.php";
include "../../../header.php";
?>

<div class="componente">
    <div class="content">

        <div id="billing-by-entity-modal"></div>

    </div>
</div>

<script type="module">
    import {
        BillingByEntity
    } from './react-dist/billing/by-entity/modal.js';
    import { renderApp } from "./services/react/app-renderer.js";

    renderApp(BillingByEntity, "billing-by-entity-modal");
</script>

<?php
include "../../../footer.php";
?>