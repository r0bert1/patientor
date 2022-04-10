import { State } from "./state";
import { Patient } from "../types";

export type Action =
  | {
      type: "SET_PATIENT_LIST";
      payload: Patient[];
    }
  | {
      type: "ADD_PATIENT";
      payload: Patient;
    }
  | {
      type: "UPDATE_PATIENT";
      payload: Patient;
    };

export const updatePatient = (patientInfo: Patient): Action => {
  return { type: "UPDATE_PATIENT", payload: patientInfo };
};

export const setPatientList = (patients: Patient[]): Action => {
  return { type: "SET_PATIENT_LIST", payload: patients };
};

export const addPatient = (patient: Patient): Action => {
  return { type: "ADD_PATIENT", payload: patient };
};

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_PATIENT_LIST":
      return {
        ...state,
        patients: {
          ...action.payload.reduce(
            (memo, patient) => ({ ...memo, [patient.id]: patient }),
            {}
          ),
          ...state.patients,
        },
      };
    case "UPDATE_PATIENT":
      const id = action.payload.id;
      const patientToUpdate = Object.values(state.patients).find(
        (patient) => patient.id === id
      );
      if (patientToUpdate) {
        const updatedPatient: Patient = {
          ...patientToUpdate,
          ssn: action.payload.ssn,
          entries: action.payload.entries,
        };
        return {
          ...state,
          patients: {
            ...state.patients,
            [action.payload.id]: updatedPatient,
          },
        };
      }

      return {
        ...state,
        patients: {
          ...state.patients,
          [action.payload.id]: action.payload,
        },
      };
    case "ADD_PATIENT":
      return {
        ...state,
        patients: {
          ...state.patients,
          [action.payload.id]: action.payload,
        },
      };

    default:
      return state;
  }
};
