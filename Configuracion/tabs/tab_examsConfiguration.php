<div class="row gx-3 gy-4 mb-5">
    <div class="card mb-3 p-3">
        <div id="examsConfigReact"></div>
    </div>
</div>

<script type="module">
    import {
        ExamConfigApp
    } from './react-dist/exams-config/ExamConfigApp.js';
    import { renderApp } from './services/react/app-renderer.js';

    renderApp(ExamConfigApp, 'examsConfigReact');
</script>