<div class="modal fade modal-xl" id="modalEntity" tabindex="-1" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content p-4">
      <div id="modal-invoice-by-entity"></div>
    </div>
  </div>
</div>

<script type="module">
  import {
    BillingByEntity
  } from './react-dist/billing/by-entity/modal.js';
  import { renderApp } from "./services/react/app-renderer.js";

  renderApp(BillingByEntity, "modal-invoice-by-entity");
</script>