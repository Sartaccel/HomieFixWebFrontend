import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import searchIcon from "../assets/Search.png";

const SearchBar = () => {
  const [keyword, setKeyword] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (keyword.trim() === "") {
        setSuggestions([]);
        setHasSearched(false);
        return;
      }

      setIsLoading(true);
      setHasSearched(true);
      try {
        const response = await api.get(
          `/search?keyword=${encodeURIComponent(keyword)}`
        );
        const formattedSuggestions = formatSuggestions(response.data);
        setSuggestions(formattedSuggestions);
        setShowSuggestions(true);
      } catch (error) {
        console.error("Error fetching search suggestions:", error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      fetchSuggestions();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [keyword]);

  const formatSuggestions = (data) => {
    const workerSuggestions =
      data.workerIds?.map((worker) => ({
        type: "worker",
        id: worker.id,
        ...worker,
      })) || [];

    const bookingSuggestions =
      data.bookingIds?.map((booking) => ({
        type: "booking",
        id: booking.id,
        ...booking,
      })) || [];

    return [...workerSuggestions, ...bookingSuggestions];
  };

  const handleSuggestionClick = (suggestion) => {
    if (suggestion.type === "worker") {
      navigate(`/worker-details/worker/${suggestion.id}`);
    } else if (suggestion.type === "booking") {
      if (suggestion.status === "PENDING") {
        navigate(`/booking-details/assign-bookings/${suggestion.id}`);
      } else {
        navigate(`/booking-details/view-bookings/${suggestion.id}`);
      }
    }
    setShowSuggestions(false);
    setKeyword("");
  };

  const highlightMatch = (text) => {
    if (!text || !keyword) return text;

    const regex = new RegExp(`(${keyword})`, "gi");
    return text
      .toString()
      .split(regex)
      .map((part, index) =>
        part.toLowerCase() === keyword.toLowerCase() ? (
          <span key={index} className="text-primary fw-bold">
            {part}
          </span>
        ) : (
          part
        )
      );
  };

  const renderSuggestionContent = (item) => {
    const excludedFields = ["type", "id", "status"];
    const keys = Object.keys(item).filter(
      (key) => !excludedFields.includes(key)
    );

    return (
      <div>
        <div className="d-flex justify-content-between">
          <strong>
            {item.type === "worker" ? "Worker: " : "Booking: "}
            {highlightMatch(item.name || item.id)}
          </strong>
          {item.status && (
            <small
              className={`badge bg-${
                item.status === "PENDING" ? "warning" : "secondary"
              }`}
            >
              {item.status}
            </small>
          )}
        </div>

        {keys.map((key) => (
          <div key={key} className="text-muted small">
            <span className="text-capitalize">
              {key.replace(/([A-Z])/g, " $1").trim()}:{" "}
            </span>
            {highlightMatch(item[key])}
          </div>
        ))}
      </div>
    );
  };

  const SkeletonLoader = () => (
    <div className="p-2">
      {[...Array(3)].map((_, index) => (
        <div key={index} className="mb-3">
          <div className="d-flex justify-content-between mb-2">
            <div
              className="skeleton-text"
              style={{ width: "120px", height: "16px" }}
            ></div>
            <div
              className="skeleton-text"
              style={{ width: "50px", height: "16px" }}
            ></div>
          </div>
          <div
            className="skeleton-text mb-1"
            style={{ width: "100%", height: "14px" }}
          ></div>
          <div
            className="skeleton-text"
            style={{ width: "80%", height: "14px" }}
          ></div>
        </div>
      ))}
    </div>
  );

  return (
    <div
      className="position-relative"
      ref={searchRef}
      style={{ width: "300px", zIndex: 1155 }}
    >
      <div className="position-relative">
        <input
          type="text"
          className="form-control search-bar shadow-none pe-5" // Add padding-end for icon space
          placeholder="Search workers or bookings"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onFocus={() => setShowSuggestions(true)}
          style={{ paddingRight: "2.5rem" }}
        />
        <img
          src={searchIcon}
          alt="Search"
          width="20"
          style={{
            position: "absolute",
            right: "10px",
            top: "50%",
            transform: "translateY(-50%)",
            pointerEvents: "none",
          }}
        />
      </div>

      {showSuggestions &&
        keyword.trim() !== "" &&
        (isLoading || suggestions.length > 0 || hasSearched) && (
          <div
            className="position-absolute bg-white rounded shadow-lg mt-1 w-100"
            style={{
              zIndex: 1050,
              maxHeight: "400px",
              overflowY: "auto",
              border: "1px solid rgba(0,0,0,.15)",
            }}
          >
            {isLoading ? (
              <SkeletonLoader />
            ) : (
              <ul className="list-unstyled mb-0">
                {suggestions.length > 0
                  ? suggestions.map((item) => (
                      <li
                        key={`${item.type}-${item.id}`}
                        className="p-2 border-bottom cursor-pointer hover-bg"
                        onClick={() => handleSuggestionClick(item)}
                        style={{ cursor: "pointer" }}
                      >
                        {renderSuggestionContent(item)}
                      </li>
                    ))
                  : hasSearched && (
                      <li className="p-3 text-center text-muted">
                        No results found for "{keyword}"
                      </li>
                    )}
              </ul>
            )}
          </div>
        )}
    </div>
  );
};

export default SearchBar;
