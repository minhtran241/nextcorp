const CalendlyEmbed = () => {
    return (
        <>
            <div
                class="calendly-inline-widget"
                data-url="https://calendly.com/nextcorp/30min"
                style={{ minWidth: '320px', height: '580px' }}
            ></div>
            <script
                type="text/javascript"
                src="https://assets.calendly.com/assets/external/widget.js"
                async
            ></script>
        </>
    );
};

export default CalendlyEmbed;
