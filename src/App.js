import React, { useState } from 'react';
import './App.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function App() {
  const [showPopup, setShowPopup] = useState(false);
  const [segmentName, setSegmentName] = useState('');
  const [schemas, setSchemas] = useState([]);
  const [selectedOption, setSelectedOption] = useState('');
  const [availableOptions, setAvailableOptions] = useState([
    { label: 'First Name', value: 'first_name', type: 'user' },
    { label: 'Last Name', value: 'last_name', type: 'user' },
    { label: 'Gender', value: 'gender', type: 'user' },
    { label: 'Age', value: 'age', type: 'user' },
    { label: 'Account Name', value: 'account_name', type: 'group' },
    { label: 'City', value: 'city', type: 'group' },
    { label: 'State', value: 'state', type: 'group' }
  ]);
  const [validationError, setValidationError] = useState('');

  const handleSaveSegmentClick = () => {
    setShowPopup(true);
    setValidationError('');
  };

  const handleAddNewSchema = () => {
    if (selectedOption) {
      const selectedSchema = availableOptions.find(option => option.value === selectedOption);
      setSchemas([...schemas, selectedSchema]);
      setAvailableOptions(availableOptions.filter(option => option.value !== selectedOption));
      setSelectedOption('');
      setValidationError('');
    } else {
      setValidationError('Please select a schema to add.');
    }
  };

  const handleSchemaChange = (index, newValue) => {
    const oldSchema = schemas[index];
    const newSchema = availableOptions.find(option => option.value === newValue);

    const updatedSchemas = schemas.map((schema, idx) =>
      idx === index ? newSchema : schema
    );

    setAvailableOptions([...availableOptions, oldSchema]);
    setAvailableOptions(options => options.filter(option => option.value !== newValue));

    setSchemas(updatedSchemas);
  };

  const handleSubmit = () => {
    if (!segmentName.trim()) {
      setValidationError('Segment name is required.');
      return;
    }
    if (schemas.length === 0) {
      setValidationError('At least one schema must be added.');
      return;
    }

    const dataToSend = {
      segment_name: segmentName,
      schema: schemas.map(schema => ({ [schema.value]: schema.label }))
    };

    fetch('https://webhook.site/566164c1-ebf2-48e8-b2a8-3cb61cc1ec8f', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dataToSend),
      mode: 'no-cors'
    }).then(()=>{toast.success("Data sent to server")}).catch(error => {
      console.error('Error:', error)
      toast.error("Something went wrong")
    });

    setShowPopup(false);
    setSegmentName('');
    setSchemas([]);
    setAvailableOptions([
      { label: 'First Name', value: 'first_name', type: 'user' },
      { label: 'Last Name', value: 'last_name', type: 'user' },
      { label: 'Gender', value: 'gender', type: 'user' },
      { label: 'Age', value: 'age', type: 'user' },
      { label: 'Account Name', value: 'account_name', type: 'group' },
      { label: 'City', value: 'city', type: 'group' },
      { label: 'State', value: 'state', type: 'group' }
    ]);
  };

  return (
    <div className="App">
  <ToastContainer />

      <div className={showPopup ? "blur" : ""}>
        <div className="header">
          <button className="save-segment-button" onClick={handleSaveSegmentClick}>
            Save segment
          </button>
        </div>
      </div>

      {showPopup && (
        <div className="modal">
          <div className="modal-content">
            <div style={{ background: "#39AEBC", color: "white", fontWeight: "400" }} className="modal-header">
              <button className="close-button" onClick={() => setShowPopup(false)}>
                <svg height="23" width="28" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                  <polygon
                    points="352,128.4 319.7,96 160,256 160,256 160,256 319.7,416 352,383.6 224.7,256"
                    fill="white"
                  />
                </svg>
              </button>
              <h2 style={{ fontWeight: "400", fontSize: "1.2rem" }}>Saving Segment</h2>
            </div>
            <div className="modal-body">
              <label htmlFor="segmentName" className="segment-label">
                Enter the Name of the Segment
              </label>
              <input
                id="segmentName"
                className="segment-input"
                type="text"
                placeholder="Name of the segment"
                value={segmentName}
                onChange={e => setSegmentName(e.target.value)}
              />

              {validationError && (
                <p className="validation-error">{validationError}</p>
              )}

              <p className="schema-instruction">
                To save your segment, you need to add the schemas to build the query
              </p>
              <div className="user-group-traits">
                <span className="user-trait">● <span style={{fontSize:"0.8rem",color:"black"}}>User Traits</span> </span>
                <span className="group-trait">● <span style={{fontSize:"0.8rem",color:"black"}}>Group Traits</span> </span>
              </div>

              <div className="schema-list">
                {schemas.map((schema, index) => (
                  <div key={index} className="schema-item">
                    <span
                      style={{
                        color: schema.type === 'user' ? '#5DDB78' : '#D24572',
                        marginRight: '8px'
                      }}
                    >
                      ●
                    </span>
                    <select
                      value={schema.value}
                      onChange={e => handleSchemaChange(index, e.target.value)}
                      className="schema-select"
                    >
                      {[...availableOptions, schema].map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                    <button
                      style={{ background: "#F2FBF9", border: "none", color: "#9BACBA", fontWeight: "bold", fontSize: "2rem" }}
                      onClick={() => {
                        const removedSchema = schemas[index];
                        setAvailableOptions([...availableOptions, removedSchema]);
                        setSchemas(schemas.filter((_, idx) => idx !== index));
                      }}
                    >
                      -
                    </button>
                  </div>
                ))}
              </div>

              <div className="add-schema-section">
                <select
                  value={selectedOption}
                  onChange={e => setSelectedOption(e.target.value)}
                  className="schema-dropdown"
                >
                  <option value="">Add schema to segment</option>
                  {availableOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
                <button className="add-schema-button" onClick={handleAddNewSchema}>+ Add new schema</button>
              </div>
            </div>

            <div className="modal-footer">
              <button className="save-button" onClick={handleSubmit}>Save the Segment</button>
              <button className="cancel-button" onClick={() => setShowPopup(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
