interface CollapseProps {
    title: string,
    hiddenContent: string[],
    icon?: string,
}

const Collapse = ({title, hiddenContent, icon}:CollapseProps) => {
    return (  
        <section className="mb-4 bg-base-100 border-base-300 collapse border">
            <input type="checkbox" className=" pr-0" />
            <div
                className="collapse-title bg-primary text-primary-content peer-checked:bg-secondary peer-checked:text-secondary-content flex justify-between items-center"
            >
                {title}
                <img src={`/svg/${icon}.svg`} alt={`${icon} icon`} className="h-5 -mr-7"/>
            </div>
            <div
                className="collapse-content bg-primary text-primary-content peer-checked:bg-secondary peer-checked:text-secondary-content"
            >{hiddenContent.map((paragraph: string) => <p key={crypto.randomUUID()}>{paragraph}</p>
            )}</div>
        </section>
    );
}

export default Collapse;