import React, { useState, useEffect } from "react";
import { FaClipboardList, FaCheckCircle, FaTimesCircle, FaUsers } from "react-icons/fa";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "../styles/Dashboard.css";
import Header from "./Header";
import uparrow from "../assets/primary.jpg";
import downarrow from "../assets/primary.png";
import api from "../api";


// Skeleton components
const CardSkeleton = () => (
    <div className="card mb-2 skeleton-card" style={{ height: "140px" }}>
        <div className="card-body p-2">
            <div className="d-flex justify-content-between mt-3">
                <div className="skeleton-text-sm"></div>
                <div className="skeleton-text-sm" style={{ width: "30%" }}></div>
            </div>
        </div>
    </div>
);


const ChartSkeleton = () => (
    <div className="card" style={{ height: "325px" }}>
        <div
            className="skeleton-text"
            style={{ width: "60%", margin: "20px" }}
        ></div>
        <div className="skeleton-chart"></div>
    </div>
);


const TableSkeleton = () => (
    <div className="card p-2" style={{ height: "325px", overflow: "hidden" }}>
        <div style={{ height: "290px", overflowY: "auto" }}>
            <table className="table table-borderless" style={{ width: "100%" }}>
                <thead
                    style={{ position: "sticky", top: 0, background: "#fff", zIndex: 10 }}
                >
                    <tr style={{ lineHeight: "0.7" }}>
                        <th className="text-muted">Service Name</th>
                        <th className="text-muted">Services</th>
                        <th className="text-muted">Booking (%)</th>
                    </tr>
                </thead>
                <tbody>
                    {[...Array(5)].map((_, index) => (
                        <tr key={index}>
                            <td>
                                <div className="skeleton-text" style={{ width: "80%" }}></div>
                            </td>
                            <td>
                                <div className="skeleton-text" style={{ width: "40%" }}></div>
                            </td>
                            <td>
                                <div className="skeleton-text" style={{ width: "40%" }}></div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);


const Dashboard = () => {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;


    const [selectedYear, setSelectedYear] = useState(currentYear.toString());
    const [analyticsYear, setAnalyticsYear] = useState(currentYear.toString());
    const [mostBookingYear, setMostBookingYear] = useState(
        currentYear.toString()
    );
    const [mostBookingMonth, setMostBookingMonth] = useState(
        currentMonth.toString()
    );


    const [bookingStats, setBookingStats] = useState(null);
    const [workerStats, setWorkerStats] = useState(null);
    const [monthlyStats, setMonthlyStats] = useState(null);
    const [productStats, setProductStats] = useState(null);


    const [loadingStats, setLoadingStats] = useState(true);
    const [loadingAnalytics, setLoadingAnalytics] = useState(true);
    const [loadingProducts, setLoadingProducts] = useState(true);
    const [networkError, setNetworkError] = useState(false);
    const [error, setError] = useState(null);


    const years = [];
    for (let year = 2020; year <= currentYear; year++) {
        years.push(year);
    }


    const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];


    // Fetch stats data (cards)
    const fetchStatsData = async () => {
        try {
            setLoadingStats(true);
            setNetworkError(false);
            const [bookingRes, workerRes] = await Promise.all([
                api.get(`/booking/statistics-by-year?year=${selectedYear}`),
                api.get(`/workers/count/active-by-year?year=${selectedYear}`),
            ]);
            setBookingStats(bookingRes.data[selectedYear]);
            setWorkerStats(workerRes.data[selectedYear]);
        } catch (error) {
            console.error("Error fetching stats data:", error);
            if (error.message === "Network Error") {
                setNetworkError(true);
                setError(
                    "No internet connection. Please check your network and try again."
                );
            }
        } finally {
            setLoadingStats(false);
        }
    };


    // Fetch analytics data (chart)
    const fetchAnalyticsData = async () => {
        try {
            setLoadingAnalytics(true);
            setNetworkError(false);
            const monthlyRes = await api.get(
                `/booking/monthly-stats?year=${analyticsYear}`
            );
            setMonthlyStats(monthlyRes.data);
        } catch (error) {
            console.error("Error fetching analytics data:", error);
            if (error.message === "Network Error") {
                setNetworkError(true);
                setError(
                    "No internet connection. Please check your network and try again."
                );
            }
        } finally {
            setLoadingAnalytics(false);
        }
    };


    // Fetch product data (table)
    const fetchProductData = async () => {
        try {
            setLoadingProducts(true);
            setNetworkError(false);
            const productRes = await api.get(
                `/booking/monthly-product-stats?year=${mostBookingYear}&month=${mostBookingMonth}`
            );
            setProductStats(
                productRes.data[
                `${mostBookingYear}-${mostBookingMonth.toString().padStart(2, "0")}`
                ]
            );
        } catch (error) {
            console.error("Error fetching product data:", error);
            if (error.message === "Network Error") {
                setNetworkError(true);
                setError(
                    "No internet connection. Please check your network and try again."
                );
            }
        } finally {
            setLoadingProducts(false);
        }
    };


    useEffect(() => {
        fetchStatsData();
    }, [selectedYear]);


    useEffect(() => {
        fetchAnalyticsData();
    }, [analyticsYear]);


    useEffect(() => {
        fetchProductData();
    }, [mostBookingYear, mostBookingMonth]);


    // Prepare stats cards data
    const stats = [
        {
            title: "Total Booking",
            count: bookingStats?.totalBookings || 0,
            icon: <FaClipboardList />,
            borderColor: "#EA6C6E",
            percentage: bookingStats?.totalPercentageChange || 0,
            showArrow: bookingStats?.totalTrend && bookingStats.totalTrend !== "no change",
            isUp: bookingStats?.totalTrend === "increase",
            hasData: bookingStats !== null, // Add this flag
        },
        {
            title: "Completed",
            count: bookingStats?.completedBookings || 0,
            icon: <FaCheckCircle />,
            borderColor: "#EFA066",
            percentage: bookingStats?.completedPercentageChange || 0,
            showArrow: bookingStats?.completedTrend && bookingStats.completedTrend !== "no change",
            isUp: bookingStats?.completedTrend === "increase",
            hasData: bookingStats !== null,
        },
        {
            title: "Cancelled",
            count: bookingStats?.cancelledBookings || 0,
            icon: <FaTimesCircle />,
            borderColor: "#31DDFC",
            percentage: bookingStats?.cancelledPercentageChange || 0,
            showArrow: bookingStats?.cancelledTrend && bookingStats.cancelledTrend !== "no change",
            isUp: bookingStats?.cancelledTrend === "increase",
            hasData: bookingStats !== null,
        },
        {
            title: "Total Workers",
            count: workerStats?.count || 0,
            icon: <FaUsers />,
            borderColor: "#1FA2FF",
            percentage: workerStats?.percentage_change || 0,
            showArrow: workerStats?.trend && workerStats.trend !== "no_change",
            isUp: workerStats?.trend === "increase",
            hasData: workerStats !== null,
        },
    ];

    // Helper function to check if we have data for the selected year
    const hasDataForSelectedYear = (stats, year) => {
        if (!stats || !stats.monthlyStats) return false;
        return Object.keys(stats.monthlyStats).some((monthKey) =>
            monthKey.startsWith(year)
        );
    };


    // Prepare area chart data
    // Update prepareAreaData function
    const prepareAreaData = () => {
        const allMonthsData = [];
        const currentDate = new Date();
        const currentYearNum = currentDate.getFullYear();
        const currentMonthNum = currentDate.getMonth(); // 0-11 for array index

        // Get the months that actually have data
        const monthsWithData = monthlyStats?.monthlyStats
            ? Object.keys(monthlyStats.monthlyStats)
                .filter(key => key.startsWith(analyticsYear))
                .map(key => parseInt(key.split('-')[1]) - 1) // convert to 0-11 index
            : [];

        // Find the last month with data
        const lastDataMonth = monthsWithData.length > 0
            ? Math.max(...monthsWithData)
            : -1;

        // Determine the last month to show (either current month or last data month)
        const lastMonthToShow = analyticsYear === currentYearNum.toString()
            ? Math.min(currentMonthNum, lastDataMonth)
            : lastDataMonth;

        for (let i = 0; i < 12; i++) {
            const monthKey = `${analyticsYear}-${String(i + 1).padStart(2, '0')}`;
            const hasData = monthlyStats?.monthlyStats?.[monthKey];
            const isCurrent = analyticsYear === currentYearNum.toString() && i === currentMonthNum;

            const monthData = {
                month: months[i].substring(0, 3),
                percentage: hasData ? monthlyStats.monthlyStats[monthKey].percentage : null, // Use null instead of 0
                services: hasData ? monthlyStats.monthlyStats[monthKey].bookingsCount : null,
                active: i <= lastMonthToShow, // Only active up to last month to show
                isCurrent: isCurrent,
                hasData: !!hasData
            };

            allMonthsData.push(monthData);
        }

        return allMonthsData;
    };

    const areaData = prepareAreaData();


    // Prepare most booking services data
    const prepareProductData = () => {
        if (!productStats) return [];
        return Object.entries(productStats)
            .map(([productKey, data]) => ({
                productName: data.productName,
                totalBookings: data.totalBookings,
                percentage: data.percentage,
            }))
            .sort((a, b) => b.percentage - a.percentage);
    };


    const productData = prepareProductData();


    // Custom Tooltip for Area Chart
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            const currentData = payload[0].payload;
            const index = areaData.findIndex((data) => data.month === label);
            let previousPercentage =
                index > 0 ? areaData[index - 1].percentage : currentData.percentage;
            let isUp = currentData.percentage >= previousPercentage;
            let arrowColor = isUp ? "#22EC07" : "#F00";


            return (
                <div
                    className="custom-tooltip p-2"
                    style={{
                        backgroundColor: "white",
                        border: "1px solid #ddd",
                        borderRadius: "5px",
                    }}
                >
                    <div>
                        {isUp ? (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="8"
                                height="15"
                                viewBox="0 0 8 15"
                                fill="none"
                            >
                                <path
                                    d="M3.64645 0.646446C3.84171 0.451184 4.15829 0.451184 4.35355 0.646446L7.53553 3.82843C7.7308 4.02369 7.7308 4.34027 7.53553 4.53553C7.34027 4.7308 7.02369 4.7308 6.82843 4.53553L4 1.70711L1.17157 4.53553C0.97631 4.7308 0.659728 4.7308 0.464466 4.53553C0.269203 4.34027 0.269203 4.02369 0.464466 3.82843L3.64645 0.646446ZM3.5 15L3.5 1L4.5 1L4.5 15L3.5 15Z"
                                    fill={arrowColor}
                                />
                            </svg>
                        ) : (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="8"
                                height="15"
                                viewBox="0 0 8 15"
                                fill="none"
                            >
                                <path
                                    d="M3.64645 14.3536C3.84171 14.5488 4.15829 14.5488 4.35355 14.3536L7.53553 11.1716C7.7308 10.9763 7.7308 10.6597 7.53553 10.4645C7.34027 10.2692 7.02369 10.2692 6.82843 10.4645L4 13.2929L1.17157 10.4645C0.97631 10.2692 0.659728 10.2692 0.464466 10.4645C0.269203 10.6597 0.269203 10.9763 0.464466 11.1716L3.64645 14.3536ZM3.5 0L3.5 14L4.5 14L4.5 0L3.5 0Z"
                                    fill={arrowColor}
                                />
                            </svg>
                        )}
                        <span className="ms-2">{currentData.percentage}%</span>,{" "}
                        <span>{currentData.services} Services</span>
                    </div>
                </div>
            );
        }
        return null;
    };


    // Function to retry all data fetches
    const retryAllData = () => {
        fetchStatsData();
        fetchAnalyticsData();
        fetchProductData();
    };


    return (
        <>
            <Header />
            <div>
                {networkError ? (
                    <div
                        className="text-center "
                        style={{ width: "60%", margin: "auto", marginTop: "100px" }}
                    >
                        <div className="alert alert-danger">
                            <div className="mb-3">
                                <i className="bi bi-wifi-off" style={{ fontSize: "2rem" }}></i>
                            </div>
                            <p>{error}</p>
                            <button
                                className="btn mt-2"
                                style={{ backgroundColor: "#0076CE", color: "white" }}
                                onClick={retryAllData}
                            >
                                Retry
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="container p-5">
                        {/* ✅ Manage Service Header with Year Dropdown */}
                        <div
                            className="d-flex justify-content-between align-items-center mb-3"
                            style={{ marginTop: "50px" }}
                        >
                            <h4>Manage Service</h4>
                            <select
                                className="form-select w-auto shadow-none"
                                value={selectedYear}
                                onChange={(e) => setSelectedYear(e.target.value)}
                            >
                                {years.map((year) => (
                                    <option key={year} value={year}>
                                        {year}
                                    </option>
                                ))}
                            </select>
                        </div>


                        {/* ✅ Cards Section */}
                        <div className="row mb-0">
                            {loadingStats
                                ? [...Array(4)].map((_, index) => (
                                    <div key={index} className="col-md-3">
                                        <CardSkeleton />
                                    </div>
                                ))
                                : stats.map((stat, index) => (
                                    <div key={index} className="col-md-3">
                                        <div
                                            className="card mb-2"
                                            style={{
                                                borderTop: `4px solid ${stat.borderColor}`,
                                                height: "140px",
                                            }}
                                        >
                                            <div className="card-body p-2">
                                                <div className="display-6 mb-1">{stat.icon}</div>
                                                <h3 className="mb-1">{stat.count}</h3>
                                                <div className="d-flex justify-content-between">
                                                    <h6 className="card-title fw-normal">
                                                        {stat.title}
                                                    </h6>
                                                    <div className="d-flex align-items-center gap-2">
                                                        {stat.hasData && stat.showArrow ? (
                                                            <img
                                                                className="mb-3"
                                                                src={stat.isUp ? uparrow : downarrow}
                                                                alt=""
                                                                height={15}
                                                                width={15}
                                                            />
                                                        ) : null}
                                                        <p>{stat.percentage}%</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                        </div>


                        {/* ✅ Two Column Row: Analytics & Most Booking Services */}
                        <div className="row mt-2">
                            {/* 🔹 Analytics Section */}
                            <div className="col-md-7">
                                <div className="d-flex justify-content-between align-items-center">
                                    <h4>Analytics</h4>
                                    <select
                                        className="form-select w-auto mb-2 shadow-none"
                                        value={analyticsYear}
                                        onChange={(e) => setAnalyticsYear(e.target.value)}
                                    >
                                        {years.map((year) => (
                                            <option key={year} value={year}>
                                                {year}
                                            </option>
                                        ))}
                                    </select>
                                </div>


                                {loadingAnalytics ? (
                                    <ChartSkeleton />
                                ) : (
                                    <div className="card" style={{ height: "325px" }}>
                                        {hasDataForSelectedYear(monthlyStats, analyticsYear) ? (
                                            <>
                                                {monthlyStats?.highestBookingMonth &&
                                                    monthlyStats.highestBookingMonth.month.startsWith(
                                                        analyticsYear
                                                    ) && (
                                                        <h6 className="mb-3 text-muted ms-5">
                                                            Highest Service Month:{" "}
                                                            <strong>
                                                                {
                                                                    months[
                                                                    parseInt(
                                                                        monthlyStats.highestBookingMonth.month.split(
                                                                            "-"
                                                                        )[1]
                                                                    ) - 1
                                                                    ]
                                                                }{" "}
                                                                - {monthlyStats.highestBookingMonth.percentage}%,
                                                                {
                                                                    monthlyStats.highestBookingMonth.bookingsCount
                                                                }{" "}
                                                                Services
                                                            </strong>
                                                        </h6>
                                                    )}
                                                <ResponsiveContainer width="120%" height={340}>
                                                    <AreaChart
                                                        data={areaData}
                                                        margin={{ top: 10 }}
                                                        style={{ height: "280px", marginLeft: "-70px" }}
                                                    >
                                                        <defs>
                                                            <linearGradient
                                                                id="colorUv"
                                                                x1="0"
                                                                y1="0"
                                                                x2="0"
                                                                y2="1"
                                                            >
                                                                <stop
                                                                    offset="5%"
                                                                    stopColor="#1782D2"
                                                                    stopOpacity={0.8}
                                                                />
                                                                <stop
                                                                    offset="95%"
                                                                    stopColor="#1782D2"
                                                                    stopOpacity={0}
                                                                />
                                                            </linearGradient>
                                                        </defs>
                                                        <XAxis
                                                            dataKey="month"
                                                            ticks={areaData
                                                                .filter(month => month.active)
                                                                .map(item => item.month)
                                                            }
                                                        />
                                                        <YAxis
                                                            domain={[0, 100]}
                                                            ticks={[
                                                                0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100,
                                                            ]}
                                                            interval={0}
                                                        />
                                                        <Tooltip content={<CustomTooltip />} />
                                                        <Area
                                                            type="spline"
                                                            dataKey="percentage"
                                                            stroke="#1782D2"
                                                            fillOpacity={1}
                                                            fill="url(#colorUv)"
                                                            connectNulls={false} // This will stop the line at the last data point
                                                            activeDot={(props) => {
                                                                const { payload } = props;
                                                                return payload.hasData ? (
                                                                    <circle
                                                                        cx={props.cx}
                                                                        cy={props.cy}
                                                                        r={payload.isCurrent ? 8 : 6}
                                                                        fill="#1782D2"
                                                                        stroke="#fff"
                                                                        strokeWidth={2}
                                                                        style={{
                                                                            filter: 'drop-shadow(0px 0px 4px rgba(23, 130, 210, 0.8))',
                                                                            animation: payload.isCurrent ? 'pulse 1.5s infinite' : 'none',
                                                                            display: payload.active ? 'block' : 'none'
                                                                        }}
                                                                    />
                                                                ) : null;
                                                            }}
                                                            dot={(props) => {
                                                                const { payload } = props;
                                                                return payload.hasData && payload.active ? (
                                                                    <circle
                                                                        cx={props.cx}
                                                                        cy={props.cy}
                                                                        r={4}
                                                                        fill="#1782D2"
                                                                        stroke="#fff"
                                                                        strokeWidth={1}
                                                                    />
                                                                ) : null;
                                                            }}
                                                        />
                                                    </AreaChart>
                                                </ResponsiveContainer>
                                            </>
                                        ) : (
                                            <div
                                                className="d-flex justify-content-center align-items-center"
                                                style={{ height: "100%" }}
                                            >
                                                <div className="text-center">
                                                    <h5>No data available for {analyticsYear}</h5>
                                                    <p className="text-muted">
                                                        Please select another year
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>


                            {/* 🔹 Most Booking Services Section */}
                            <div className="col-md-5">
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <h4 className="fs-5">Most Booking Services</h4>
                                    <div className="d-flex">
                                        <select
                                            className="form-select me-2 w-auto shadow-none"
                                            value={mostBookingMonth}
                                            onChange={(e) => setMostBookingMonth(e.target.value)}
                                        >
                                            {months.map((month, index) => (
                                                <option key={index + 1} value={index + 1}>
                                                    {month}
                                                </option>
                                            ))}
                                        </select>
                                        <select
                                            className="form-select w-auto shadow-none"
                                            value={mostBookingYear}
                                            onChange={(e) => setMostBookingYear(e.target.value)}
                                        >
                                            {years.map((year) => (
                                                <option key={year} value={year}>
                                                    {year}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>


                                {loadingProducts ? (
                                    <TableSkeleton />
                                ) : (
                                    <div
                                        className="card p-2"
                                        style={{ height: "325px", overflow: "hidden" }}
                                    >
                                        <div style={{ height: "290px", overflowY: "auto" }}>
                                            <table
                                                className="table table-borderless"
                                                style={{ width: "100%" }}
                                            >
                                                <thead
                                                    style={{
                                                        position: "sticky",
                                                        top: 0,
                                                        background: "#fff",
                                                        zIndex: 10,
                                                    }}
                                                >
                                                    <tr style={{ lineHeight: "0.7" }}>
                                                        <th className="text-muted">Service Name</th>
                                                        <th className="text-muted">Services</th>
                                                        <th className="text-muted">Booking (%)</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {productData.map((product, index) => (
                                                        <tr key={index}>
                                                            <td>
                                                                {index + 1}. {product.productName}
                                                            </td>
                                                            <td>{product.totalBookings}</td>
                                                            <td>{product.percentage.toFixed(2)}%</td>
                                                        </tr>
                                                    ))}
                                                    {productData.length === 0 && (
                                                        <tr className="text-center">
                                                            <td colSpan="12">No data available</td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};


export default Dashboard;