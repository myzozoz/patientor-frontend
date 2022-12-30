import React, { useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Patient } from '../types';
import { apiBaseUrl } from '../constants';
import { useStateValue } from '../state';

const PatientListPage = () => {
  const [{ patients }, dispatch] = useStateValue();
  const [patient, setPatient] = React.useState<Patient>();

  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const fetchPatient = async () => {
      const response = await axios.get<Patient>(
        `${apiBaseUrl}/patients/${String(id)}`,
      );
      dispatch({ type: 'UPDATE_PATIENT', payload: response.data });
      setPatient(response.data);
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
      entries:{' '}
      {patient?.entries?.map((e) => (
        <p key={String(e)}>String(e)</p>
      ))}
    </div>
  );
};

export default PatientListPage;
