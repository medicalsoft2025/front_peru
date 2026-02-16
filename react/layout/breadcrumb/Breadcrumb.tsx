import React from "react";

interface BreadcrumbProps {
    items: {
        label: string;
        href?: string;
    }[];
    activeItem: string;
}

export const Breadcrumb = (props: BreadcrumbProps) => {

    const { items, activeItem } = props;

    const handleReload = () => {
        location.reload();
    };

    return (
        <nav className="mb-3" aria-label="breadcrumb">
            <ol className="breadcrumb mb-0">
                {items.map((item, index) => (
                    <li key={index} className="breadcrumb-item">
                        {item.href ? <a href={item.href}>{item.label}</a> : <span>{item.label}</span>}
                    </li>
                ))}
                <li className="breadcrumb-item active" onClick={handleReload}>{activeItem}</li>
            </ol>
        </nav>
    );
};