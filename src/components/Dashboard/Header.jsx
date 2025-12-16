import React from 'react'

const DashboardHeader = ({ heading }) => {
    return (
        <div>
            {/* HEADER */}
            <div className="flex justify-between items-center mb-6">
                <h2>{heading}</h2>
                <button className="btn-gray w-full sm:w-auto">Logout</button>
            </div>
        </div>
    )
}

export default DashboardHeader