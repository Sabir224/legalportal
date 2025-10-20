{
  showCaseSheet && (
    <div
      className="card shadow p-2"
      style={{
        height: '86vh',
        width: '100%', // fills the available width of parent
        maxWidth: '100%', // prevent overflow
        boxSizing: 'border-box',
      }}
    >
      <div className="row mb-3 g-2 align-items-center px-2">
        <div className="">
          <input
            type="text"
            className="form-control"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
      </div>
      <div
        className="card shadow "
        style={{
          overflowX: 'auto',
          scrollbarWidth: 'thin',
          scrollbarColor: '#c0a262 #f1f1f1',
          maxWidth: '100%',
          width: '100%',
          minHeight: '76vh',
          minWidth: '150px',
        }}
      >
        <div style={{ minWidth: 'max-content' }}>
          <div
            className="d-none d-md-flex justify-content-between align-items-center gap-2 p-3 border-bottom"
            style={{
              backgroundColor: '#18273e',
              color: 'white',
              position: 'sticky',
              top: 0,
              zIndex: 10,
            }}
          >
            <span
              className="d-flex gap-2 text-start"
              style={{
                maxWidth: '180px',
                minWidth: '180px',
                position: 'sticky',
                left: 0,
                paddingLeft: 20,
                height: 35,
                // marginBottom:10,
                zIndex: 2,
                background: '#18273e',
              }}
            >
              ClientName
            </span>
            {/* CASE NUMBER Filter */}
            <span
              ref={caseNumberRef}
              className="d-flex gap-2 text-start"
              style={{
                maxWidth: '150px',
                minWidth: '150px',
                color: 'white',
              }}
            >
              Case Number
              <Dropdown show={showCaseFilter} onToggle={() => setCaseFilter(!showCaseFilter)}>
                <Dropdown.Toggle
                  variant=""
                  size="sm"
                  className="custom-dropdown-toggle"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCaseFilter(!showCaseFilter);
                  }}
                >
                  <FontAwesomeIcon icon={faFilter} />
                </Dropdown.Toggle>
                <Dropdown.Menu style={{ maxHeight: '200px', overflowY: 'auto' }}>
                  {['asc', 'desc'].map((order) => (
                    <Dropdown.Item
                      key={order}
                      onClick={(e) => {
                        e.stopPropagation();
                        setFilters((prev) => ({ ...prev, sortOrder: order }));
                        setCaseFilter(false); // ✅ close on selection
                      }}
                    >
                      {order === 'asc' ? 'Ascending' : 'Descending'}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </span>

            {/* REQUEST NUMBER Headings */}

            <span
              className=" text-start"
              style={{
                maxWidth: '150px',
                height: 33,
                minWidth: '150px',
                color: 'white',
              }}
            >
              Request Number
            </span>

            {/* CASE TYPE Filter */}
            <span
              ref={caseTypeRef}
              className="d-flex gap-2 text-start"
              style={{ maxWidth: '200px', minWidth: '200px', color: 'white' }}
            >
              Type of Service
              <Dropdown show={showCaseTypeFilter} onToggle={() => setCaseTypeFilter(!showCaseTypeFilter)}>
                <Dropdown.Toggle
                  variant=""
                  size="sm"
                  className="custom-dropdown-toggle"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCaseFilter(false);
                    setCaseSubTypeFilter(false);
                    setCaseTypeFilter(!showCaseTypeFilter);
                  }}
                >
                  <FontAwesomeIcon
                    icon={faFilter}
                    style={{
                      color:
                        filters.CaseType &&
                        filters.CaseType.length > 0 &&
                        filters.CaseType.length <= CaseTypeList.length
                          ? 'red'
                          : 'white',
                    }}
                  />
                </Dropdown.Toggle>
                <Dropdown.Menu style={{ maxHeight: '250px', overflowY: 'auto' }}>
                  <Dropdown.Item
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFilterChange('CaseType', '__SELECT_ALL__');
                    }}
                  >
                    Select All
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={(e) => {
                      e.stopPropagation();
                      setFilters((prev) => ({ ...prev, CaseType: [] }));
                    }}
                  >
                    Clear All
                  </Dropdown.Item>

                  {/* Blank Option */}
                  <Dropdown.Item
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFilterChange('CaseType', '');
                    }}
                    style={{
                      backgroundColor: filters.CaseType.includes('') ? '' : '',
                      color: 'white',
                    }}
                  >
                    <Form.Check
                      type="checkbox"
                      label="(Blank)"
                      checked={filters.CaseType.includes('')}
                      onChange={() => {}}
                    />
                  </Dropdown.Item>

                  {/* Dynamic Options */}
                  {CaseTypeList.map((type) => (
                    <Dropdown.Item
                      key={type}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFilterChange('CaseType', type);
                      }}
                      style={{
                        backgroundColor: filters.CaseType.includes(type) ? '' : '',
                        color: 'white',
                      }}
                    >
                      <Form.Check
                        type="checkbox"
                        label={type}
                        checked={filters.CaseType.includes(type)}
                        onChange={() => {}}
                      />
                    </Dropdown.Item>
                  ))}

                  <Dropdown.Divider />
                  <div className="text-end px-2 pb-2">
                    <div
                      role="button"
                      style={{
                        padding: '4px 12px',
                        border: '1px solid #18273e',
                        borderRadius: '4px',
                        color: 'white',
                        backgroundColor: '#18273e',
                        fontSize: '14px',
                        cursor: 'pointer',
                        display: 'inline-block',
                      }}
                      onClick={() => {
                        handleApplyFilter('CaseType');
                        setCaseTypeFilter(false);
                      }}
                    >
                      Done
                    </div>
                  </div>
                </Dropdown.Menu>
              </Dropdown>
            </span>

            {/* CASE SUB TYPE Filter */}
            <span
              ref={caseSubTypeRef}
              className="d-flex gap-2 text-start"
              style={{ maxWidth: '200px', minWidth: '200px', color: 'white' }}
            >
              Service Type
              <Dropdown show={showCaseSubTypeFilter} onToggle={() => setCaseSubTypeFilter(!showCaseSubTypeFilter)}>
                <Dropdown.Toggle
                  variant=""
                  size="sm"
                  className="custom-dropdown-toggle"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCaseTypeFilter(false);
                    setCaseFilter(false);
                    setCaseSubTypeFilter(!showCaseSubTypeFilter);
                  }}
                >
                  <FontAwesomeIcon
                    icon={faFilter}
                    style={{
                      color:
                        filters.CaseSubType &&
                        filters.CaseSubType.length > 0 &&
                        filters.CaseSubType.length <= Subtypelist.length
                          ? 'red' // kuch select hain lekin sab nahi
                          : 'white',
                    }}
                  />
                </Dropdown.Toggle>
                <Dropdown.Menu style={{ maxHeight: '250px', overflowY: 'auto' }}>
                  <Dropdown.Item
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFilterChange('CaseSubType', '__SELECT_ALL__');
                    }}
                  >
                    Select All
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={(e) => {
                      e.stopPropagation();
                      setFilters((prev) => ({ ...prev, CaseSubType: [] }));
                    }}
                  >
                    Clear All
                  </Dropdown.Item>

                  {/* Blank Option */}
                  <Dropdown.Item
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFilterChange('CaseSubType', '');
                    }}
                    style={{
                      backgroundColor: filters.CaseSubType.includes('') ? '' : '',
                      color: 'white',
                    }}
                  >
                    <Form.Check
                      type="checkbox"
                      label="(Blank)"
                      checked={filters.CaseSubType.includes('')}
                      onChange={() => {}}
                    />
                  </Dropdown.Item>

                  {/* Dynamic Options */}
                  {Subtypelist.map((type) => (
                    <Dropdown.Item
                      key={type}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFilterChange('CaseSubType', type);
                      }}
                      style={{
                        backgroundColor: filters.CaseSubType.includes(type) ? '' : '',
                        color: 'white',
                      }}
                    >
                      <Form.Check
                        type="checkbox"
                        label={type}
                        checked={filters.CaseSubType.includes(type)}
                        onChange={() => {}}
                      />
                    </Dropdown.Item>
                  ))}

                  <Dropdown.Divider />
                  <div className="text-end px-2 pb-2">
                    <div
                      role="button"
                      style={{
                        padding: '4px 12px',
                        border: '1px solid #18273e',
                        borderRadius: '4px',
                        color: 'white',
                        backgroundColor: '#18273e',
                        fontSize: '14px',
                        cursor: 'pointer',
                        display: 'inline-block',
                      }}
                      onClick={() => {
                        handleApplyFilter('CaseSubType');
                        setCaseSubTypeFilter(false);
                      }}
                    >
                      OK
                    </div>
                  </div>
                </Dropdown.Menu>
              </Dropdown>
            </span>

            {/* LFQ Heading */}
            {/* <span className=" text-start" style={{
                           maxWidth: '200px',
                           minWidth: '200px',
                           height: 33,
                           color: 'white'
                         }}>Legal Fee Quatation</span> */}

            {/* service sub type */}
            <span
              className=" text-start"
              style={{
                maxWidth: '200px',
                minWidth: '200px',
                height: 33,
                color: 'white',
              }}
            >
              Service Sub Type
            </span>
            {/* LFA Heading */}
            <span
              className=" text-start"
              style={{
                maxWidth: '200px',
                minWidth: '200px',
                height: 33,
                color: 'white',
              }}
            >
              Legal Fee Agreement
            </span>
            {/* PURPOSE Heading */}
            <span
              className=" text-start"
              style={{
                maxWidth: '250px',
                minWidth: '250px',
                height: 33,
                color: 'white',
              }}
            >
              Purpose
            </span>

            {/* ACTION Heading */}
            <span
              className=" text-end"
              style={{
                maxWidth: '100px',
                minWidth: '100px',
                height: 33,

                color: 'white',
              }}
            >
              Action
            </span>
          </div>

          {[
            ...getFilteredCases()
              .slice((currentPage - 1) * casesPerPage, currentPage * casesPerPage)
              .map((item, index) => (
                <div key={index} className="border-bottom position-relative">
                  {/* Mobile View */}

                  {/* Mobile View */}
                  <div
                    className="d-md-none p-2"
                    style={{
                      maxWidth: '100%',
                      maxHeight: '83vh',
                      overflowY: 'auto',
                      overflowX: 'hidden',
                    }}
                  >
                    {/* Header with dropdown and case info */}
                    <div className="d-flex justify-content-end align-items-start mb-3">
                      {/* Dropdown */}
                      <div className="me-2 flex-shrink-0">
                        <Dropdown
                          show={dropdownOpen === item?.headerCase?._id}
                          onToggle={(isOpen) => setDropdownOpen(isOpen ? item?.headerCase?._id : null)}
                        >
                          <Dropdown.Toggle
                            variant=""
                            size="sm"
                            className="custom-dropdown-toggle"
                            style={{
                              minWidth: '36px',
                              minHeight: '36px',
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              setDropdownOpen(dropdownOpen === item?.headerCase?._id ? null : item?.headerCase?._id);
                            }}
                          >
                            <i className="fa-ellipsis-v"></i>
                          </Dropdown.Toggle>

                          <Dropdown.Menu>
                            {user?.Role === 'admin' && reduxCaseCloseType === '' && (
                              <>
                                <Dropdown.Item
                                  onClick={(event) => {
                                    event.stopPropagation();
                                    handleOpenModal(item?.headerCase);
                                  }}
                                >
                                  Assign Case
                                </Dropdown.Item>

                                <Dropdown.Item
                                  onClick={async (event) => {
                                    event.stopPropagation();
                                    setLoaderOpen(true);
                                    try {
                                      const response = await updateFunction(item?.headerCase);
                                      if (response?.success) setLoaderOpen(false);
                                    } catch (err) {
                                      console.error('Update failed', err);
                                      setLoaderOpen(false);
                                    }
                                  }}
                                >
                                  Update Case
                                </Dropdown.Item>

                                <Dropdown.Item
                                  onClick={(event) => {
                                    event.stopPropagation();
                                    setSelectedCase(item?.headerCase);
                                    setShowMergeModal(true);
                                  }}
                                >
                                  Merge With
                                </Dropdown.Item>

                                <Dropdown.Item
                                  onClick={(event) => {
                                    event.stopPropagation();
                                    setSelectedCase(item?.headerCase);
                                    setShowCloseType(true);
                                  }}
                                >
                                  Close Type
                                </Dropdown.Item>

                                <Dropdown.Item
                                  onClick={(event) => {
                                    event.stopPropagation();
                                    setSelectedCase(item?.headerCase);
                                    setShowCaseType(true);
                                  }}
                                >
                                  {item?.headerCase?.CaseType ? 'Update' : 'Add'} Type of Service
                                </Dropdown.Item>

                                <Dropdown.Item
                                  onClick={(event) => {
                                    event.stopPropagation();
                                    setSelectedCase(item?.headerCase);
                                    setShowSubCaseType(true);
                                  }}
                                >
                                  {item?.headerCase?.CaseSubType ? 'Update' : 'Add'} Service Type
                                </Dropdown.Item>

                                <Dropdown.Item
                                  onClick={(event) => {
                                    event.stopPropagation();
                                    setSelectedCase(item?.headerCase);
                                    setShowCaseStages(true);
                                  }}
                                >
                                  Set Case Stage
                                </Dropdown.Item>
                              </>
                            )}

                            <Dropdown.Item>View Details</Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </div>
                    </div>

                    {/* Additional Case Details */}
                    {/* Additional Case Details */}
                    <div className="d-flex flex-column gap-2 mb-3">
                      {[
                        { label: 'Client:', value: item?.headerCase?.ClientName },
                        { label: 'Case #:', value: item?.headerCase?.CaseNumber },
                        { label: 'Request #:', value: item?.headerCase?.SerialNumber },
                        { label: 'Type of Service:', value: item?.headerCase?.CaseType || 'N/A' },
                        { label: 'Service Type:', value: item?.headerCase?.CaseSubType || 'N/A' },
                        { label: 'Service Sub Type:', value: item?.headerCase?.ServiceSubType || 'N/A' },
                      ].map(
                        (field, index) =>
                          field.value && (
                            <div key={index} className="d-flex flex-wrap align-items-start" style={{ rowGap: '2px' }}>
                              {/* Label */}
                              <span
                                className="text-muted small"
                                style={{
                                  minWidth: '100px', // consistent width for all
                                  flexShrink: 0, // prevents label shrinking
                                  textAlign: 'left',
                                }}
                              >
                                {field.label}
                              </span>

                              {/* Value */}
                              <span
                                className="fw-medium flex-grow-1"
                                style={{
                                  fontSize: '0.9rem',
                                  lineHeight: '1.3rem',
                                  wordWrap: 'break-word',
                                  overflowWrap: 'break-word',
                                  whiteSpace: 'normal',
                                  display: 'inline-block',
                                  textAlign: 'left',
                                }}
                              >
                                {field.value}
                              </span>
                            </div>
                          )
                      )}

                      {/* LFA Link */}
                      {item?.headerCase?.IsLFA && (
                        <div
                          className="fw-medium text-primary text-decoration-underline"
                          style={{
                            fontSize: '0.9rem',
                            cursor: 'pointer',
                            marginLeft: '100px', // align with values
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            dispatch(Caseinfo(item?.headerCase));
                            dispatch(screenChange(27));
                          }}
                        >
                          Go To LFA
                        </div>
                      )}
                    </div>

                    {/* NOTES */}
                    <div className="w-100 mb-3">
                      <div className="text-muted small mb-1">Purpose</div>
                      <textarea
                        className="form-control"
                        rows="2"
                        value={item?.headerCase?.notes || item?.notes || ''}
                        onChange={(e) => handleEdit(item?.headerCase, e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        onBlur={(e) => handleNoteBlur(item?.headerCase?._id, e.target.value)}
                        style={{
                          resize: 'vertical',
                          fontSize: '0.9rem',
                          wordWrap: 'break-word',
                        }}
                      />
                    </div>

                    {/* BUTTON TO TOGGLE SUBCASES */}
                    {item?.subcases?.length > 0 && (
                      <button
                        className="btn"
                        style={{
                          backgroundColor: '#16213e',
                          color: 'white',
                          padding: '8px 20px',
                          borderRadius: '4px',
                          marginTop: 10,
                          fontSize: '14px',
                          border: '2px solid #16213e',
                          minWidth: '160px',
                        }}
                        onClick={() => setExpanded(expanded === item?.headerCase?._id ? null : item?.headerCase?._id)}
                      >
                        {expanded === item?.headerCase?._id ? (
                          <>
                            <i className="fas fa-chevron-up me-2"></i>
                            Hide Subcases ({item?.subcases?.length})
                          </>
                        ) : (
                          <>
                            <i className="fas fa-chevron-down me-2"></i>
                            Show Subcases ({item?.subcases?.length})
                          </>
                        )}
                      </button>
                    )}

                    {/* SUBCASES LIST */}
                    {item?.headerCase?._id &&
                      expanded === item?.headerCase?._id &&
                      item?.subcases?.map((sub, subIndex) => (
                        <div key={sub?._id} className="border rounded p-3 mb-3" style={{ backgroundColor: '#f8f9fa' }}>
                          {/* Subcase Header with Dropdown */}
                          <div className="d-flex flex-column gap-2">
                            {[
                              { label: 'Case #:', value: sub?.CaseNumber },
                              { label: 'Request #:', value: sub?.SerialNumber },
                              { label: 'Type of Service:', value: sub?.CaseType || 'N/A' },
                              { label: 'Service Type:', value: sub?.CaseSubType || 'N/A' },
                              { label: 'Service Sub Type:', value: sub?.ServiceSubType || 'N/A' },
                            ].map(
                              (field, idx) =>
                                field.value && (
                                  <div
                                    key={idx}
                                    className="d-flex flex-wrap align-items-start"
                                    style={{ rowGap: '2px' }}
                                  >
                                    {/* Label */}
                                    <span
                                      className="text-muted small"
                                      style={{
                                        minWidth: '100px',
                                        flexShrink: 0,
                                        textAlign: 'left',
                                      }}
                                    >
                                      {field.label}
                                    </span>

                                    {/* Value */}
                                    <span
                                      className="fw-medium flex-grow-1"
                                      style={{
                                        fontSize: '0.9rem',
                                        lineHeight: '1.3rem',
                                        wordWrap: 'break-word',
                                        overflowWrap: 'break-word',
                                        whiteSpace: 'normal',
                                        display: 'inline-block',
                                        textAlign: 'left',
                                      }}
                                    >
                                      {field.value}
                                    </span>
                                  </div>
                                )
                            )}

                            {/* LFA Link */}
                            {/* Go To LFA Link */}
                            {/* LFA Link */}
                            {item?.headerCase?.IsLFA && (
                              <div className="d-flex align-items-start gap-1">
                                <span
                                  className="text-muted small"
                                  style={{
                                    minWidth: '100px', // same as other labels
                                    flexShrink: 0,
                                  }}
                                >
                                  Action:
                                </span>
                                <span
                                  className="fw-medium text-primary text-decoration-underline"
                                  style={{
                                    fontSize: '0.9rem',
                                    cursor: 'pointer',
                                    wordBreak: 'break-word',
                                  }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    dispatch(Caseinfo(item?.headerCase));
                                    dispatch(screenChange(27));
                                  }}
                                >
                                  Go To LFA
                                </span>
                              </div>
                            )}

                            {/* NOTES / PURPOSE */}
                            <div className="d-flex align-items-start gap-1 w-100 mb-3">
                              <span
                                className="text-muted small"
                                style={{
                                  minWidth: '100px', // consistent with other labels
                                  flexShrink: 0,
                                }}
                              >
                                Purpose:
                              </span>
                              <textarea
                                className="form-control flex-grow-1"
                                rows="2"
                                value={item?.headerCase?.notes || item?.notes || ''}
                                onChange={(e) => handleEdit(item?.headerCase, e.target.value)}
                                onClick={(e) => e.stopPropagation()}
                                onBlur={(e) => handleNoteBlur(item?.headerCase?._id, e.target.value)}
                                style={{
                                  resize: 'vertical',
                                  fontSize: '0.9rem',
                                  wordWrap: 'break-word',
                                  overflowWrap: 'break-word',
                                  whiteSpace: 'normal',
                                  display: 'inline-block',
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>

                  {/* Desktop View - Horizontal Layout */}

                  <div key={item.headerCase?._id}>
                    {/* 🔹 HEADER CASE */}
                    <div
                      className="d-none d-md-flex justify-content-between align-items-center gap-2 p-1"
                      style={{ cursor: 'pointer', backgroundColor: '#ffffff' }}
                      onClick={(e) => {
                        if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'BUTTON') {
                          handleClick(1, item?.headerCase);
                        }
                      }}
                    >
                      {/* Arrow button */}
                      <span
                        style={{ width: '30px', cursor: 'pointer', textAlign: 'center' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (item?.headerCase?._id) {
                            toggleExpand(item?.headerCase?._id);
                          }
                        }}
                      >
                        {item.subcases.length > 0 && item?.headerCase?._id ? (
                          expanded === item?.headerCase?._id ? (
                            <FaChevronDown />
                          ) : (
                            <FaChevronRight />
                          )
                        ) : (
                          ''
                        )}
                      </span>

                      {/* CLIENT NAME */}
                      <span
                        className="text-start d-flex align-items-center"
                        style={{
                          maxWidth: '150px',
                          minWidth: '150px',
                          position: 'sticky',
                          height: '15vh',
                          left: 0,
                          backgroundColor: '#ffffff',
                          zIndex: 2,
                          borderRight: '1px solid #ccc',
                          boxShadow: '2px 0 4px rgba(0, 0, 0, 0.03)',
                          paddingLeft: '1rem',
                          paddingRight: '1rem',
                          whiteSpace: 'normal',
                          wordBreak: 'break-word',
                          overflowWrap: 'break-word',
                          cursor: 'pointer', // 👈 makes it look clickable
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (item?.headerCase?._id) {
                            toggleExpand(item?.headerCase?._id);
                          }
                        }}
                      >
                        {item?.headerCase?.ClientName}
                      </span>

                      {/* CASE NUMBER */}
                      <span className="text-start" style={{ maxWidth: '150px', minWidth: '150px' }}>
                        {item?.headerCase?.CaseNumber}
                      </span>
                      {/* SERIAL NUMBER */}
                      <span className="text-start" style={{ maxWidth: '150px', minWidth: '150px' }}>
                        {item?.headerCase?.SerialNumber}
                      </span>
                      {/* CASE TYPE */}
                      <span className="text-start" style={{ maxWidth: '200px', minWidth: '200px' }}>
                        {item?.headerCase?.CaseType}
                      </span>
                      {/* CASE SUB TYPE */}
                      <span className="text-start" style={{ maxWidth: '200px', minWidth: '200px' }}>
                        {item?.headerCase?.CaseSubType}
                      </span>
                      {/* service SUB TYPE */}
                      <span className="text-start" style={{ maxWidth: '200px', minWidth: '200px' }}></span>
                      {/* LFA */}
                      <div
                        className="text-start"
                        style={{
                          maxWidth: '200px',
                          minWidth: '200px',
                          color: '#007bff',
                          cursor: 'pointer',
                          textDecoration: 'underline',
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          dispatch(Caseinfo(item?.headerCase));
                          dispatch(screenChange(27));
                        }}
                      >
                        {item?.headerCase?.IsLFA ? 'Go To LFA' : ''}
                      </div>
                      {/* NOTES */}
                      <div className="" style={{ maxWidth: '250px', minWidth: '250px' }}>
                        <input
                          className="form-control"
                          type="text"
                          value={item?.headerCase?.notes || item?.notes}
                          onChange={(e) => handleEdit(index, e.target.value)}
                          onBlur={(e) => handleNoteBlur(item?.headerCase?._id, e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>

                      <div
                        className="col d-flex justify-content-end"
                        style={{
                          maxWidth: '100px',
                          minWidth: '100px',
                        }}
                      >
                        <Dropdown
                          show={dropdownOpen === index}
                          onToggle={(isOpen) => setDropdownOpen(isOpen ? index : null)}
                        >
                          <Dropdown.Toggle
                            variant=""
                            size="sm"
                            className="custom-dropdown-toggle"
                            onClick={(e) => {
                              e.stopPropagation();
                              setDropdownOpen(dropdownOpen === index ? null : index);
                            }}
                          ></Dropdown.Toggle>

                          <Dropdown.Menu>
                            {user?.Role === 'admin' && reduxCaseCloseType === '' && (
                              <>
                                {/* <Dropdown.Item
                                          onClick={(event) => {
                                            event.stopPropagation();
                                            handleOpenModal(item?.headerCase);
                                          }}
                                        >
                                          Assign Case
                                        </Dropdown.Item>

                                        <Dropdown.Item
                                          onClick={async (event) => {
                                            event.stopPropagation();
                                            setLoaderOpen(true);
                                            try {
                                              const response = await updateFunction(item?.headerCase);
                                              if (response?.success) setLoaderOpen(false);
                                            } catch (err) {
                                              console.error('Update failed', err);
                                              setLoaderOpen(false);
                                            }
                                          }}
                                        >
                                          Update Case
                                        </Dropdown.Item>

                                        <Dropdown.Item
                                          onClick={(event) => {
                                            event.stopPropagation();
                                            setSelectedCase(item?.headerCase);
                                            setShowMergeModal(true);
                                          }}
                                        >
                                          Merge With
                                        </Dropdown.Item>
                                        <Dropdown.Item
                                          onClick={(event) => {
                                            event.stopPropagation();
                                            setSelectedCase(item?.headerCase);
                                            setShowCloseType(true);
                                          }}
                                        >
                                          Close Type
                                        </Dropdown.Item>

                                        <Dropdown.Item
                                          onClick={(event) => {
                                            event.stopPropagation();
                                            setSelectedCase(item?.headerCase);
                                            setShowCaseType(true);
                                          }}
                                        >
                                          {item?.headerCase.CaseType ? 'Update' : 'Add'} Type of Service
                                        </Dropdown.Item>

                                        <Dropdown.Item
                                          onClick={(event) => {
                                            event.stopPropagation();
                                            setSelectedCase(item?.headerCase);
                                            setShowSubCaseType(true);
                                          }}
                                        >
                                          {item?.headerCase.CaseSubType ? 'Update' : 'Add'} Service Type
                                        </Dropdown.Item>

                                        <Dropdown.Item
                                          onClick={(event) => {
                                            event.stopPropagation();
                                            setSelectedCase(item?.headerCase);
                                            setShowCaseStages(true);
                                          }}
                                        >
                                          Set Case Stage
                                        </Dropdown.Item> */}
                              </>
                            )}
                            <Dropdown.Item>View Details</Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </div>
                    </div>

                    {/* 🔽 SUBCASES (same style) */}
                    {item?.headerCase?._id &&
                      expanded === item?.headerCase?._id &&
                      item?.subcases?.map((sub, subIndex) => (
                        <div
                          key={sub?._id}
                          className="d-none d-md-flex justify-content-between align-items-center gap-2 p-1"
                          style={{
                            cursor: 'pointer',
                            backgroundColor: '#fafafa', // halka fark dikhane k liye optional
                          }}
                          onClick={(e) => {
                            if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'BUTTON') {
                              handleClick(1, sub);
                            }
                          }}
                        >
                          {/* Empty arrow space */}
                          <span style={{ width: '30px' }}></span>

                          {/* CLIENT NAME */}
                          <span
                            className="text-start d-flex align-items-center"
                            style={{
                              maxWidth: '150px',
                              minWidth: '150px',
                              position: 'sticky',
                              height: '11vh',
                              left: 0,
                              backgroundColor: '#ffffff',
                              zIndex: 2,
                              borderRight: '1px solid #ccc',
                              boxShadow: '2px 0 4px rgba(0, 0, 0, 0.03)',
                              paddingLeft: '1rem',
                            }}
                          >
                            {/* {sub?.ClientName} */}
                          </span>

                          <span className="text-start" style={{ maxWidth: '150px', minWidth: '150px' }}>
                            {sub?.CaseNumber}
                          </span>

                          <span className="text-start" style={{ maxWidth: '150px', minWidth: '150px' }}>
                            {sub?.SerialNumber}
                          </span>

                          <span className="text-start" style={{ maxWidth: '200px', minWidth: '200px' }}>
                            {sub?.CaseType}
                          </span>

                          <span className="text-start" style={{ maxWidth: '200px', minWidth: '200px' }}>
                            {sub?.CaseSubType}
                          </span>
                          {/** service sub type */}
                          <span className="text-start" style={{ maxWidth: '200px', minWidth: '200px' }}></span>

                          {/* LFA */}
                          <div
                            className="text-start"
                            style={{
                              maxWidth: '200px',
                              minWidth: '200px',
                              color: '#007bff',
                              cursor: 'pointer',
                              textDecoration: 'underline',
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              dispatch(Caseinfo(sub));
                              dispatch(screenChange(27));
                            }}
                          >
                            {sub?.IsLFA ? 'Go To LFA' : ''}
                          </div>

                          {/* NOTES */}
                          <div className="" style={{ maxWidth: '250px', minWidth: '250px' }}>
                            <input
                              className="form-control"
                              type="text"
                              value={sub.notes || ''}
                              onChange={(e) => handleSubEdit(index, subIndex, e.target.value)}
                              onBlur={(e) => handleNoteBlur(sub._id, e.target.value)}
                              onClick={(e) => e.stopPropagation()}
                            />
                          </div>

                          <div
                            className="col d-flex justify-content-end"
                            style={{
                              maxWidth: '100px',
                              minWidth: '100px',
                            }}
                          >
                            <Dropdown
                              show={dropdownOpen === sub?._id}
                              onToggle={(isOpen) => setDropdownOpen(isOpen ? sub._id : null)}
                            >
                              <Dropdown.Toggle
                                variant=""
                                size="sm"
                                className="custom-dropdown-toggle"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setDropdownOpen(dropdownOpen === sub._id ? null : sub._id);
                                }}
                              ></Dropdown.Toggle>

                              <Dropdown.Menu>
                                {user?.Role === 'admin' && reduxCaseCloseType === '' && (
                                  <>
                                    {/* <Dropdown.Item
                                              onClick={(event) => {
                                                event.stopPropagation();
                                                handleOpenModal(sub);
                                              }}
                                            >
                                              Assign Case
                                            </Dropdown.Item>

                                            <Dropdown.Item
                                              onClick={async (event) => {
                                                event.stopPropagation();
                                                setLoaderOpen(true);
                                                try {
                                                  const response = await updateFunction(sub);
                                                  if (response?.success) setLoaderOpen(false);
                                                } catch (err) {
                                                  console.error('Update failed', err);
                                                  setLoaderOpen(false);
                                                }
                                              }}
                                            >
                                              Update Case
                                            </Dropdown.Item>

                                            <Dropdown.Item
                                              onClick={(event) => {
                                                event.stopPropagation();
                                                setSelectedCase(sub);
                                                setShowMergeModal(true);
                                              }}
                                            >
                                              Merge With
                                            </Dropdown.Item>
                                            <Dropdown.Item
                                              onClick={(event) => {
                                                event.stopPropagation();
                                                setSelectedCase(sub);
                                                setShowCloseType(true);
                                              }}
                                            >
                                              Close Type
                                            </Dropdown.Item>

                                            <Dropdown.Item
                                              onClick={(event) => {
                                                event.stopPropagation();
                                                setSelectedCase(sub);
                                                setShowCaseType(true);
                                              }}
                                            >
                                              {item?.CaseType ? 'Update' : 'Add'} Type of Service
                                            </Dropdown.Item>

                                            <Dropdown.Item
                                              onClick={(event) => {
                                                event.stopPropagation();
                                                setSelectedCase(sub);
                                                setShowSubCaseType(true);
                                              }}
                                            >
                                              {item?.CaseSubType ? 'Update' : 'Add'} Service Type
                                            </Dropdown.Item>

                                            <Dropdown.Item
                                              onClick={(event) => {
                                                event.stopPropagation();
                                                setSelectedCase(sub);
                                                setShowCaseStages(true);
                                              }}
                                            >
                                              Set Case Stage
                                            </Dropdown.Item> */}
                                  </>
                                )}
                                <Dropdown.Item>View Details</Dropdown.Item>
                              </Dropdown.Menu>
                            </Dropdown>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )),
          ]}
        </div>
        {totalPages > 1 && !searchQuery && (
          <div className="p-3">
            <div
              className="d-flex justify-content-center align-items-center"
              style={{
                backgroundColor: '#18273e',
                padding: '10px',
                borderRadius: '8px',
                border: '2px solid #d4af37',
                margin: 'auto',
                maxWidth: '100%',
                width: 'fit-content',
              }}
            >
              <div className="d-flex flex-wrap justify-content-center align-items-center gap-2">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="btn btn-outline-warning"
                >
                  Previous
                </button>
                <div className="d-flex align-items-center">
                  <span className="text-white me-2 d-none d-sm-block">Page</span>
                  <input
                    value={currentPage}
                    min={1}
                    max={totalPages}
                    onChange={(e) => goToPage(Math.max(1, Math.min(totalPages, Number(e.target.value))))}
                    className="form-control text-center"
                    style={{
                      width: '60px',
                      border: '2px solid #d4af37',
                      backgroundColor: '#18273e',
                      color: 'white',
                    }}
                  />
                  <span className="text-white ms-2 d-none d-sm-block">of {totalPages}</span>
                </div>
                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="btn btn-outline-warning"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Pagination - Responsive */}
    </div>
  );
}
