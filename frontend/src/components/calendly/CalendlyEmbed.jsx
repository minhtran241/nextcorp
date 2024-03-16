import Script from 'next/script';

const CalendlyEmbed = ({ url }) => {
    const showDetails = 0;
    const showCookies = 0;

    return (
        <>
            <div
                className="calendly-inline-widget w-full min-w-[320px] h-[700px]"
                data-url={`${url}?primary_color=3280f6&hide_landing_page_details=${showDetails}&hide_gdpr_banner=${showCookies}`}
                style={{ colorScheme: 'light' }}
            ></div>
            <Script
                type="text/javascript"
                src="https://assets.calendly.com/assets/external/widget.js"
                async
            />
        </>
    );
};

export default CalendlyEmbed;
