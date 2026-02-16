<!-- <div class="content">    
<div class="container-small">        
<nav class="mb-3" aria-label="breadcrumb">            
<ol class="breadcrumb mb-0">                
<li class="breadcrumb-item"><a href="homeContabilidad">Configuracion</a></li>                
<li class="breadcrumb-item active" onclick="location.reload()">Entidades</li>            
</ol>        
</nav>        
<div class="main-content">            
<div class="component-container">                 -->
<div id="ReasonTicket"></div>
<!-- </div>        
</div>    
</div>
</div> -->

<script type="module">
    import {
        ReasonTicket
    } from './react-dist/reason-ticket/ReasonTicket.js';
    import { renderApp } from './services/react/app-renderer.js';

    renderApp(ReasonTicket, 'ReasonTicket');
</script>