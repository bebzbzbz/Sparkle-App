import { JSX } from "react";

interface CollapseProps {
    title: string,
    hiddenContent: string[],
    icon?: JSX.Element,
    extraElement?: JSX.Element
}

const Collapse = ({title, hiddenContent, icon, extraElement}:CollapseProps) => {
    return (  
        <section className="mb-4 bg-base-100 border-base-300 collapse border">
            <input type="checkbox" className=" pr-0" />
            <div
                className="collapse-title bg-primary text-primary-content peer-checked:bg-secondary peer-checked:text-secondary-content flex justify-between items-center font-bold"
            >
                {title}
                <div className="-mr-7 h-8">
                    {icon}
                </div>
            </div>
            <div
                className="collapse-content bg-primary text-primary-content peer-checked:bg-secondary peer-checked:text-secondary-content"
            >{hiddenContent.map((paragraph: string) => <p key={crypto.randomUUID()}>{paragraph}</p>
            )}
            {extraElement}</div>
        </section>
    );
}

export default Collapse;