import { useState } from "react";

interface AccordionProps {
    title: string,
    hiddenContent: string[]
}

const Accordion = ({title, hiddenContent}:AccordionProps) => {
    const [showHiddenContent, setShowHiddenContent] = useState<boolean>(false)

    return (  
        <section className="mb-6">
            <h2 
                onClick={() => setShowHiddenContent(!showHiddenContent)}
                className="bg-gray-200 rounded-md px-4 py-3 text-lg">
                    {title}
            </h2>
            <article className={`${showHiddenContent ? "h-full" : "h-0"} overflow-hidden`}>
                {hiddenContent.map((paragraph: string) => <p key={crypto.randomUUID()}>{paragraph}</p>
                )}
            </article>
        </section>
    );
}

export default Accordion;