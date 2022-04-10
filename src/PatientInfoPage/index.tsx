import React from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import { apiBaseUrl } from "../constants";
import { useStateValue } from "../state";
import { Patient } from "../types";

const PatientInfoPage = () => {
  const { id } = useParams<{ id: string }>();
  const [{ patients }, dispatch] = useStateValue();
  React.useEffect(() => {
    const fetchAdditionalInfo = async () => {
      try {
        const { data: patientInfoFromApi } = await axios.get<Patient>(
          `${apiBaseUrl}/patients/${id}`
        );
        dispatch({ type: "UPDATE_PATIENT", payload: patientInfoFromApi });
      } catch (e) {
        console.error(e);
      }
    };
    const patient = Object.values(patients).find(
      (patient) => patient.id === id
    );
    if (!patient?.ssn) void fetchAdditionalInfo();
  }, []);

  const patient = patients[`${id}`];

  if (!patient) return null;

  return (
    <div>
      <h3>{patient.name}</h3>
      <p>
        <span>gender: {patient.gender}</span>
        <br /> <span>ssn: {patient.ssn}</span>
        <br />
        <span>occupation: {patient.occupation}</span>
      </p>
    </div>
  );
};

export default PatientInfoPage;
