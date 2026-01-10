import Header from "./Header";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import profile from "../assets/addWorker.jpg";
import api from "../api";
import "../styles/Services.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";



const Service = () => {
  const [activeTab, setActiveTab] = useState("recent");
  const [serviceData, setServiceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editImage, setEditImage] = useState(null);


  const navigate = useNavigate();
  const { productId } = useParams();

  /*  FETCH PRODUCT + SERVICE CONTENT  */
  useEffect(() => {
    const fetchServiceData = async () => {
      try {
        //  Product details
        const productRes = await api.get(`/products/view/${productId}`);

        //  Default service content
        let serviceContentData = {
          title: `${productRes.data.name} Service`,
          sections: [],
        };

        //  Fetch service content from DB
        try {
          const contentRes = await api.get(
            `/products/${productId}/service-content`
          );
          serviceContentData = contentRes.data.data;
        } catch {
          console.warn("Service content not found in DB");
        }

        setServiceData({
          id: productRes.data.id,
          name: productRes.data.name,
          price: productRes.data.price,
          ratings: productRes.data.averageRating
            ? Number(productRes.data.averageRating).toFixed(1)
            : "0.0",
          bookings: productRes.data.bookingCount.toString(),
          pic: productRes.data.productImage || profile,
          content: serviceContentData,
        });
        setEditName(productRes.data.name);
        setEditPrice(productRes.data.price);

        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchServiceData();
  }, [productId]);

  /*  UPDATE  */
  const handleUpdate = async () => {
    try {
      // 1️⃣ Update product (name, price, image)
      const formData = new FormData();
      formData.append("name", editName);
      formData.append("price", editPrice);

      if (editImage) {
        formData.append("image", editImage);
      }

      await api.put(`/products/update/${productId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      //  Update service content
      await api.put(
        `/products/${productId}/service-content`,
        serviceData.content
      );

      //  Update UI state
      setServiceData({
        ...serviceData,
        name: editName,
        price: editPrice,
        pic: editImage
          ? URL.createObjectURL(editImage)
          : serviceData.pic,
      });

      setIsEditing(false);

      toast.success(" Service updated successfully", {
        position: "top-right",
        autoClose: 3000,
      });

    } catch (error) {
      console.error(error);
      toast.error(" Update failed", {
        position: "top-right",
        autoClose: 4000,
      });

    }
  };

  /* DELETE  */

  const handleDelete = () => {
    // document.body.classList.add("toast-dim");

    toast.info(
      <div>
        <p className="mb-3 text-center fw-semibold">
          Delete this service completely?
        </p>

        <div className="d-flex justify-content-center gap-2">
          <button
            className="btn btn-sm btn-danger"
            onClick={async () => {
              try {
                // delete service content (safe)
                await api
                  .delete(`/products/${productId}/service-content`)
                  .catch(() => { });

                // delete service
                await api.delete(`/products/${productId}`);

                toast.dismiss();
                document.body.classList.remove("toast-dim");


                toast.success("Service deleted successfully", {
                  position: "top-right",
                  autoClose: 3000,
                });

                setTimeout(() => navigate(-1), 2000);
              } catch (err) {
                toast.dismiss();
                document.body.classList.remove("toast-dim");

                toast.error("Failed to delete service", {
                  position: "top-right",
                  autoClose: 4000,
                });
              }
            }}
          >
            Delete
          </button>

          <button
            className="btn btn-sm btn-secondary"
            onClick={() => {
              toast.dismiss();
              document.body.classList.remove("toast-dim");
            }}
          >
            Cancel
          </button>

        </div>
      </div>,
      {
        className: "confirm-toast",
        icon: false,
        onClose: () => {
          document.body.classList.remove("toast-dim");
        },
      }
    );
  };



  const updateSectionTitle = (index, value) => {
    const sections = [...serviceData.content.sections];
    sections[index].title = value;
    setServiceData({
      ...serviceData,
      content: { ...serviceData.content, sections },
    });
  };

  const updateItem = (sIndex, iIndex, value) => {
    const sections = [...serviceData.content.sections];
    sections[sIndex].items[iIndex] = value;
    setServiceData({
      ...serviceData,
      content: { ...serviceData.content, sections },
    });
  };

  const addItem = (index) => {
    const sections = [...serviceData.content.sections];
    sections[index].items.push("New Item");
    setServiceData({
      ...serviceData,
      content: { ...serviceData.content, sections },
    });
  };

  const removeItem = (sIndex, iIndex) => {
    const sections = [...serviceData.content.sections];
    sections[sIndex].items.splice(iIndex, 1);
    setServiceData({
      ...serviceData,
      content: { ...serviceData.content, sections },
    });
  };

  const addSection = () => {
    setServiceData({
      ...serviceData,
      content: {
        ...serviceData.content,
        sections: [
          ...serviceData.content.sections,
          { title: "New Section", items: ["New Item"] },
        ],
      },
    });
  };

  const removeSection = (index) => {
    const sections = [...serviceData.content.sections];
    sections.splice(index, 1);
    setServiceData({
      ...serviceData,
      content: { ...serviceData.content, sections },
    });
  };


  const sectionsToRender =
    serviceData?.content?.sections?.length > 0
      ? serviceData.content.sections
      : [
        { title: "", items: [] },
        { title: "", items: [] },
        { title: "", items: [] },
      ];

  const ensureEditableSections = () => {
    if (serviceData.content.sections.length === 0) {
      setServiceData({
        ...serviceData,
        content: {
          ...serviceData.content,
          sections: [
            { title: "", items: [] },
            { title: "", items: [] },
            { title: "", items: [] },
          ],
        },
      });
    }
  };

  /*  LOADING  */
  if (loading) {
    return (
      <>
        <Header />
        <div className="container-fluid p-0 pt-5 scrollable-container">
          <div className="row mx-5 bg-light">
            {[1, 2, 3].map((i) => (
              <div key={i} className="col-4 border p-3 skeleton-text"></div>
            ))}
          </div>
        </div>
      </>
    );
  }

  if (error) return <div>Error: {error}</div>;
  if (!serviceData) return <div />;

  return (
    <>
      <Header />
      <div className="container-fluid p-0 pt-5 scrollable-container">

        {/*HEADER  */}

        <div className="d-flex justify-content-between border-bottom mt-4">
          <div className="d-flex gap-4 mx-4 align-items-center">
            <button className="btn btn-light p-2" onClick={() => navigate(-1)}>
              <i className="bi bi-arrow-left" style={{ fontSize: "1.5rem" }} />
            </button>

            {isEditing ? (
              <input
                className="form-control"
                style={{ maxWidth: "250px" }}
                value={serviceData.content.title || ""}
                onChange={(e) =>
                  setServiceData({
                    ...serviceData,
                    content: {
                      ...serviceData.content,
                      title: e.target.value,
                    },
                  })
                }
              />
            ) : (
              <button
                className={`tab-btn ${activeTab === "recent" ? "active-tab" : ""}`}
                style={{ padding: "15px" }}
              >
                {serviceData.content.title || serviceData.name}
              </button>
            )}

          </div>

          {/*  EDIT / DELETE BUTTONS (NO LAYOUT CHANGE)  */}
          <div className="me-4 d-flex gap-2 align-items-center">
            <button
              className="btn btn-outline-primary btn-sm"
              onClick={() => {
                ensureEditableSections();
                setIsEditing(true);
              }}
            >
              <i className="bi bi-pencil"></i> Edit
            </button>

            <button
              className="btn btn-outline-danger btn-sm"
              onClick={handleDelete}
            >
              <i className="bi bi-trash"></i> Delete
            </button>
          </div>
        </div>

        {/*  SERVICE INFO  */}
        <div className="row px-4 mx-2">
          <div className="col-4">
            <div className="card mt-1 mb-3" style={{ border: "none" }}>
              <div className="card-body d-flex">
                <div
                  style={{ position: "relative", width: "60px", height: "60px" }}
                >
                  <img
                    src={
                      editImage
                        ? URL.createObjectURL(editImage)
                        : serviceData.pic
                    }
                    alt={serviceData.name}
                    width="60"
                    height="60"
                    style={{ borderRadius: "6px" }}
                    onError={(e) => (e.target.src = profile)}
                  />

                  {isEditing && (
                    <>
                      {/* Edit icon */}
                      <label
                        style={{
                          position: "absolute",
                          bottom: "2px",
                          right: "2px",
                          background: "#fff",
                          borderRadius: "50%",
                          padding: "4px",
                          cursor: "pointer",
                          boxShadow: "0 0 4px rgba(0,0,0,0.2)"
                        }}
                        title="Change image"
                      >
                        <i className="bi bi-pencil-fill" style={{ fontSize: "12px" }}></i>

                        <input
                          type="file"
                          hidden
                          accept="image/*"
                          onChange={(e) => setEditImage(e.target.files[0])}
                        />
                      </label>
                    </>
                  )}
                </div>


                <div className="ms-3">
                  {isEditing ? (
                    <>
                      <input
                        className="form-control mb-1"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                      />

                      <input
                        type="number"
                        className="form-control"
                        value={editPrice}
                        onChange={(e) => setEditPrice(e.target.value)}
                      />
                    </>
                  ) : (
                    <>
                      <p>
                        {serviceData.name}
                        <span className="mx-2 bg-light px-2 rounded">
                          ⭐ {serviceData.ratings}
                        </span>
                      </p>
                      <p>₹ {serviceData.price}</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SERVICE CONTENT  */}
        <div className="row mx-4 bg-light">
          {/* ➕ ADD NEW GRID (SECTION) */}
          {isEditing && (
            <div className="ms-2 mt-3 mb-4">

              <button
                className="btn btn-outline-secondary"
                onClick={addSection}
                title="Add new grid"
              >
                <i className="bi bi-plus-lg"></i> Add New Grid
              </button>
            </div>
          )}

          {sectionsToRender.map((section, index) => (

            <div
              key={index}
              className={`col-4 border p-3 service-grid ${isEditing ? "editing" : ""}`}
              style={{
                minHeight: "210px",
                height: "auto"
              }}
            >
              {isEditing && (
                <div className="edit-actions">
                  <button
                    className="btn btn-sm btn-light me-1"
                    onClick={() => addItem(index)}
                    title="Add item"
                  >
                    <i className="bi bi-plus"></i>
                  </button>

                  <button
                    className="btn btn-sm btn-light"
                    onClick={() => removeSection(index)}
                    title="Delete section"
                  >
                    <i className="bi bi-trash text-danger"></i>
                  </button>
                </div>
              )}

              {isEditing ? (
                <input
                  className="form-control mb-2"
                  value={section.title}
                  onChange={(e) => {
                    const updated = [...serviceData.content.sections];
                    updated[index].title = e.target.value;
                    setServiceData({
                      ...serviceData,
                      content: {
                        ...serviceData.content,
                        sections: updated,
                      },
                    });
                  }}
                />
              ) : (
                <p>{section.title}</p>
              )}

              <ul>
                {section.items.map((item, i) => (
                  <li
                    key={i}
                    className="d-flex justify-content-between align-items-center"
                  >
                    <span
                      contentEditable={isEditing}
                      suppressContentEditableWarning
                      onBlur={(e) => {
                        const updatedSections = [...serviceData.content.sections];
                        updatedSections[index].items[i] = e.target.innerText;

                        setServiceData({
                          ...serviceData,
                          content: {
                            ...serviceData.content,
                            sections: updatedSections,
                          },
                        });
                      }}
                    >
                      {item}
                    </span>
                    {/* ❌ REMOVE ITEM */}
                    {isEditing && (
                      <button
                        className="btn btn-sm text-danger"
                        onClick={() => removeItem(index, i)}
                      >
                        <i className="bi bi-x"></i>
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/*  SAVE  */}
        {isEditing && (
          <div className="text-end mt-3 me-4">
            <button className="btn btn-success" onClick={handleUpdate}>
              Save Changes
            </button>
          </div>
        )}
      </div>
      <ToastContainer
        position="top-center"
        // autoClose={false}
        closeOnClick={false}
        draggable={false}
      />


    </>
  );
};

export default Service;
