import React from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import { apiBaseUrl } from "../constants";
import { useStateValue, updatePatient } from "../state";
import {
  Entry,
  OccupationalHealthcareEntry,
  HealthCheckEntry,
  HospitalEntry,
  Patient,
} from "../types";

const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};

const entryStyle = {
  borderStyle: "solid",
  marginBottom: "10px",
  borderWidth: "2px",
  borderRadius: "5px",
  padding: "5px",
};

const EntryDetails: React.FC<{ entry: Entry }> = ({ entry }) => {
  switch (entry.type) {
    case "Hospital":
      return <HospitalEntryDetails entry={entry} />;
    case "HealthCheck":
      return <HealthCheckEntryDetails entry={entry} />;
    case "OccupationalHealthcare":
      return <OccupationalHealthcareEntryDetails entry={entry} />;
    default:
      return assertNever(entry);
  }
};

const HospitalEntryDetails = ({ entry }: { entry: HospitalEntry }) => {
  const [{ diagnoses }] = useStateValue();

  return (
    <div style={entryStyle}>
      <p>
        {entry.date} Hospital
        <br /> <i>{entry.description}</i>
        {entry.discharge && (
          <span>
            <br />
            Discharge: {entry.discharge.date}. {entry.discharge.criteria}
          </span>
        )}
      </p>
      <p>
        {entry.diagnosisCodes?.map((code) => (
          <li key={code}>
            {code} {diagnoses[`${code}`].name}
          </li>
        ))}
      </p>
      <p>diagnose by {entry.specialist}</p>
    </div>
  );
};

const HealthCheckEntryDetails = ({ entry }: { entry: HealthCheckEntry }) => {
  const [{ diagnoses }] = useStateValue();

  return (
    <div style={entryStyle}>
      <p>
        {entry.date} Health Check
        <br /> <i>{entry.description}</i>
        <br /> Health rating: {entry.healthCheckRating === 0 ? "Good" : "Bad"}
      </p>
      <p>
        {entry.diagnosisCodes?.map((code) => (
          <li key={code}>
            {code} {diagnoses[`${code}`].name}
          </li>
        ))}
      </p>
      <p>diagnose by {entry.specialist}</p>
    </div>
  );
};

const OccupationalHealthcareEntryDetails = ({
  entry,
}: {
  entry: OccupationalHealthcareEntry;
}) => {
  const [{ diagnoses }] = useStateValue();

  return (
    <div style={entryStyle}>
      <p>
        {entry.date} Occupational Healthcare, Employer: {entry.employerName}
        <br /> <i>{entry.description}</i>
        {entry.sickLeave && (
          <span>
            <br />
            Sick leave: {entry.sickLeave.startDate} - {entry.sickLeave.endDate}
          </span>
        )}
      </p>
      <p>
        {entry.diagnosisCodes?.map((code) => (
          <li key={code}>
            {code} {diagnoses[`${code}`].name}
          </li>
        ))}
      </p>
      <p>diagnose by {entry.specialist}</p>
    </div>
  );
};

const PatientInfoPage = () => {
  const { id } = useParams<{ id: string }>();
  const [{ patients }, dispatch] = useStateValue();
  React.useEffect(() => {
    const fetchAdditionalInfo = async () => {
      try {
        const { data: patientInfoFromApi } = await axios.get<Patient>(
          `${apiBaseUrl}/patients/${id}`
        );
        dispatch(updatePatient(patientInfoFromApi));
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
      <div>
        <h4>entries</h4>
        {patient.entries?.map((entry) => (
          <EntryDetails key={entry.id} entry={entry} />
        ))}
      </div>
    </div>
  );
};

export default PatientInfoPage;
