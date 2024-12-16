// Initialize
document.addEventListener('DOMContentLoaded', () => {
    State.initialize();
    Controls.generate();
    WheelRenderer.render();

    document.getElementById('gameName').addEventListener('input', WheelRenderer.render);
});
