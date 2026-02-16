<?php
include "../menu.php";
include "../header.php";
?>

<div class="content">
    <div class="container-small">
        <div id="companyConfigurationRoot"></div>
    </div>
</div>

<script type="module">
    import {
        CompaniesCrud
    } from './react-dist/config/companies-crud/CompaniesCrud.js';
    import {
        BasicCompanyConfiguration
    } from './react-dist/config/company-configuration/BasicCompanyConfiguration.js';
    import { renderApp } from "./services/react/app-renderer.js";

    renderApp(CompaniesCrud, "companyConfigurationRoot");
</script>

<?php include "../footer.php"; ?>