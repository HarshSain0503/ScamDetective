import whois from "whois-json";

export const checkDomainAge = async (url) => {

    try {

        const parsed = new URL(url);
        const domain = parsed.hostname;

        const data = await whois(domain);

        if (!data.creationDate) {
            return { domainAge: null, newDomain: false };
        }

        const created = new Date(data.creationDate);
        const now = new Date();

        const diffTime = Math.abs(now - created);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        return {
            domainAge: diffDays,
            newDomain: diffDays < 30
        };

    } catch (error) {

        return { domainAge: null, newDomain: false };

    }

};