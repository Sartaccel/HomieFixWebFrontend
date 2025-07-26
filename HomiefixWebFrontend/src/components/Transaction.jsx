import Header from "./Header";
import { useNavigate } from "react-router-dom";
import profile from "../assets/Fan.png";

const Transaction = () => {

    const navigate = useNavigate();

    const details = [
        {
            id: 1,
            transactionId: "12345",
            amount: "1000",
            date: "26/07/2025",
            time: "10:00am",
            userName: "John Doe",
            orderId: "123",
            paymentGateway: "Razorpay",
            status: "paid",
            image: profile,
            serviceName: "Fan Repair",
            phoneNumber: "9327483264",
            address: "123 Main St, City, State, Country",
            bookingDate: "Jul 26, 2025",
            bookingTime: "10:00 AM - 12:00 PM",
            rating: 4.5,
            notes: "Our expert AC repair service specializes in diagnosing and fixing common issues like insufficient cooling, strange noises, and frequent cycling. We ensure your home stays comfortable all summer long!"
        },
    ];

    return (
        <div>
            <Header />
            <div className="container pt-5" style={{ paddingTop: "80px" }}>
                <div
                    className="d-flex justify-content-between align-items-center mb-3 mt-4"
                    style={{ marginRight: "30px" }}
                >
                    <button
                        className="btn btn-light p-0 ms-2 mt-2"
                        style={{ height: "50px", width: "40px" }}
                        onClick={() => navigate(`/transaction-details`)}
                    >
                        <i
                            className="bi bi-arrow-left"
                            style={{ fontSize: "1.5rem", fontWeight: "bold" }}
                        ></i>
                    </button>
                </div>

                <div className="container border rounded p-3">
                    <div className="border rounded p-3">
                        <div className="mt-2">
                            <h4>Transaction Details</h4>
                        </div>

                        {/* Header row */}
                        <div className="row text-start fw-bold mt-4 mb-2">
                            <div className="col">Transaction ID</div>
                            <div className="col">Amount</div>
                            <div className="col">Date</div>
                            <div className="col">Time</div>
                            <div className="col">User name</div>
                            <div className="col">Order id</div>
                            <div className="col-2">Payment Gateway</div>
                            <div className="col">Status</div>
                        </div>

                        <hr style={{ margin: "0px -16px" }} className="text-muted" />

                        {/* Data row */}
                        <div className="row text-start mt-4 mb-4">
                            <div className="col">{details[0].transactionId}</div>
                            <div className="col">{details[0].amount}</div>
                            <div className="col">{details[0].date}</div>
                            <div className="col">{details[0].time}</div>
                            <div className="col">{details[0].userName}</div>
                            <div className="col">{details[0].orderId}</div>
                            <div className="col-2">{details[0].paymentGateway}</div>
                            <div className="col text-success">{details[0].status}</div>
                        </div>

                        <hr style={{ margin: "0px -16px" }} className="text-muted" />


                        <div className="row mt-4">
                            <div className="col">
                                <h5>Service Details</h5>
                                <div className="d-flex p-2 mt-4 gap-2">
                                    <div>
                                        <img src={details[0].image} alt="" height={50} width={50} />
                                    </div>
                                    <div className="">
                                        <p>{details[0].serviceName} - ₹{details[0].amount} <span style={{ color: "#0076CE" }}>ID : {details[0].id}</span></p>

                                        <div className="px-2">
                                            <p>Customer Details</p>
                                            <p><i className="bi bi-person"></i> {details[0].userName}</p>
                                            <p><i className="bi bi-telephone"></i> {details[0].phoneNumber}</p>
                                            <p><i className="bi bi-calendar"></i> {details[0].bookingDate} | {details[0].bookingTime}</p>
                                            <p><i className="bi bi-geo-alt"></i> {details[0].address}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col">
                                <h5>Worker Details</h5>
                                <div className="d-flex p-2 mt-4 gap-2">
                                    <div>
                                        <img src={details[0].image} alt="" height={50} width={50} />
                                    </div>
                                    <div className="">

                                        <div className="px-2">
                                            <p><i className="bi bi-person"></i> {details[0].userName} <span className="bg-light p-1"> <i className="bi bi-star-fill text-warning"></i> {details[0].rating}</span></p>
                                            <p><i className="bi bi-telephone"></i> {details[0].phoneNumber}</p>
                                            <p><i className="bi bi-geo-alt"></i> {details[0].address}</p>
                                            <a className="mx-4" href="" style={{ color: "#0076CE", textDecoration: "none" }} onClick={() => navigate(`/worker-details`)}>View full profile  &gt; </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="row mt-4 mb-4 p-2 mx-2">
                            <div className="col border p-3 rounded">
                                <div className="row">
                                    <div className="col text-start text-muted">
                                        Notes
                                    </div>
                                    <div className="col text-end" style={{ color: "#0076CE" }}>
                                        Edit
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col">
                                        <p>{details[0].notes}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col text-end " style={{ marginTop: "100px" }}>
                                <button className="btn w-40" style={{ backgroundColor: "#0076CE", color: "white" }}>Download Invoice <i className="bi bi-download"></i></button>
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
}

export default Transaction;