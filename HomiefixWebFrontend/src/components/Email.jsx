// import React, { useState, useEffect } from "react";
// import addWorker from "../assets/addWorker.jpg";
// import Header from "./Header";
// import { useNavigate } from "react-router-dom";
// import attachFile from "../assets/attachFile.svg";
// import searchIcon from "../assets/Search.png";
// import Skeleton from "react-loading-skeleton";
// import "react-loading-skeleton/dist/skeleton.css";
// import api from "../api";
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import Swal from "sweetalert2";

// const Email = () => {
//   const navigate = useNavigate();
//   const [keyword, setKeyword] = useState("");
//   const [users, setUsers] = useState([]);
//   const [selectedUsers, setSelectedUsers] = useState([]);
//   const [pendingUsers, setPendingUsers] = useState([]);
//   const [subject, setSubject] = useState("");
//   const [content, setContent] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [expandedBcc, setExpandedBcc] = useState(false);
//   const [attachments, setAttachments] = useState([]);
//   const [isSending, setIsSending] = useState(false);
//   const [errorMessage, setErrorMessage] = useState("");


//   // Allowed file types
//   const allowedFileTypes = ["pdf", "jpg", "jpeg", "png"];
//   const allowedFileTypesString = allowedFileTypes.join(", ").toUpperCase();


//   // Fetch all users
//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const response = await api.get("/profile/all");
//         setUsers(response.data);
//         setLoading(false);
//       } catch (error) {
//         console.error("Error fetching users:", error);
//         setLoading(false);
//         setErrorMessage("Failed to load users. Please try again.");
//       }
//     };


//     fetchUsers();
//   }, []);


//   // Filter users based on search keyword
//   const filteredUsers = users.filter(
//     (user) =>
//       user.fullName.toLowerCase().includes(keyword.toLowerCase()) &&
//       !selectedUsers.some((selectedUser) => selectedUser.id === user.id)
//   );


//   // Handle user selection
//   const handleUserSelect = (user) => {
//     const isSelected = pendingUsers.some(
//       (pendingUser) => pendingUser.id === user.id
//     );


//     if (isSelected) {
//       setPendingUsers(
//         pendingUsers.filter((pendingUser) => pendingUser.id !== user.id)
//       );
//     } else {
//       setPendingUsers([...pendingUsers, user]);
//     }
//   };


//   // Handle adding pending users to BCC
//   const handleAddUsers = () => {
//     setSelectedUsers([...selectedUsers, ...pendingUsers]);
//     setPendingUsers([]);
//     setKeyword("");
//   };


//   // Handle removing a selected user from BCC
//   const handleRemoveUser = (userId) => {
//     setSelectedUsers(selectedUsers.filter((user) => user.id !== userId));
//   };


//   // Reset form
//   const handleNewMessage = () => {
//     setSelectedUsers([]);
//     setPendingUsers([]);
//     setSubject("");
//     setContent("");
//     setKeyword("");
//     setExpandedBcc(false);
//     setAttachments([]);
//     setErrorMessage("");
//   };


//   // Handle file attachment
//   const handleFileChange = (e) => {
//     const files = Array.from(e.target.files);
//     const invalidFiles = files.filter(
//       (file) => !allowedFileTypes.some((type) => file.name.toLowerCase().endsWith(`.${type}`))
//     );


//     if (invalidFiles.length > 0) {
//       setErrorMessage(`Only ${allowedFileTypesString} files are allowed`);
//       return;
//     }


//     setAttachments([...attachments, ...files]);
//     setErrorMessage("");
//   };

//   //Handling the sent 
//   const handleSend =(e) =>
//   {
//     if(selectedUsers==0)
//     {
//       toast.error("Please select one receiptent")
//     }
//   }

//   // Handle removing an attachment
//   const handleRemoveAttachment = (index) => {
//     const newAttachments = [...attachments];
//     newAttachments.splice(index, 1);
//     setAttachments(newAttachments);
//   };





//     const formData = new FormData();
//     formData.append("subject", subject);
//     formData.append("content", content);

//     // Append userIds as comma-separated string
//     const userIds = selectedUsers.map(user => user.id).join(',');
//     formData.append("userIds", userIds);

//     // Append each attachment with the correct field name "attachment"
//     attachments.forEach((file) => {
//       formData.append("attachment", file); // Note: using "attachment" not "attachments"
//     });


//     try {
//       const response = await api.post(
//         "/profile/send-bulk-email",
//         formData,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );


//       toast.success("Email sent successfully!", {
//         position: "top-right",
//         autoClose: 3000,
//         hideProgressBar: false,
//         closeOnClick: true,
//         pauseOnHover: true,
//         draggable: true,
//       });


//       handleNewMessage();
//     } catch (error) {
//       console.error("Error sending email:", error);
//       setErrorMessage(
//         error.response?.data?.message ||
//           "Failed to send email. Please try again."
//       );
//     } finally {
//       setIsSending(false);
//     }
//   };


//   return (
//     <div className="container-fluid m-0 p-0 vh-100 w-100">
//       <ToastContainer />
//       <div className="row m-0 p-0 vh-100">
//         <main className="col-12 p-0 m-0 d-flex flex-column">
//           <Header />


//           <div className="container-fluid p-3 flex-grow-1 d-flex">
//             {/* Left Container - User Selection */}
//             <div
//               className="border rounded p-3 me-3"
//               style={{
//                 width: "350px",
//                 height: "580px",
//                 marginTop: "80px",
//                 flexShrink: 0,
//               }}
//             >
//               {/* Search bar */}
//               <div className="position-relative mb-3">
//                 {loading ? (
//                   <Skeleton height={38} />
//                 ) : (
//                   <>
//                     <input
//                       type="text"
//                       className="form-control search-bar shadow-none pe-5"
//                       placeholder="Search"
//                       value={keyword}
//                       onChange={(e) => setKeyword(e.target.value)}
//                       style={{
//                         paddingRight: "2.5rem",
//                         border: "#a8a8a886 1px solid",
//                       }}
//                     />
//                     <img
//                       src={searchIcon}
//                       alt="Search"
//                       width="20"
//                       style={{
//                         position: "absolute",
//                         right: "10px",
//                         top: "50%",
//                         transform: "translateY(-50%)",
//                         pointerEvents: "none",
//                       }}
//                     />
//                   </>
//                 )}
//               </div>


//               {/* Select All and Count Row */}
//               <div className="d-flex justify-content-between align-items-center mb-3">
//                 {loading ? (
//                   <Skeleton width={100} />
//                 ) : (
//                   <>
//                     <div className="form-check">
//                       <input
//                         className="form-check-input shadow-none "
//                         style={{ border: "#a8a8a886 1px solid", cursor: "pointer" }}
//                         type="checkbox"
//                         id="selectAll"
//                         checked={
//                           filteredUsers.length > 0 &&
//                           filteredUsers.every((user) =>
//                             pendingUsers.some(
//                               (pendingUser) => pendingUser.id === user.id
//                             )
//                           )
//                         }
//                         onChange={() => {
//                           const allSelected = filteredUsers.every((user) =>
//                             pendingUsers.some(
//                               (pendingUser) => pendingUser.id === user.id
//                             )
//                           );
//                           if (allSelected) {
//                             setPendingUsers(
//                               pendingUsers.filter(
//                                 (pendingUser) =>
//                                   !filteredUsers.some(
//                                     (user) => user.id === pendingUser.id
//                                   )
//                               )
//                             );
//                           } else {
//                             const usersToAdd = filteredUsers.filter(
//                               (user) =>
//                                 !pendingUsers.some(
//                                   (pendingUser) => pendingUser.id === user.id
//                                 )
//                             );
//                             setPendingUsers([...pendingUsers, ...usersToAdd]);
//                           }
//                         }}
//                       />
//                     </div>
//                     <span className="text-muted small">
//                       {pendingUsers.length} selected
//                     </span>
//                   </>
//                 )}
//               </div>


//               <div style={{ height: "calc(100% - 150px)", overflowY: "auto" }}>
//                 {loading ? (
//                   Array(5).fill().map((_, index) => (
//                     <div key={index} className="d-flex align-items-center mb-2">
//                       <div className="me-2">
//                         <Skeleton circle width={20} height={20} />
//                       </div>
//                       <div className="card p-2 flex-grow-1 d-flex flex-row align-items-center">
//                         <Skeleton circle width={40} height={40} className="me-2" />
//                         <div style={{ width: '100%' }}>
//                           <Skeleton width={`80%`} height={20} />
//                           <Skeleton width={`60%`} height={16} />
//                         </div>
//                       </div>
//                     </div>
//                   ))
//                 ) : filteredUsers.length === 0 ? (
//                   <p className="text-center text-muted">
//                     {keyword.trim() ? "No matching users found" : "No users available"}
//                   </p>
//                 ) : (
//                   filteredUsers.map((user) => (
//                     <div
//                       key={user.id}
//                       className="d-flex align-items-center mb-2"
//                     >
//                       <div className="me-2">
//                         <input
//                           className="form-check-input shadow-none"
//                           style={{
//                             border: "#a8a8a86f 1px solid",
//                             cursor: "pointer",
//                           }}
//                           type="checkbox"
//                           checked={pendingUsers.some(
//                             (pendingUser) => pendingUser.id === user.id
//                           )}
//                           onChange={() => handleUserSelect(user)}
//                           onClick={(e) => e.stopPropagation()}
//                         />
//                       </div>


//                       <div
//                         className="card p-2 flex-grow-1 d-flex flex-row align-items-center"
//                         style={{ cursor: "pointer" }}
//                         onClick={() => handleUserSelect(user)}
//                       >
//                         <img
//                           src={addWorker}
//                           alt={user.fullName}
//                           className="rounded-circle me-2"
//                           width="40"
//                           height="40"
//                         />
//                         <div>
//                           <h6 className="mb-0">{user.fullName}</h6>
//                           <small className="text-muted">
//                             {user.addresses?.[0]?.town},{" "}
//                             {user.addresses?.[0]?.pincode}
//                           </small>
//                         </div>
//                       </div>
//                     </div>
//                   ))
//                 )}
//               </div>


//               <div className="mt-3">
//                 {loading ? (
//                   <Skeleton width={70} height={35} style={{ marginLeft: "240px" }} />
//                 ) : (
//                   <button
//                     className="btn w-10"
//                     style={{
//                       backgroundColor: "#0076CE",
//                       color: "white",
//                       marginLeft: "240px",
//                       fontSize: "13px",
//                       height: "35px",
//                       width: "70px",
//                     }}
//                     onClick={handleAddUsers}
//                     disabled={pendingUsers.length === 0}
//                   >
//                     Add
//                   </button>
//                 )}
//               </div>
//             </div>


//             {/* Right Container - Email Composition */}
//             <div
//               className="border rounded p-3 flex-grow-1 d-flex flex-column"
//               style={{
//                 height: "580px",
//                 marginTop: "80px",
//                 flexShrink: 0,
//                 width: "100px",
//                 overflowY: "auto",
//               }}
//             >
//               <div className="d-flex justify-content-between align-items-center mb-4">
//                 {loading ? (
//                   <Skeleton width={120} height={30} />
//                 ) : (
//                   <>
//                     <h5>New Message</h5>
//                     <button
//                       className="btn"
//                       style={{ backgroundColor: "#0076CE", color: "white" }}
//                       onClick={handleNewMessage}
//                     >
//                       New Message
//                     </button>
//                   </>
//                 )}
//               </div>


//               {errorMessage && (
//                 <div className="alert alert-danger">{errorMessage}</div>
//               )}


//               <form
//                 onSubmit={handleSubmit}
//                 className="flex-grow-1 d-flex flex-column"
//               >
//                 {/* BCC Field */}
//                 <div className="mb-3">
//                   {loading ? (
//                     <Skeleton height={64} />
//                   ) : (
//                     <div
//                       className="form-control p-2 shadow-none"
//                       style={{
//                         maxHeight: expandedBcc ? "none" : "64px",
//                         overflow: "hidden",
//                         display: "flex",
//                         flexDirection: "row",
//                         flexWrap: "nowrap",
//                       }}
//                     >
//                       <div
//                         style={{
//                           flex: "0 0 50px",
//                           color: "#6c757d",
//                           display: "flex",
//                           alignItems: "flex-start",
//                         }}
//                       >
//                         To
//                       </div>


//                       <div
//                         style={{
//                           flex: "1",
//                           display: "flex",
//                           flexWrap: "wrap",
//                           gap: "6px",
//                           marginTop: "-4px",
//                         }}
//                       >
//                         {selectedUsers.length > 0 ? (
//                           <>
//                             {selectedUsers
//                               .slice(0, expandedBcc ? selectedUsers.length : 15)
//                               .map((user) => (
//                                 <span
//                                   key={user.id}
//                                   className="badge bg-light d-flex align-items-center"
//                                   style={{ color: "#4D4D4D", fontWeight: "500" }}
//                                 >
//                                   {user.fullName}
//                                   <button
//                                     type="button"
//                                     className="ms-2 btn-close btn-close-black"
//                                     aria-label="Close"
//                                     onClick={() => handleRemoveUser(user.id)}
//                                     style={{ fontSize: "0.5rem" }}
//                                   ></button>
//                                 </span>
//                               ))}


//                             {selectedUsers.length > 15 && (
//                               <button
//                                 type="button"
//                                 className="btn btn-link p-0 text-decoration-none"
//                                 onClick={() => setExpandedBcc(!expandedBcc)}
//                                 style={{ fontSize: "0.8rem" }}
//                               >
//                                 {expandedBcc
//                                   ? "Show less"
//                                   : `+${selectedUsers.length - 15} more`}
//                               </button>
//                             )}
//                           </>
//                         ) : (
//                           <span className="text-muted mt-1">No recipients selected</span>
//                         )}
//                       </div>
//                     </div>
//                   )}
//                 </div>


//                 {/* Subject Field */}
//                 <div className="mb-3">
//                   {loading ? (
//                     <Skeleton height={44} />
//                   ) : (
//                     <div
//                       className="form-control d-flex align-items-center p-2 shadow-none"
//                       style={{ height: "44px", overflow: "hidden",  }}
//                     >
//                       <span style={{ marginRight: "8px", color: "#6c757d" }}>
//                         Subject
//                       </span>
//                       <input
//                         type="text"
//                         className="border-0 w-100"
//                         id="subject"
//                         value={subject}
//                         onChange={(e) => setSubject(e.target.value)}
//                         required
//                         style={{ outline: "none" }}
//                       />
//                     </div>
//                   )}
//                 </div>


//                 {/* Content Field */}
//                 <div className="mb-3 flex-grow-1 d-flex flex-column">
//                   {loading ? (
//                     <Skeleton height={300} />
//                   ) : (
//                     <textarea
//                       className="form-control flex-grow-1 shadow-none"
//                       id="content"
//                       value={content}
//                       onChange={(e) => setContent(e.target.value)}
//                       required
//                       style={{ resize: "none" }}
//                     ></textarea>
//                   )}
//                 </div>


//                 {/* Attachments and Send Button */}
//                 <div className="d-flex justify-content-between align-items-center mt-3">
//                   <div>
//                     {loading ? (
//                       <Skeleton width={150} height={30} />
//                     ) : (
//                       <>
//                         <small className="text-muted d-block mb-1">
//                           Supported formats: {allowedFileTypesString}
//                         </small>
//                         {attachments.length > 0 && (
//                           <div className="d-flex flex-wrap gap-2">
//                             {attachments.map((file, index) => (
//                               <div
//                                 key={index}
//                                 className="d-flex align-items-center bg-light rounded px-2 py-1"
//                               >
//                                 <span className="me-2 text-truncate" style={{ maxWidth: "150px" }}>
//                                   {file.name}
//                                 </span>
//                                 <button
//                                   type="button"
//                                   className="btn-close btn-close-sm"
//                                   onClick={() => handleRemoveAttachment(index)}
//                                   aria-label="Remove attachment"
//                                 ></button>
//                               </div>
//                             ))}
//                           </div>
//                         )}
//                       </>
//                     )}
//                   </div>
//                   <div>
//                     {loading ? (
//                       <Skeleton width={200} height={40} />
//                     ) : (
//                       <>
//                         <label
//                           htmlFor="file-upload"
//                           className="btn btn-outline me-2"
//                           style={{
//                             border: "1px solid #dee2e6",
//                             color: "#babdc0ff",
//                             cursor: "pointer",
//                           }}
//                         >
//                           <img
//                             src={attachFile}
//                             alt="Attach"
//                             style={{
//                               width: "20px",
//                               height: "20px",
//                               marginRight: "6px",
//                             }}
//                           />
//                           Attach Files
//                           <input
//                             id="file-upload"
//                             type="file"
//                             style={{ display: "none" }}
//                             onChange={handleFileChange}
//                             multiple
//                             accept={allowedFileTypes.map(type => `.${type}`).join(',')}
//                           />
//                         </label>


//                         <button
//                           type="submit"
//                           className="btn"
//                           style={{
//                             backgroundColor: "#0076CE",
//                             color: "white",
//                             width: "80px",
//                           }}
//                           // disabled={selectedUsers.length === 0 || isSending}
//                           disabled={isSending}
//                           onClick={handleSend}
//                         >
//                           {isSending ? (
//                             <span
//                               className="spinner-border spinner-border-sm"
//                               role="status"
//                               aria-hidden="true"
//                             ></span>
//                           ) : (
//                             "Send"
//                           )}
//                         </button>
//                       </>
//                     )}
//                   </div>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// };


// export default Email;


import React, { useState, useEffect, useRef } from "react";
import addWorker from "../assets/addWorker.jpg";
import Header from "./Header";
import { useNavigate } from "react-router-dom";
import attachFile from "../assets/attachFile.svg";
import searchIcon from "../assets/Search.png";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import api from "../api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import "../styles/Email.css";

const Email = () => {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [expandedBcc, setExpandedBcc] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const fileInputRef = useRef(null);



  // Limits
  const allowedFileTypes = ["pdf", "jpg", "jpeg", "png"];
  const allowedFileTypesString = allowedFileTypes.join(", ").toUpperCase();
  const maxFiles = 5;
  const maxFileSizeMB = 10; // TOTAL 10MB
  const maxFileSizeBytes = maxFileSizeMB * 1024 * 1024;

  // Fetch all users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get("/profile/all");
        setUsers(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching users:", error);
        setLoading(false);
        setErrorMessage("Failed to load users. Please try again.");
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter(
    (user) =>
      user.email && user.email.trim() !== "" &&
      user.fullName.toLowerCase().includes(keyword.toLowerCase()) &&
      !selectedUsers.some((selectedUser) => selectedUser.id === user.id)
  );

  const handleUserSelect = (user) => {
    const isSelected = pendingUsers.some(
      (pendingUser) => pendingUser.id === user.id
    );

    if (isSelected) {
      setPendingUsers(
        pendingUsers.filter((pendingUser) => pendingUser.id !== user.id)
      );
    } else {
      setPendingUsers([...pendingUsers, user]);
    }
  };

  const handleAddUsers = () => {
    setSelectedUsers([...selectedUsers, ...pendingUsers]);
    setPendingUsers([]);
    setKeyword("");
  };

  const handleRemoveUser = (userId) => {
    setSelectedUsers(selectedUsers.filter((user) => user.id !== userId));
  };

  const handleNewMessage = () => {
    setSelectedUsers([]);
    setPendingUsers([]);
    setSubject("");
    setContent("");
    setKeyword("");
    setExpandedBcc(false);
    setAttachments([]);
    setErrorMessage("");
  };

  // ✅ File change with total 10MB + toast
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);

    // 1. Check max number of files
    if (attachments.length + files.length > maxFiles) {
      setErrorMessage(`You can attach up to ${maxFiles} files only.`);
      return;
    }

    // 2. Check allowed types
    const invalidFiles = files.filter(
      (file) =>
        !allowedFileTypes.some((type) =>
          file.name.toLowerCase().endsWith(`.${type}`)
        )
    );

    if (invalidFiles.length > 0) {
      setErrorMessage(`Only ${allowedFileTypesString} files are allowed.`);
      return;
    }

    // 3. Check TOTAL size (existing + new files) – limit 10MB
    const allFiles = [...attachments, ...files];
    const totalSize = allFiles.reduce((sum, file) => sum + file.size, 0);

    if (totalSize > maxFileSizeBytes) {
      toast.error(
        `Total size of all attachments must not exceed ${maxFileSizeMB}MB.`,
        {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );
      return;
    }

    // 4. If all good, set attachments
    setAttachments(allFiles);
    setErrorMessage("");
  }; //  handleFileChange ends HERE (important)

  //Handling the sent
  const handleSend = (e) => {
    if (selectedUsers == 0) {
      toast.error("Please select one receiptent");
    }
  };

  const handleRemoveAttachment = (index) => {
    const newAttachments = [...attachments];
    newAttachments.splice(index, 1);
    setAttachments(newAttachments);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true);
    setErrorMessage("");

    if (selectedUsers.length === 0) {
      setIsSending(false);
      return;
    }

    const missingEmail = selectedUsers.some((user) => !user.email);
    if (missingEmail) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Some selected users do not have an email address",
      });
      setIsSending(false);
      return;
    }

    const formData = new FormData();
    formData.append("subject", subject);
    formData.append("content", content);

    const userIds = selectedUsers.map((user) => user.id).join(",");
    formData.append("userIds", userIds);

    attachments.forEach((file) => {
      formData.append("attachment", file);
    });

    try {
      await api.post("/profile/send-bulk-email", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Email sent successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      handleNewMessage();
      console.log("SUCCESS");
    } catch (error) {
      console.error("Error sending email:", error);
      setErrorMessage(
        error.response?.data?.message ||
        "Failed to send email. Please try again."
      );
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="container-fluid m-0 p-0 vh-100 w-100">
      <ToastContainer />
      <div className="row m-0 p-0 vh-100">
        <main className="col-12 p-0 m-0 d-flex flex-column">
          <Header />

          <div className="container-fluid p-3 flex-grow-1 d-flex">
            {/* Left Container - User Selection */}
            <div
              className="border rounded p-3 me-3"
              style={{
                width: "350px",
                height: "580px",
                marginTop: "80px",
                flexShrink: 0,
              }}
            >
              <div className="position-relative mb-3">
                {loading ? (
                  <Skeleton height={38} />
                ) : (
                  <>
                    <input
                      type="text"
                      className="form-control search-bar shadow-none pe-5"
                      placeholder="Search"
                      value={keyword}
                      onChange={(e) => setKeyword(e.target.value)}
                      style={{
                        paddingRight: "2.5rem",
                        border: "#a8a8a886 1px solid",
                      }}
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
                  </>
                )}
              </div>

              <div className="d-flex justify-content-between align-items-center mb-3">
                {loading ? (
                  <Skeleton width={100} />
                ) : (
                  <>
                    <div className="form-check">
                      <input
                        className="form-check-input shadow-none "
                        style={{
                          border: "#a8a8a886 1px solid",
                          cursor: "pointer",
                        }}
                        type="checkbox"
                        id="selectAll"
                        checked={
                          filteredUsers.length > 0 &&
                          filteredUsers.every((user) =>
                            pendingUsers.some(
                              (pendingUser) => pendingUser.id === user.id
                            )
                          )
                        }
                        onChange={() => {
                          const allSelected = filteredUsers.every((user) =>
                            pendingUsers.some(
                              (pendingUser) => pendingUser.id === user.id
                            )
                          );
                          if (allSelected) {
                            setPendingUsers(
                              pendingUsers.filter(
                                (pendingUser) =>
                                  !filteredUsers.some(
                                    (user) => user.id === pendingUser.id
                                  )
                              )
                            );
                          } else {
                            const usersToAdd = filteredUsers.filter(
                              (user) =>
                                !pendingUsers.some(
                                  (pendingUser) => pendingUser.id === user.id
                                )
                            );
                            setPendingUsers([...pendingUsers, ...usersToAdd]);
                          }
                        }}
                      />
                    </div>
                    <span className="text-muted small">
                      {pendingUsers.length} selected
                    </span>
                  </>
                )}
              </div>

              <div style={{ height: "calc(100% - 150px)", overflowY: "auto" }}>
                {loading ? (
                  Array(5)
                    .fill()
                    .map((_, index) => (
                      <div
                        key={index}
                        className="d-flex align-items-center mb-2"
                      >
                        <div className="me-2">
                          <Skeleton circle width={20} height={20} />
                        </div>
                        <div className="card p-2 flex-grow-1 d-flex flex-row align-items-center">
                          <Skeleton
                            circle
                            width={40}
                            height={40}
                            className="me-2"
                          />
                          <div style={{ width: "100%" }}>
                            <Skeleton width={`80%`} height={20} />
                            <Skeleton width={`60%`} height={16} />
                          </div>
                        </div>
                      </div>
                    ))
                ) : filteredUsers.length === 0 ? (
                  <p className="text-center text-muted">
                    {keyword.trim()
                      ? "No matching users found"
                      : "No users available"}
                  </p>
                ) : (
                  filteredUsers.map((user) => (
                    <div
                      key={user.id}
                      className="d-flex align-items-center mb-2"
                    >
                      <div className="me-2">
                        <input
                          className="form-check-input shadow-none"
                          style={{
                            border: "#a8a8a86f 1px solid",
                            cursor: "pointer",
                          }}
                          type="checkbox"
                          checked={pendingUsers.some(
                            (pendingUser) => pendingUser.id === user.id
                          )}
                          onChange={() => handleUserSelect(user)}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>

                      <div
                        className="card p-2 flex-grow-1 d-flex flex-row align-items-center"
                        style={{ cursor: "pointer" }}
                        onClick={() => handleUserSelect(user)}
                      >
                        <img
                          src={addWorker}
                          alt={user.fullName}
                          className="rounded-circle me-2"
                          width="40"
                          height="40"
                        />
                        <div>
                          <h6 className="mb-0">{user.fullName}</h6>
                          <small className="text-muted">
                            {user.addresses?.[0]?.town},{" "}
                            {user.addresses?.[0]?.pincode}
                          </small>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="mt-3">
                {loading ? (
                  <Skeleton
                    width={70}
                    height={35}
                    style={{ marginLeft: "240px" }}
                  />
                ) : (
                  <button
                    className="btn w-10"
                    style={{
                      backgroundColor: "#0076CE",
                      color: "white",
                      marginLeft: "240px",
                      fontSize: "13px",
                      height: "35px",
                      width: "70px",
                    }}
                    onClick={handleAddUsers}
                    disabled={pendingUsers.length === 0}
                  >
                    Add
                  </button>
                )}
              </div>
            </div>

            {/* Right Container - Email Composition */}
            <div
              className="border rounded p-3 flex-grow-1 d-flex flex-column"
              style={{
                height: "580px",
                marginTop: "80px",
                flexShrink: 0,
                width: "100px",
                overflowY: "auto",
              }}
            >
              <div className="d-flex justify-content-between align-items-center mb-4">
                {loading ? (
                  <Skeleton width={120} height={30} />
                ) : (
                  <>
                    <h5>New Message</h5>
                    <button
                      className="btn"
                      style={{ backgroundColor: "#0076CE", color: "white" }}
                      onClick={handleNewMessage}
                    >
                      New Message
                    </button>
                  </>
                )}
              </div>

              {errorMessage && (
                <div className="alert alert-danger">{errorMessage}</div>
              )}

              <form
                onSubmit={handleSubmit}
                className="flex-grow-1 d-flex flex-column"
              >
                <div className="mb-3">
                  {loading ? (
                    <Skeleton height={64} />
                  ) : (
                    <div
                      className="form-control p-2 shadow-none"
                      style={{
                        maxHeight: expandedBcc ? "none" : "64px",
                        overflow: "hidden",
                        display: "flex",
                        flexDirection: "row",
                        flexWrap: "nowrap",
                      }}
                    >
                      <div
                        style={{
                          flex: "0 0 50px",
                          color: "#6c757d",
                          display: "flex",
                          alignItems: "flex-start",
                        }}
                      >
                        To
                      </div>

                      <div
                        style={{
                          flex: "1",
                          display: "flex",
                          flexWrap: "wrap",
                          gap: "6px",
                          marginTop: "-4px",
                        }}
                      >
                        {selectedUsers.length > 0 ? (
                          <>
                            {selectedUsers
                              .slice(
                                0,
                                expandedBcc ? selectedUsers.length : 15
                              )
                              .map((user) => (
                                <span
                                  key={user.id}
                                  className="badge bg-light d-flex align-items-center"
                                  style={{ color: "#4D4D4D", fontWeight: "500" }}
                                >
                                  {user.fullName}
                                  <button
                                    type="button"
                                    className="ms-2 btn-close btn-close-black"
                                    aria-label="Close"
                                    onClick={() => handleRemoveUser(user.id)}
                                    style={{ fontSize: "0.5rem" }}
                                  ></button>
                                </span>
                              ))}

                            {selectedUsers.length > 15 && (
                              <button
                                type="button"
                                className="btn btn-link p-0 text-decoration-none"
                                onClick={() => setExpandedBcc(!expandedBcc)}
                                style={{ fontSize: "0.8rem" }}
                              >
                                {expandedBcc
                                  ? "Show less"
                                  : `+${selectedUsers.length - 15} more`}
                              </button>
                            )}
                          </>
                        ) : (
                          <span className="text-muted mt-1">
                            No recipients selected
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="mb-3">
                  {loading ? (
                    <Skeleton height={44} />
                  ) : (
                    <div
                      className="form-control d-flex align-items-center p-2 shadow-none"
                      style={{ height: "44px", overflow: "hidden" }}
                    >
                      <span style={{ marginRight: "8px", color: "#6c757d" }}>
                        Subject
                      </span>
                      <input
                        type="text"
                        className="border-0 w-100"
                        id="subject"
                        value={subject}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value.startsWith(" ")) return;
                          setSubject(value);
                        }}


                        required
                        maxLength={150}
                        style={{ outline: "none" }}
                      />
                    </div>
                  )}
                </div>

                <div className="mb-3 flex-grow-1 d-flex flex-column">
                  {loading ? (
                    <Skeleton height={300} />
                  ) : (
                    <>
                      <textarea
                        className="form-control flex-grow-1 shadow-none"
                        id="content"
                        value={content}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value.startsWith(" ")) return;
                          setContent(value);
                        }} required
                        style={{ resize: "none" }}
                        maxLength={1000}
                      ></textarea>
                      <small className="text-muted mt-1">
                        {content.length}/1000 characters
                      </small>

                    </>
                  )} c 
                </div>

                {/* Attachments and Send Button */}
                <div className="email-footer d-flex justify-content-between mt-3">
                  <div>
                    {loading ? (
                      <Skeleton width={150} height={30} />
                    ) : (
                      <>
                        <small className="text-muted d-block mb-1">
                          Supported formats: {allowedFileTypesString}
                        </small>

                        <small className="text-muted d-block mb-2">
                          You can attach up to {maxFiles} files, with a total
                          size of {maxFileSizeMB}MB.
                        </small>

                        {attachments.length > 0 && (
                          <div className="d-flex flex-wrap gap-2">

                            {attachments.map((file, index) => (
                              <div
                                key={index}
                                className="email-attachment-chip"
                              >
                                <span
                                  className="me-2 text-truncate"
                                  style={{ maxWidth: "150px" }}
                                >
                                  {file.name}
                                </span>
                                <button
                                  type="button"
                                  className="btn-close btn-close-sm"
                                  onClick={() => handleRemoveAttachment(index)}
                                  aria-label="Remove attachment"
                                ></button>
                              </div>
                            ))}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                  <div>
                    {loading ? (
                      <Skeleton width={200} height={40} />
                    ) : (
                      <>
                        <label
                          htmlFor="file-upload"
                          className="btn btn-outline me-2"
                          style={{
                            border: "1px solid #0076CE",
                            color: "#0076CE",
                            cursor: "pointer",
                          }}
                        >
                          <img
                            src={attachFile}
                            alt="Attach"
                            style={{
                              width: "20px",
                              height: "20px",
                              marginRight: "6px",
                              color: "#0085ebff",
                            }}
                          />
                          Attach Files
                          <input
                            id="file-upload"
                            type="file"
                            style={{ display: "none" }}
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            multiple
                            accept={allowedFileTypes
                              .map((type) => `.${type}`)
                              .join(",")}
                          />
                        </label>

                        <button
                          type="submit"
                          className="btn"
                          style={{
                            backgroundColor: "#0076CE",
                            color: "white",
                            width: "80px",
                          }}
                          disabled={isSending}
                          onClick={handleSend}
                        >
                          {isSending ? (
                            <span
                              className="spinner-border spinner-border-sm"
                              role="status"
                              aria-hidden="true"
                            ></span>
                          ) : (
                            "Send"
                          )}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Email;
