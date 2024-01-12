import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { Form, Row, Col, Dropdown, DropdownButton } from "react-bootstrap";

import { DEPARTMENTS_LIST, JOB_TITLE_LIST } from "../apollo/queries";

import Loader from "../pages/loading";
import BackTitle from "../components/back-title";

function AddCurator() {
  const [departmentList, setDepartmentList] = useState([]);
  const [jobTitleList, setJobTitleList] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState(null);
  const [selectedJobTitle, setSelectedJobTitle] = useState(null);
  const [selectedJotTitleId, setSelectedJotTitleId] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedItemJobTitle, setSelectedItemJobTitle] = useState(null);
  const location = useLocation();
  const [linkPrev, setLinkPrev] = useState(null);

  const [nameValue, setNameValue] = useState("");
  const [phoneValue, setPhoneValue] = useState("");

  const { loading, error, data } = useQuery(DEPARTMENTS_LIST);
  const {
    loading: loadingJobTitle,
    error: errorJobTitle,
    data: dataJobTitle,
  } = useQuery(JOB_TITLE_LIST);

  useEffect(() => {
    if (data && data.departmentList) {
      setDepartmentList(data.departmentList);
    }
    if (dataJobTitle && dataJobTitle.jobTitleList) {
      setJobTitleList(dataJobTitle.jobTitleList);
    }
    if (location.state && location.state.linkPrev) {
      setLinkPrev(location.state.linkPrev);
    }
  }, [data, dataJobTitle, location.state]);

  const handleNameChange = () => {};

  const handlePhoneChange = () => {};

  const handleDepartmentClick = (department, departmentId) => {
    setSelectedItem(department);
    setSelectedDepartment(department);
    setSelectedDepartmentId(departmentId);
  };

  const handleJobTitleClick = (jobTitle, jobTitleId) => {
    setSelectedItemJobTitle(jobTitle);
    setSelectedJobTitle(jobTitle);
    setSelectedJotTitleId(jobTitleId);
  };

  return (
    <>
      <BackTitle title="Все кураторы" linkPrev={linkPrev} />
      <h2>Добавить куратора</h2>
      <Row className="form__row">
        <Col md={4} col={12} className="form__column">
          <Form.Group controlId="NameForm">
            <Form.Control
              type="text"
              placeholder="ФИО"
              value={nameValue}
              onChange={handleNameChange}
            />
          </Form.Group>
          <Form.Group controlId="PhoneForm">
            <Form.Control
              type="phone"
              placeholder="Номер телефона"
              value={phoneValue}
              onChange={handlePhoneChange}
            />
          </Form.Group>
          <DropdownButton
            id="dropdown-custom-1"
            title={selectedItem || "Выбрать департамент"}
          >
            {departmentList.map((department, index) => (
              <Dropdown.Item
                key={index}
                onClick={() =>
                  handleDepartmentClick(department.name.stroke, department.id)
                }
                href="#"
              >
                {department.name.stroke}
              </Dropdown.Item>
            ))}
          </DropdownButton>

          <DropdownButton
            id="dropdown-custom-1"
            title={selectedItemJobTitle || "Должность"}
          >
            {jobTitleList.map((jobTitle, index) => (
              <Dropdown.Item
                key={index}
                onClick={() =>
                  handleJobTitleClick(jobTitle.name.stroke, jobTitle.id)
                }
                href="#"
              >
                {jobTitle.name.stroke}
              </Dropdown.Item>
            ))}
          </DropdownButton>
        </Col>
      </Row>
    </>
  );
}

export default AddCurator;
