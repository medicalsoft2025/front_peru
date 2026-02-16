<div id="userAbsencesAppReact"></div>

<script type="module">
    import {
        UserAbsenceApp
    } from './react-dist/user-absences/UserAbsenceApp.js';
    import { renderApp } from './services/react/app-renderer.js';

    renderApp(UserAbsenceApp, 'userAbsencesAppReact');
</script>