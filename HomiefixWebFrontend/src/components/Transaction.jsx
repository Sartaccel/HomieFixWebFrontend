import Header from "./Header";
import { useNavigate, useParams } from "react-router-dom";
import profile from "../assets/Fan.png";
import React, { useState, useEffect } from "react";
import api from "../api";
import addWorker from "../assets/addWorker.jpg";
import { Link } from "react-router-dom";
import moment from "moment";
import HomieFixLogo from "../assets/HomieFixLogo.png";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import {
  PDFDownloadLink,
  Document,
  Page,
  View,
  Text,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

const Transaction = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [bookingData, setBookingData] = useState(null);
  const [workerRating, setWorkerRating] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedUsers, setSelectedUsers] = useState([]);

  // For Fetch the data
  useEffect(() => {
    api
      .get(`/booking/all`)
      .then((response) => {
        const allBookings = response.data;
        const selectedBooking = allBookings.find(
          (booking) => booking.id === Number(id)
        );
        setBookingData(selectedBooking);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  }, [id]);

  useEffect(() => {
    if (bookingData) {
    }
  }, [bookingData]);

  //For Worker rating
  useEffect(() => {
    if (bookingData?.worker?.id) {
      api
        .get(`/workers/view/${bookingData.worker.id}`)
        .then((res) => {
          setWorkerRating(res.data);
        })
        .catch((err) => {
          console.error("Error fetching worker rating:", err);
        });
    }
  }, [bookingData?.worker?.id]);

  const formatDateAndTime = (isoString) => {
    if (!isoString) return { date: "N/A", time: "N/A" };

    const [datePart, timePart] = isoString.split("T");
    const [year, month, day] = datePart.split("-");
    const [hour, minute] = timePart.slice(0, 5).split(":");

    let hr = parseInt(hour, 10);
    const ampm = hr >= 12 ? "PM" : "AM";
    hr = hr % 12 || 12;

    const formattedTime = `${hr}:${minute} ${ampm}`;

    return {
      date: `${day}-${month}-${year}`,
      time: formattedTime,
    };
  };

  const { date, time } = formatDateAndTime(bookingData?.paymentCapturedAt);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const [year, month, day] = dateString.split("-");
    return `${day}-${month}-${year}`;
  };

  const InvoicePDFDocument = () => {
    // PDF Styles
    const styles = StyleSheet.create({
      page: {
        padding: 30,
        fontFamily: "Helvetica",
      },
      header: {
        fontSize: 18,
        marginBottom: 10,
        fontWeight: "bold",
        textAlign: "center",
      },
      table: {
        display: "table",
        width: "90%",
        borderStyle: "solid",
        borderWidth: 1,
        borderRightWidth: 0,
        borderBottomWidth: 0,
        marginLeft: "35px",
        marginTop: "25px",
      },
      tableRow: {
        flexDirection: "row",
      },
      tableColHeader: {
        width: "30%",
        borderStyle: "solid",
        borderWidth: 1,
        borderLeftWidth: 0,
        borderTopWidth: 0,
        color: "black",
        padding: 5,
        fontWeight: "bold",
        fontSize: 10,
      },
      tableCol: {
        width: "75%",
        borderStyle: "solid",
        borderWidth: 1,
        borderLeftWidth: 0,
        borderTopWidth: 0,
        padding: 5,
        fontSize: 10,
        color: "black",
      },
      fullWidthRow: {
        borderColor: "#000",
        padding: 4,
        fontSize: 10,
        width: "100%",
        color: "black",
        borderBottom: "1",
        borderRight: "1",
        textAlign: "center",
      },
      footer: {
        fontSize: 10,
        marginTop: 10,
        textAlign: "center",
        color: "gray",
      },
    });

    return (
      <Document>
        <Page style={styles.page}>
          <Image
            src={HomieFixLogo}
            style={{
              position: "absolute",
              top: 150,
              left: 150,
              width: 300,
              opacity: 0.2,
            }}
          />
          <Text style={styles.header}>Invoice</Text>
          <Text style={styles.footer}>
            Generated on: {moment().format("MMMM D, YYYY HH:mm")}
          </Text>

          <View style={styles.table}>
            <View style={styles.tableRow}>
              <Text style={styles.tableColHeader}>Order ID</Text>
              <Text style={styles.tableCol}>{bookingData?.orderId}</Text>
            </View>

            <View style={styles.tableRow}>
              <Text style={styles.tableColHeader}>Customer Name</Text>
              <Text style={styles.tableCol}>{bookingData?.userFullName}</Text>
            </View>

            <View style={styles.tableRow}>
              <Text style={styles.tableColHeader}>Transaction ID</Text>
              <Text style={styles.tableCol}>{bookingData?.paymentId}</Text>
            </View>

            <View style={styles.tableRow}>
              <Text style={styles.tableColHeader}>Date</Text>
              <Text style={styles.tableCol}>{date}</Text>
            </View>

            <View style={styles.tableRow}>
              <Text style={styles.tableColHeader}>Time</Text>
              <Text style={styles.tableCol}>{time}</Text>
            </View>

            <View style={styles.tableRow}>
              <Text style={styles.tableColHeader}>Amount</Text>
              <Text style={styles.tableCol}>{bookingData?.totalPrice}</Text>
            </View>

            <View style={styles.tableRow}>
              <Text style={styles.tableColHeader}>Status</Text>
              <Text style={styles.tableCol}>
                {bookingData?.paymentStatus === "CAPTURED" ? "Paid" : "Pending"}
              </Text>
            </View>

            <View style={styles.tableRow}>
              <Text style={styles.fullWidthRow}>Service Details</Text>
            </View>

            <View style={styles.tableRow}>
              <Text style={styles.tableColHeader}>Service Name</Text>
              <Text style={styles.tableCol}>{bookingData?.productName}</Text>
            </View>

            <View style={styles.tableRow}>
              <Text style={styles.fullWidthRow}>Customer Details</Text>
            </View>

            <View style={styles.tableRow}>
              <Text style={styles.tableColHeader}>Customer Name</Text>
              <Text style={styles.tableCol}>
                {bookingData?.userProfile?.fullName}
              </Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableColHeader}>Phone Number</Text>
              <Text style={styles.tableCol}>
                {bookingData?.userProfile?.mobileNumber?.mobileNumber}
              </Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableColHeader}>Booked Date</Text>
              <Text style={styles.tableCol}>
                {formatDate(bookingData?.bookedDate)}
              </Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableColHeader}>Time Slot</Text>
              <Text style={styles.tableCol}>{bookingData?.timeSlot}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableColHeader}>Address</Text>
              <Text style={styles.tableCol}>
                {bookingData?.deliveryAddress?.houseNumber},{" "}
                {bookingData?.deliveryAddress?.town},{" "}
                {bookingData?.deliveryAddress?.landmark},{" "}
                {bookingData?.deliveryAddress?.district},{" "}
                {bookingData?.deliveryAddress?.state} -{" "}
                {bookingData?.deliveryAddress?.pincode}
              </Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.fullWidthRow}>Worker Details</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableColHeader}>Name</Text>
              <Text style={styles.tableCol}>{bookingData?.worker?.name}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableColHeader}>Notes</Text>
              <Text style={styles.tableCol}>{bookingData?.notes}</Text>
            </View>
          </View>
        </Page>
      </Document>
    );
  };

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
            style={{ height: "30px", width: "30px" }}
            onClick={() => navigate(`/transaction-details`)}
          >
            <i
              className="bi bi-arrow-left"
              style={{ fontSize: "1.2rem", fontWeight: "bold" }}
            ></i>
          </button>
        </div>

        <div className="container border rounded p-2">
          <div className="border rounded p-2">
            <div>
              <h4>Transaction Details</h4>
            </div>

            {/* Header row */}
            <div className="row text-start fw-bold mt-3 mb-1">
              <div className="col-2">Transaction ID</div>
              <div className="col">Amount</div>
              <div style={{ width: "115px" }}>Date</div>
              <div className="col">Time</div>
              <div className="col-2">User name</div>
              <div className="col-2">Order id</div>
              <div className="col-2">Payment Gateway</div>
              <div className="col">Status</div>
            </div>

            <hr style={{ margin: "0px -16px" }} className="text-muted" />

            {/* Data row */}

            {loading ? (
              <div className="row text-start mt-4 mb-4">
                <div className="col-2">
                  <Skeleton height={30} width={100} />
                </div>
                <div className="col">
                  <Skeleton height={30} width={80} />
                </div>
                <div style={{ width: "115px" }}>
                  <Skeleton height={30} width={90} />
                </div>
                <div className="col">
                  <Skeleton height={30} width={60} />
                </div>
                <div className="col-2">
                  <Skeleton height={30} width={120} />
                </div>
                <div className="col-2">
                  <Skeleton height={30} width={120} />
                </div>
                <div className="col-2">
                  <Skeleton height={30} width={80} />
                </div>
                <div className="col">
                  <Skeleton height={30} width={60} />
                </div>
              </div>
            ) : (
              <div className="row text-start mt-4 mb-4">
                <div className="col-2">{bookingData?.paymentId || "N/A"}</div>
                <div className="col">{bookingData?.totalPrice || "N/A"}</div>
                <div style={{ width: "115px" }}>{date}</div>
                <div className="col">{time}</div>
                <div className="col-2">
                  {bookingData?.userProfile?.fullName || "N/A"}
                </div>
                <div className="col-2">{bookingData?.orderId || "N/A"}</div>
                <div className="col-2">Razorpay</div>
                <div className="col text-success">
                  {bookingData?.paymentStatus === "CAPTURED" ? "Paid" : "N/A"}
                </div>
              </div>
            )}

            <hr style={{ margin: "0px -16px" }} className="text-muted" />

            <div className="row mt-2">
              <div className="col">
                <h5>Service Details</h5>
                <div className="d-flex p-2 mt-2 gap-2">
                  <div>
                    <img
                      src={bookingData?.productImage || "n/sa"}
                      alt=""
                      height={50}
                      width={50}
                    />
                  </div>
                  <div className="mb-2">
                    <p>
                      {bookingData?.productName || "n/a"} - ₹
                      {bookingData?.totalPrice}{" "}
                      <span style={{ color: "#0076CE" }}>
                        ID : {bookingData?.id}
                      </span>
                    </p>

                    <div className="px-1">
                      <p className="mb-1">Customer Details</p>
                      <p className="mb-1">
                        <i className="bi bi-person"></i>{" "}
                        {bookingData?.userFullName}
                      </p>

                      {bookingData?.userProfile?.mobileNumber?.mobileNumber && (
                        <p className="mb-1">
                          <i className="bi bi-telephone"></i>
                          {bookingData.userProfile.mobileNumber.mobileNumber}
                        </p>
                      )}

                      <p className="mb-1">
                        <i className="bi bi-calendar"></i>{" "}
                        {formatDate(bookingData?.bookedDate)} |{" "}
                        {bookingData?.timeSlot}
                      </p>
                      <p className="mb-1">
                        <i className="bi bi-geo-alt"></i>{" "}
                        {bookingData?.deliveryAddress?.houseNumber},{" "}
                        {bookingData?.deliveryAddress?.town},{" "}
                        {bookingData?.deliveryAddress?.landmark},{" "}
                        {bookingData?.deliveryAddress?.district},{" "}
                        {bookingData?.deliveryAddress?.state} -{" "}
                        {bookingData?.deliveryAddress?.pincode}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-5">
                <h5>Worker Details</h5>
                <div className="d-flex p-2 mt-1 gap-2">
                  <div>
                    <img
                      src={bookingData?.worker?.profilePicUrl || addWorker}
                      alt=""
                      height={50}
                      width={50}
                    />
                  </div>
                  <div className="">
                    <div className="px-2">
                      <p className="mb-2">
                        <i className="bi bi-person"></i>{" "}
                        {bookingData?.worker?.name || "Not assigned"}{" "}
                        <span className="bg-light p-1">
                          {" "}
                          {workerRating?.averageRating}
                          <i className="bi bi-star-fill text-warning"></i>{" "}
                        </span>
                      </p>
                      {bookingData?.worker?.contactNumber && (
                        <p className="mb-1">
                          <i className="bi bi-telephone"></i>
                          {""} {bookingData.worker.contactNumber}
                        </p>
                      )}
                      <p className="mb-1">
                        <i className="bi bi-geo-alt"></i>{" "}
                        {bookingData?.worker?.houseNumber},{" "}
                        {bookingData?.worker?.town},{" "}
                        {bookingData?.worker?.landmark},{" "}
                        {bookingData?.worker?.district},{" "}
                        {bookingData?.worker?.state} -{" "}
                        {bookingData?.worker?.pincode}
                      </p>
                      {bookingData?.worker?.id && (
                        <Link
                          to={`/worker-details/worker/${bookingData.worker.id}`}
                          className="mx-4"
                          style={{ color: "#0076CE", textDecoration: "none" }}
                        >
                          View Full Profile
                        </Link>
                      )}

                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="row mt-0 mb-2 ms-2 mx-2">
              <div
                className="col border p-3 rounded"
                style={{ maxHeight: "120px" }}
              >
                <div className="row">
                  <div className="col text-start text-muted">Notes</div>
                </div>
                <div className="row">
                  <div className="col">
                    {bookingData?.notes && <p>{bookingData.notes}</p>}
                  </div>
                </div>
              </div>
              <div className="col text-end " style={{ marginTop: "50px" }}>
                <PDFDownloadLink
                  document={<InvoicePDFDocument />}
                  fileName={`Invoice-${bookingData?.userFullName}.pdf`}
                  className="btn text-light"
                  style={{
                    backgroundColor: "#0076CE",
                  }}
                >
                  {({ loading }) =>
                    loading ? "Generating PDF..." : "Download Invoice"
                  }
                </PDFDownloadLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transaction;
