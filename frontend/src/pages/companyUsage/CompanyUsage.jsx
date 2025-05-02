// import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import "./CompanyUsage.scss"


const data = [
    { name: 'Jan', companyA: 30, companyB: 20, companyC: 15 },
    { name: 'Feb', companyA: 40, companyB: 25, companyC: 30 },
    { name: 'Mar', companyA: 25, companyB: 20, companyC: 20 },
    { name: 'Apr', companyA: 20, companyB: 15, companyC: 10 },
    { name: 'May', companyA: 35, companyB: 30, companyC: 25 },
    { name: 'Jun', companyA: 30, companyB: 35, companyC: 28 },
    { name: 'Jul', companyA: 35, companyB: 25, companyC: 30 },
    { name: 'Aug', companyA: 40, companyB: 35, companyC: 33 },
    { name: 'Sep', companyA: 25, companyB: 20, companyC: 18 },
    { name: 'Oct', companyA: 30, companyB: 25, companyC: 22 },
    { name: 'Nov', companyA: 35, companyB: 30, companyC: 25 },
    { name: 'Dec', companyA: 40, companyB: 35, companyC: 30 },
];


function CompanyUsage() {
    return (
        <>
            <div className="usage-company-page">
                <h1 className="page-title">Usage of Company</h1>
                <div className="chart-container">
                    <ResponsiveContainer width="100%" height={400}>
                        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="companyA" fill="#8884d8" />
                            <Bar dataKey="companyB" fill="#82ca9d" />
                            <Bar dataKey="companyC" fill="#ffc658" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </>
    )
}

export default CompanyUsage