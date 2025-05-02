import { useState, useEffect } from "react";
import { getMaintenanceRecords } from "../../api/apiService";
import "./Reports.scss";

function Reports() {
    const [reportData, setReportData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const itemsPerPage = 10;
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const data = await getMaintenanceRecords();
                setReportData(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const totalPages = Math.ceil(reportData.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentAssets = reportData.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <div className="reports">
            <div className="report-container">
                <h3>Report - Checked-Out by Past Due</h3>
                {isLoading ? (
                    <p>Loading...</p>
                ) : error ? (
                    <p>Error: {error}</p>
                ) : (
                    <table className="report-table">
                        <thead>
                            <tr>
                                <th>Asset ID</th>
                                <th>Maintenance Start Date</th>
                                <th>Maintenance End Date</th>
                                <th>Description</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentAssets.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="empty-state">
                                        No data available
                                    </td>
                                </tr>
                            ) : (
                                currentAssets.map((row, index) => (
                                    <tr key={index}>
                                        <td>{row.assetID}</td>
                                        <td>{new Date(row.startDate).toISOString().slice(0, 10)}</td>
                                        <td>{row.endDate ? new Date(row.endDate).toISOString().slice(0, 10) : "N/A"}</td>
                                        <td>{row.description}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            <div className="pagination">
                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        aria-label={`Go to page ${index + 1}`}
                        key={index}
                        className={`page-btn ${currentPage === index + 1 ? "active" : ""}`}
                        onClick={() => setCurrentPage(index + 1)}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default Reports;