import React, { useEffect, useState } from "react";
import axios from "axios";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { ApiEndPoint } from "../utils/utlis";
import { useSelector } from "react-redux";

const MOMEditor = () => {
    const [headings, setHeadings] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [clientName, setClientName] = useState("");
    const [lawyerName, setLawyerName] = useState("");
    const [associateName, setAssociateName] = useState("");
    const [caseType, setCaseType] = useState("");
    const [caseId, setCaseId] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const [hasData, setHasData] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const reduxCaseInfo = useSelector((state) => state.screen.Caseinfo);


    useEffect(() => {
        const fetchForm = async () => {
            try {
                const response = await axios.get(`${ApiEndPoint}getFormMOMByCaseId/${caseId}`);
                if (response.data && response.data.length > 0 && response.data[0].headings) {
                    const formData = response.data[0];
                    setHeadings(formData.headings);
                    setClientName(formData.clientName || "");
                    setLawyerName(formData.lawyerName || "");
                    setAssociateName(formData.associateName || "");
                    setCaseType(formData.caseType || "");
                    if (formData.date) {
                        setSelectedDate(new Date(formData.date));
                    }
                    setHasData(true);
                } else {
                    setHasData(false);
                }
            } catch (err) {
                console.error("Failed to fetch form", err);
                setHasData(false);
            } finally {
                setIsLoading(false);
            }
        };

        setCaseId(reduxCaseInfo?._id)
        if (caseId) {
            fetchForm();
        }
    }, [caseId]);

    const addHeading = () => {
        setHeadings([...headings, { title: "", points: [{ text: "", subpoints: [] }] }]);
    };

    const updateHeadingTitle = (index, value) => {
        const updated = [...headings];
        updated[index].title = value;
        setHeadings(updated);
    };

    const addPoint = (hIndex) => {
        const updated = [...headings];
        updated[hIndex].points.push({ text: "", subpoints: [] });
        setHeadings(updated);
    };

    const updatePoint = (hIndex, pIndex, value) => {
        const updated = [...headings];
        updated[hIndex].points[pIndex].text = value;
        setHeadings(updated);
    };

    const addSubpoint = (hIndex, pIndex) => {
        const updated = [...headings];
        updated[hIndex].points[pIndex].subpoints.push({ text: "", subsubpoints: [] });
        setHeadings(updated);
    };

    const updateSubpoint = (hIndex, pIndex, sIndex, value) => {
        const updated = [...headings];
        updated[hIndex].points[pIndex].subpoints[sIndex].text = value;
        setHeadings(updated);
    };

    const addSubSubpoint = (hIndex, pIndex, sIndex) => {
        const updated = [...headings];
        updated[hIndex].points[pIndex].subpoints[sIndex].subsubpoints.push({ text: "" });
        setHeadings(updated);
    };

    const updateSubSubpoint = (hIndex, pIndex, sIndex, ssIndex, value) => {
        const updated = [...headings];
        updated[hIndex].points[pIndex].subpoints[sIndex].subsubpoints[ssIndex].text = value;
        setHeadings(updated);
    };

    const removeHeading = (hIndex) => {
        const updated = [...headings];
        updated.splice(hIndex, 1);
        setHeadings(updated);
    };

    const removePoint = (hIndex, pIndex) => {
        const updated = [...headings];
        updated[hIndex].points.splice(pIndex, 1);
        setHeadings(updated);
    };

    const removeSubpoint = (hIndex, pIndex, sIndex) => {
        const updated = [...headings];
        updated[hIndex].points[pIndex].subpoints.splice(sIndex, 1);
        setHeadings(updated);
    };

    const removeSubSubpoint = (hIndex, pIndex, sIndex, ssIndex) => {
        const updated = [...headings];
        updated[hIndex].points[pIndex].subpoints[sIndex].subsubpoints.splice(ssIndex, 1);
        setHeadings(updated);
    };

    const handleSubmit = async () => {
        const formData = {
            caseId,
            clientName,
            lawyerName,
            associateName,
            date: selectedDate,
            caseType,
            headings,
        };

        try {
            const res = await axios.post(`${ApiEndPoint}createFormMOM`, formData);
            alert("Form submitted successfully!");
            console.log("Submitted:", res.data);
            setHasData(true);
            setEditMode(false);
        } catch (err) {
            console.error("Error submitting form:", err);
            alert("Error submitting form.");
        }
    };

    const handleEdit = () => {
        setEditMode(true);
    };

    if (isLoading) {
        return <div className="text-center mt-5">Loading...</div>;
    }

    return (
        <div className="card" style={{ maxHeight: "87vh", overflowY: "auto", minWidth: "30vw" }}>
            <div className="container mt-4">
                <div className="d-flex align-items-center mb-4">
                    <img src="logo.png" alt="Logo" className="me-3" style={{ height: '60px' }} />
                    <h1 className="mb-0">Form L / MOM</h1>
                </div>

                <div className="card p-4 shadow-sm">
                    <div className="row g-3">
                        <div className="col-md-6">
                            <label className="form-label fw-bold">Client</label>
                            {editMode || !hasData ? (
                                <input type="text" className="form-control" placeholder="Client Name" value={clientName} onChange={(e) => setClientName(e.target.value)} />
                            ) : (
                                <div className="form-control-plaintext">{clientName}</div>
                            )}
                        </div>
                        <div className="col-md-6">
                            <label className="form-label fw-bold">Lawyer</label>
                            {editMode || !hasData ? (
                                <input type="text" className="form-control" placeholder="Lawyer Name" value={lawyerName} onChange={(e) => setLawyerName(e.target.value)} />
                            ) : (
                                <div className="form-control-plaintext">{lawyerName}</div>
                            )}
                        </div>
                        <div className="col-md-6">
                            <label className="form-label fw-bold">Associate</label>
                            {editMode || !hasData ? (
                                <input type="text" className="form-control" placeholder="Associate Name" value={associateName} onChange={(e) => setAssociateName(e.target.value)} />
                            ) : (
                                <div className="form-control-plaintext">{associateName}</div>
                            )}
                        </div>
                        <div className="col-md-6">
                            <label className="form-label fw-bold">Date</label>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                {editMode || !hasData ? (
                                    <DatePicker
                                        value={selectedDate}
                                        onChange={(date) => setSelectedDate(date)}
                                        format="dd/MM/yyyy"
                                        slotProps={{
                                            textField: {
                                                fullWidth: true,
                                                size: "small",
                                            },
                                        }}
                                    />
                                ) : (
                                    <div className="form-control-plaintext">
                                        {selectedDate.toLocaleDateString('en-GB')}
                                    </div>
                                )}
                            </LocalizationProvider>
                        </div>
                        <div className="col-12">
                            <label className="form-label fw-bold">Case Type</label>
                            {editMode || !hasData ? (
                                <input type="text" className="form-control" placeholder="Family / Civil / ..." value={caseType} onChange={(e) => setCaseType(e.target.value)} />
                            ) : (
                                <div className="form-control-plaintext">{caseType}</div>
                            )}
                        </div>
                    </div>
                </div>

                {hasData && !editMode && (
                    <button className="btn mt-4" style={{ backgroundColor: '#18273e', color: 'white' }} onClick={handleEdit}>
                        Edit Form
                    </button>
                )}

                {(editMode || !hasData) && (
                    <button className="btn mt-4" style={{ backgroundColor: '#18273e', color: 'white' }} onClick={addHeading}>
                        Add Heading
                    </button>
                )}

                {/* {headings.map((heading, hIndex) => (
                    <div key={hIndex} className="section border p-3 my-3 rounded bg-light">
                        {editMode || !hasData ? (
                            <div className="d-flex align-items-center mb-2">
                                <span className="me-2">➤</span>
                                <textarea
                                    className="form-control me-2"
                                    placeholder="Enter heading"
                                    value={heading.title}
                                    onChange={(e) => updateHeadingTitle(hIndex, e.target.value)}
                                    rows={1}
                                    onInput={(e) => {
                                        e.target.style.height = 'auto';
                                        e.target.style.height = e.target.scrollHeight + 'px';
                                    }}
                                />
                                <button
                                    onClick={() => removeHeading(hIndex)}
                                    className="btn btn-danger btn-sm"
                                >
                                    🗑️
                                </button>
                            </div>
                        ) : (
                            <h4 className="mb-3" style={{ whiteSpace: 'pre-wrap' }}>
                                <span className="me-2">➤</span> {heading.title}
                            </h4>
                        )}

                        {(editMode || !hasData) && (
                            <button
                                onClick={() => addPoint(hIndex)}
                                className="btn btn-outline-primary btn-sm mb-2"
                            >
                                ➕ Add Point
                            </button>
                        )}

                        <ul className="list-unstyled ps-3">
                            {heading.points.map((point, pIndex) => (
                                <li key={pIndex}>
                                    {editMode || !hasData ? (
                                        <div className="d-flex align-items-center mb-2">
                                            <span className="me-2">{pIndex + 1}.</span>
                                            <textarea
                                                className="form-control me-2"
                                                placeholder="Point"
                                                value={point.text}
                                                onChange={(e) => updatePoint(hIndex, pIndex, e.target.value)}
                                                rows={1}
                                                onInput={(e) => {
                                                    e.target.style.height = 'auto';
                                                    e.target.style.height = e.target.scrollHeight + 'px';
                                                }}
                                            />
                                            <button
                                                onClick={() => removePoint(hIndex, pIndex)}
                                                className="btn btn-danger btn-sm"
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    ) : (
                                        <p className="mb-2" style={{ whiteSpace: 'pre-wrap' }}>
                                            <strong>
                                                {pIndex + 1}. {point.text}
                                            </strong>
                                        </p>
                                    )}

                                    {(editMode || !hasData) && (
                                        <button
                                            onClick={() => addSubpoint(hIndex, pIndex)}
                                            className="btn btn-outline-secondary btn-sm mb-2 ms-4"
                                        >
                                            + Subpoint
                                        </button>
                                    )}

                                    <ol type="i" className="ps-4">
                                        {point.subpoints.map((sub, sIndex) => (
                                            <li key={sIndex}>
                                                {editMode || !hasData ? (
                                                    <div className="d-flex align-items-center mb-2">
                                                        <textarea
                                                            className="form-control me-2"
                                                            placeholder="Subpoint"
                                                            value={sub.text}
                                                            onChange={(e) =>
                                                                updateSubpoint(hIndex, pIndex, sIndex, e.target.value)
                                                            }
                                                            rows={1}
                                                            onInput={(e) => {
                                                                e.target.style.height = 'auto';
                                                                e.target.style.height = e.target.scrollHeight + 'px';
                                                            }}
                                                        />
                                                        <button
                                                            onClick={() => removeSubpoint(hIndex, pIndex, sIndex)}
                                                            className="btn btn-danger btn-sm"
                                                        >
                                                            🗑️
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <p className="mb-2" style={{ whiteSpace: 'pre-wrap' }}>{sub.text}</p>
                                                )}

                                                {(editMode || !hasData) && (
                                                    <button
                                                        onClick={() => addSubSubpoint(hIndex, pIndex, sIndex)}
                                                        className="btn btn-outline-secondary btn-sm mb-2 ms-5"
                                                    >
                                                        + Sub-subpoint
                                                    </button>
                                                )}

                                                <ul className="ps-4">
                                                    {sub.subsubpoints.map((ss, ssIndex) => (
                                                        <li key={ssIndex}>
                                                            {editMode || !hasData ? (
                                                                <div className="d-flex align-items-center mb-2">
                                                                    <textarea
                                                                        className="form-control me-2"
                                                                        placeholder="Sub-subpoint"
                                                                        value={ss.text}
                                                                        onChange={(e) =>
                                                                            updateSubSubpoint(
                                                                                hIndex,
                                                                                pIndex,
                                                                                sIndex,
                                                                                ssIndex,
                                                                                e.target.value
                                                                            )
                                                                        }
                                                                        rows={1}
                                                                        onInput={(e) => {
                                                                            e.target.style.height = 'auto';
                                                                            e.target.style.height = e.target.scrollHeight + 'px';
                                                                        }}
                                                                    />
                                                                    <button
                                                                        onClick={() =>
                                                                            removeSubSubpoint(
                                                                                hIndex,
                                                                                pIndex,
                                                                                sIndex,
                                                                                ssIndex
                                                                            )
                                                                        }
                                                                        className="btn btn-danger btn-sm"
                                                                    >
                                                                        🗑️
                                                                    </button>
                                                                </div>
                                                            ) : (
                                                                <p className="mb-2" style={{ whiteSpace: 'pre-wrap' }}>{ss.text}</p>
                                                            )}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </li>
                                        ))}
                                    </ol>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))} */}




                {headings.map((heading, hIndex) => (
                    <div key={hIndex} className="section border p-3 my-3 rounded bg-light">
                        {editMode || !hasData ? (
                            <div className="d-flex align-items-center mb-2">
                                <span className="me-2">➤</span>
                                <textarea
                                    className="form-control me-2"
                                    placeholder="Enter heading"
                                    value={heading.title}
                                    onChange={(e) => updateHeadingTitle(hIndex, e.target.value)}
                                    rows={1}
                                    onInput={(e) => {
                                        e.target.style.height = 'auto';
                                        e.target.style.height = e.target.scrollHeight + 'px';
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Tab') {
                                            e.preventDefault();
                                            const start = e.target.selectionStart;
                                            const end = e.target.selectionEnd;
                                            const value = e.target.value;
                                            const updatedValue = value.substring(0, start) + '\t' + value.substring(end);
                                            updateHeadingTitle(hIndex, updatedValue);
                                            setTimeout(() => {
                                                e.target.selectionStart = e.target.selectionEnd = start + 1;
                                            }, 0);
                                        }
                                    }}
                                />
                                <button
                                    onClick={() => removeHeading(hIndex)}
                                    className="btn btn-danger btn-sm"
                                >
                                    🗑️
                                </button>
                            </div>
                        ) : (
                            <h4 className="mb-3" style={{ whiteSpace: 'pre-wrap' }}>
                                <span className="me-2">➤</span> {heading.title}
                            </h4>
                        )}

                        <ul className="list-unstyled ps-3">
                            {heading.points.map((point, pIndex) => (
                                <li key={pIndex}>
                                    {editMode || !hasData ? (
                                        <div className="d-flex align-items-center mb-2">
                                            {/* <span className="me-2">{pIndex + 1}.</span> */}
                                            <textarea
                                                className="form-control me-2"
                                                placeholder="Point"
                                                value={point.text}
                                                onChange={(e) => updatePoint(hIndex, pIndex, e.target.value)}
                                                rows={1}
                                                onInput={(e) => {
                                                    e.target.style.height = 'auto';
                                                    e.target.style.height = e.target.scrollHeight + 'px';
                                                }}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Tab') {
                                                        e.preventDefault();
                                                        const start = e.target.selectionStart;
                                                        const end = e.target.selectionEnd;
                                                        const value = e.target.value;
                                                        const updatedValue = value.substring(0, start) + '\t' + value.substring(end);
                                                        updatePoint(hIndex, pIndex, updatedValue);
                                                        setTimeout(() => {
                                                            e.target.selectionStart = e.target.selectionEnd = start + 1;
                                                        }, 0);
                                                    }
                                                }}
                                            />
                                          
                                        </div>
                                    ) : (
                                        <p className="mb-2" style={{ whiteSpace: 'pre-wrap' }}>
                                            {point.text}
                                        </p>
                                    )}

                                    <ol type="i" className="ps-4">
                                        {point.subpoints.map((sub, sIndex) => (
                                            <li key={sIndex}>
                                                {editMode || !hasData ? (
                                                    <div className="d-flex align-items-center mb-2">
                                                        <textarea
                                                            className="form-control me-2"
                                                            placeholder="Subpoint"
                                                            value={sub.text}
                                                            onChange={(e) =>
                                                                updateSubpoint(hIndex, pIndex, sIndex, e.target.value)
                                                            }
                                                            rows={1}
                                                            onInput={(e) => {
                                                                e.target.style.height = 'auto';
                                                                e.target.style.height = e.target.scrollHeight + 'px';
                                                            }}
                                                            onKeyDown={(e) => {
                                                                if (e.key === 'Tab') {
                                                                    e.preventDefault();
                                                                    const start = e.target.selectionStart;
                                                                    const end = e.target.selectionEnd;
                                                                    const value = e.target.value;
                                                                    const updatedValue = value.substring(0, start) + '\t' + value.substring(end);
                                                                    updateSubpoint(hIndex, pIndex, sIndex, updatedValue);
                                                                    setTimeout(() => {
                                                                        e.target.selectionStart = e.target.selectionEnd = start + 1;
                                                                    }, 0);
                                                                }
                                                            }}
                                                        />
                                                       
                                                    </div>
                                                ) : (
                                                    <p className="mb-2" style={{ whiteSpace: 'pre-wrap' }}>{sub.text}</p>
                                                )}

                                                <ul className="ps-4">
                                                    {sub.subsubpoints.map((ss, ssIndex) => (
                                                        <li key={ssIndex}>
                                                            {editMode || !hasData ? (
                                                                <div className="d-flex align-items-center mb-2">
                                                                    <textarea
                                                                        className="form-control me-2"
                                                                        placeholder="Sub-subpoint"
                                                                        value={ss.text}
                                                                        onChange={(e) =>
                                                                            updateSubSubpoint(hIndex, pIndex, sIndex, ssIndex, e.target.value)
                                                                        }
                                                                        rows={1}
                                                                        onInput={(e) => {
                                                                            e.target.style.height = 'auto';
                                                                            e.target.style.height = e.target.scrollHeight + 'px';
                                                                        }}
                                                                        onKeyDown={(e) => {
                                                                            if (e.key === 'Tab') {
                                                                                e.preventDefault();
                                                                                const start = e.target.selectionStart;
                                                                                const end = e.target.selectionEnd;
                                                                                const value = e.target.value;
                                                                                const updatedValue = value.substring(0, start) + '\t' + value.substring(end);
                                                                                updateSubSubpoint(hIndex, pIndex, sIndex, ssIndex, updatedValue);
                                                                                setTimeout(() => {
                                                                                    e.target.selectionStart = e.target.selectionEnd = start + 1;
                                                                                }, 0);
                                                                            }
                                                                        }}
                                                                    />
                                                                   
                                                                </div>
                                                            ) : (
                                                                <p className="mb-2" style={{ whiteSpace: 'pre-wrap' }}>{ss.text}</p>
                                                            )}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </li>
                                        ))}
                                    </ol>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}





                {(editMode || !hasData) && (
                    <div className="d-flex justify-content-center gap-3 mt-3 mb-5">
                        <button className="btn btn-success" onClick={handleSubmit}>
                            {hasData ? "Update Form" : "Submit Form"}
                        </button>
                        {editMode && (
                            <button className="btn btn-secondary" onClick={() => setEditMode(!editMode)}>
                                Cancel
                            </button>
                        )}
                    </div>
                )}


            </div>
        </div>

    );
};

export default MOMEditor;