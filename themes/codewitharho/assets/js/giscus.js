function setTheme(theme) {
    const iframe = document.querySelector('iframe.giscus-frame')
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
