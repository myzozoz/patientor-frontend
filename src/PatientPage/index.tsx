import React, { useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Patient } from '../types';
import { apiBaseUrl } from '../constants';
import { useStateValue, updatePatient } from '../state';
import EntryComponent from '../components/Entry';

const PatientListPage = () => {
  const [{ patients }, dispatch] = useStateValue();
  const [patient, setPatient] = React.useState<Patient>();

  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const fetchPatient = async () => {
      const { data: updatedPatient } = await axios.get<Patient>(
        `${apiBaseUrl}/patients/${String(id)}`,
      );
      dispatch(updatePatient(updatedPatient));
      setPatient(updatedPatient);
    };
    try {
      const current_patient = id && patients[id];
      if (!current_patient || !current_patient.entries) {
        fetchPatient().catch((e) => {
          throw e;
        });
      } else {
        setPatient(current_patient);
      }
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        console.error(e?.response?.data || 'Unrecognized axios error');
      } else {
        console.error('Unknown error', e);
      }
    }
  }, []);

  return (
    <div className='App'>
      <p>
        <b>
          {patient?.name} {`(${String(patient?.gender)})`}
        </b>
      </p>
      ssn: {patient?.ssn}
      <br />
      born: {patient?.dateOfBirth}
      <br />
      occupation: {patient?.occupation}
      <br />
      <p>
        <b>entries:</b>
      </p>
      {patient?.entries?.map((e) => (
        <EntryComponent key={e.id} entry={e} />
      ))}
    </div>
  );
};

export default PatientListPage;
