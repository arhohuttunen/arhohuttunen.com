function setGiscusTheme(theme) {
    const iframe = document.querySelector('iframe.giscus-frame');
    if (!iframe) return;

    iframe.contentWindow.postMessage(
        {
            giscus: {
                setConfig: {
                    theme: theme
                }
            }
        },
        'https://giscus.app'
    );
}

window.addEventListener('message', function handleGiscusReady(event) {
    if (event.origin !== 'https://giscus.app' || !event.data?.giscus) return;
    window.removeEventListener('message', handleGiscusReady);
    const theme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    event.source.postMessage(
        { giscus: { setConfig: { theme: theme } } },
        event.origin
    );
});
