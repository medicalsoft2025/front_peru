import React from 'react';

interface EnvironmentalCalendarLayoutProps {
    list: React.ReactNode;
    calendar: React.ReactNode;
}

export const EnvironmentalCalendarLayout = ({ list, calendar }: EnvironmentalCalendarLayoutProps) => {
    return (
        <>
            <div className="d-flex gap-3" style={{ height: 'calc(100vh - 280px)' }}>
                <div className="d-flex flex-column overflow-auto" style={{ width: '300px' }}>
                    {list}
                </div>
                <div className="d-flex flex-grow-1 h-100 overflow-hidden">
                    {calendar}
                </div>
            </div>
        </>
    );
};