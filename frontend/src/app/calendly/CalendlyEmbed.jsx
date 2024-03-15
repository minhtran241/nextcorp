import Script from 'next/script';

const CalendlyEmbed = ({ url }) => {
    const showDetails = 0;
    const showCookies = 0;

    return (
        <div className="flex items-center">
            <div
                className="calendly-inline-widget w-screen h-[65vh]"
                data-url={`${url}?hide_landing_page_details=${showDetails}&hide_gdpr_banner=${showCookies}`}
            ></div>
            <Script
                type="text/javascript"
                src="https://assets.calendly.com/assets/external/widget.js"
                async
            />
        </div>
    );
};

export default CalendlyEmbed;
